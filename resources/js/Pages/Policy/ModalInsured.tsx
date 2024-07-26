import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import defaultImage from "../../Images/user/default.jpg";
// import BreadcrumbPage from "@/Components/Breadcrumbs/BreadcrumbPage";
import { PageProps } from "@/types";
import {
    CheckIcon,
    HandThumbUpIcon,
    UserIcon,
} from "@heroicons/react/20/solid";
import { FormEvent, PropsWithChildren, useEffect, useState } from "react";
import axios from "axios";
import CurrencyInput from "react-currency-input-field";
import Button from "@/Components/Button/Button";
import ModalToAction from "@/Components/Modal/ModalToAction";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import Swal from "sweetalert2";
import SwitchPage from "@/Components/Switch";
import ModalToAdd from "@/Components/Modal/ModalToAdd";

export default function ModalInsured({
    policy,
    currency,
}: PropsWithChildren<{
    policy: any | null;
    currency: any | null;
}>) {
    const [dataInsured, setDataInsured] = useState<any>([]);

    const [modal, setModal] = useState({
        add: false,
        delete: false,
        edit: false,
        view: false,
        document: false,
        search: false,
        addInsurer: false,
        editInsurer: false,
        addCoverage: false,
        editCoverage: false,
        addInsured: false,
    });

    // Add Policy Coverage

    const fieldDataInsured: any = {
        POLICY_ID: "",
        POLICY_COVERAGE_NAME: "",
        policy_coverage_detail: [
            {
                POLICY_COVERAGE_ID: "",
                CURRENCY_ID: "",
                SUM_INSURED: 0,
                RATE: 0,
                GROSS_PREMIUM: 0,
                LOST_LIMIT_PERCENTAGE: 0,
                LOST_LIMIT_AMOUNT: 0,
                LOST_LIMIT_SCALE: 0,
                INSURANCE_DISC_PERCENTAGE: 0,
                INSURANCE_DISC_AMOUNT: 0,
                PREMIUM: 0,
            },
        ],
    };

    const handleAddInsured = async (policy_id: any) => {
        setDataInsured([{ ...fieldDataInsured, POLICY_ID: policy_id }]);
        setModal({
            add: false,
            delete: false,
            edit: false,
            view: false,
            document: false,
            search: false,
            addInsurer: false,
            editInsurer: false,
            addCoverage: false,
            editCoverage: false,
            addInsured: !modal.addInsured,
        });
    };

    const addRowInsured = (e: FormEvent) => {
        e.preventDefault();
        setDataInsured([
            ...dataInsured,
            // { ...fieldDataInsured, POLICY_ID: policy.POLICY_ID },
        ]);
    };

    const deleteRowInsured = (i: number) => {
        const items = [...dataInsured];
        items.splice(i, 1);
        setDataInsured(items);
    };

    const addRowInsuredDetail = (e: FormEvent, i: number) => {
        e.preventDefault();
        const items = [...dataInsured];
        let item = {
            ...items[i],
            policy_coverage_detail: [
                ...items[i].policy_coverage_detail,
                {
                    POLICY_COVERAGE_ID: "",
                    CURRENCY_ID: "",
                    SUM_INSURED: 0,
                    RATE: 0,
                    GROSS_PREMIUM: 0,
                    LOST_LIMIT_PERCENTAGE: 0,
                    LOST_LIMIT_AMOUNT: 0,
                    LOST_LIMIT_SCALE: 0,
                    INSURANCE_DISC_PERCENTAGE: 0,
                    INSURANCE_DISC_AMOUNT: 0,
                    PREMIUM: 0,
                },
            ],
        };
        items[i] = item;

        setDataInsured(items);
    };

    const deleteRowInsuredDetail = (
        insuredNum: number,
        detailNum: number
    ) => {
        const items = [...dataInsured];
        const item = { ...items[insuredNum] };
        item.policy_coverage_detail.splice(detailNum, 1);
        items[insuredNum] = item;
        setDataInsured(items);
    };

    const inputInsuredDetail = (
        name: string,
        value: any,
        insuredNum: number,
        detailNum: number
    ) => {
        const items = [...dataInsured];
        const item = { ...items[insuredNum] };
        const policy_coverage_details = [...item.policy_coverage_detail];
        const policy_coverage_detail = {
            ...policy_coverage_details[detailNum],
        };
        policy_coverage_detail[name] = value;
        policy_coverage_details[detailNum] = policy_coverage_detail;
        item.policy_coverage_detail = policy_coverage_details;
        items[insuredNum] = item;
        setDataInsured(items);
    };

    const inputDataInsured = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const items = [...dataInsured];
        const item = { ...items[i] };
        item[name] = value;
        items[i] = item;
        setDataInsured(items);
    };
    // console.log("dataEditPolicyCoverage: ", dataEditPolicyCoverage);
    // End Add Policy Coverage

    const handleSuccessInsured = (message: string) => {
        Swal.fire({
            title: "Success",
            text: "Succeed Register Insured",
            icon: "success",
        }).then((result: any) => {
            if (result.value) {
                // getDataCoverageName(policy.POLICY_ID);
                setModal({
                    add: false,
                    delete: false,
                    edit: false,
                    view: false,
                    document: false,
                    search: false,
                    addInsurer: false,
                    editInsurer: false,
                    addCoverage: false,
                    editCoverage: false,
                    addInsured: false,
                });
            }
        });
        setDataInsured([]);
    };

    return (
        <>
            {/* Modal Add Insured */}
            <ModalToAdd
                show={modal.addInsured}
                onClose={() => {
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                        addInsurer: false,
                        editInsurer: false,
                        addCoverage: false,
                        editCoverage: false,
                        addInsured: false,
                    });
                    //     setSumByCurrency([]);
                    // setDataInsurer([]);
                    // setDataInsured([]);
                }}
                title={"Add Insured"}
                url={`/insertManyInsured`}
                data={dataInsured}
                onSuccess={handleSuccessInsured}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-4 sm:w-full sm:max-w-lg lg:max-w-4xl"
                }
                body={
                    <>
                        <div className="container mx-auto overflow-x-auto border-x border-t my-10">
                            <table className="table-auto w-full">
                                <thead className="border-b">
                                    <tr
                                        style={{ backgroundColor: "#5CB25A" }}
                                        className="text-white font-bold h-10"
                                    >
                                        <th className="text-center md:p-4 p-0 md:w-32 w-10 border-r border-gray-300">
                                            Subject Code
                                        </th>
                                        <th className="text-center md:p-4 p-0 md:w-96 w-none ">
                                            Subject Name
                                        </th>
                                        <th
                                            colSpan={3}
                                            className="text-center p-4 border border-t-0 border-gray-300"
                                        >
                                            Marks
                                        </th>
                                        <th className="text-center md:p-4 p-0 md:w-32 w-10 border-r border-gray-300">
                                            Grade
                                        </th>
                                    </tr>
                                    <tr
                                        style={{ backgroundColor: "#5CB25A" }}
                                        className="border-b border-gray-400 font-bold h-10 text-white"
                                    >
                                        <th className="text-center p-4 border-r text-base"></th>
                                        <th className="text-center p-4"></th>
                                        <th className="text-center p-4 border ">
                                            Theory
                                        </th>
                                        <th className="text-center p-4 border ">
                                            MCQ
                                        </th>
                                        <th className="text-center p-4 border ">
                                            Total
                                        </th>
                                        <th className="text-center p-4"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="hover:bg-gray-50 text-center border-b-0 border-b-none h-10">
                                        <td className="p-0 border-l border-r">
                                            001
                                        </td>
                                        <td className="p-0 border-l border-r">
                                            English 1
                                        </td>
                                        <td className="p-0 border-l border-r">
                                            40
                                        </td>
                                        <td className="p-0 border-l border-r">
                                            40
                                        </td>
                                        <td className="p-0 border-l border-r"></td>
                                        <td className="p-0 border-l border-r"></td>
                                    </tr>
                                    <tr className="border -b border-t-0 hover:bg-gray-50 text-center h-10">
                                        <td className="p-0 border-l border-r">
                                            001
                                        </td>
                                        <td className="p-0 border-l border-r">
                                            English 1
                                        </td>
                                        <td className="p-0 border-l border-r">
                                            40
                                        </td>
                                        <td className="p-0 border-l border-r">
                                            40
                                        </td>
                                        <td className="p-0 border-l border-r">
                                            80
                                        </td>
                                        <td className="p-0 border-l border-r">
                                            A+
                                        </td>
                                    </tr>
                                    <tr className="border-b hover:bg-gray-50 text-center h-10">
                                        <td className="p-4 border">001</td>
                                        <td className="p-4 border">
                                            English 1
                                        </td>
                                        <td className="p-4 border">40</td>
                                        <td className="p-4 border">40</td>
                                        <td className="p-4 border"></td>
                                        <td className="p-4 border">A+</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        {dataInsured.map((insured: any, i: number) => (
                            <div className="mt-4 mb-4 ml-4 mr-4">
                                <div className="shadow-md border-2 mt-3">
                                    <div className=" ml-4 mr-4 mb-4 mt-3">
                                        <div className="grid grid-cols-5 mb-4">
                                            <div className="">
                                                <InputLabel
                                                    htmlFor="coverage_name"
                                                    value="Coverage Name"
                                                />
                                            </div>
                                            <div className="col-span-3">
                                                <TextInput
                                                    id="coverage_name"
                                                    type="text"
                                                    name="coverage_name"
                                                    value={
                                                        insured.POLICY_COVERAGE_NAME
                                                    }
                                                    className=""
                                                    autoComplete="coverage_name"
                                                    onChange={(e) =>
                                                        inputDataInsured(
                                                            "POLICY_COVERAGE_NAME",
                                                            e.target.value,
                                                            i
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                            {i > 0 ? (
                                                <div>
                                                    <div className="">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth={1.5}
                                                            stroke="currentColor"
                                                            className="mx-auto h-6 text-red-500 cursor-pointer"
                                                            onClick={() => {
                                                                deleteRowInsured(
                                                                    i
                                                                );
                                                            }}
                                                        >
                                                            <path
                                                                fill="#AB7C94"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M6 18 18 6M6 6l12 12"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                            ) : (
                                                ""
                                            )}
                                        </div>
                                        <div className="container mx-auto overflow-x-auto border-x border-t my-10">
                                            <table className="table-auto w-full">
                                                <thead className="border-b">
                                                    <tr
                                                        style={{
                                                            backgroundColor:
                                                                "#5CB25A",
                                                        }}
                                                        className="text-white font-bold h-10"
                                                    >
                                                        <th className="text-center md:p-4 p-0 md:w-32 w-10 border-r border-gray-300">
                                                            Subject Code
                                                        </th>
                                                        <th className="text-center md:p-4 p-0 md:w-96 w-none ">
                                                            Subject Name
                                                        </th>
                                                        <th
                                                            colSpan={3}
                                                            className="text-center p-4 border border-t-0 border-gray-300"
                                                        >
                                                            Marks
                                                        </th>
                                                        <th className="text-center md:p-4 p-0 md:w-32 w-10 border-r border-gray-300">
                                                            Grade
                                                        </th>
                                                    </tr>
                                                    <tr
                                                        style={{
                                                            backgroundColor:
                                                                "#5CB25A",
                                                        }}
                                                        className="border-b border-gray-400 font-bold h-10 text-white"
                                                    >
                                                        <th className="text-center p-4 border-r text-base"></th>
                                                        <th className="text-center p-4"></th>
                                                        <th className="text-center p-4 border ">
                                                            Theory
                                                        </th>
                                                        <th className="text-center p-4 border ">
                                                            MCQ
                                                        </th>
                                                        <th className="text-center p-4 border ">
                                                            Total
                                                        </th>
                                                        <th className="text-center p-4"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr className="hover:bg-gray-50 text-center border-b-0 border-b-none h-10">
                                                        <td className="p-0 border-l border-r">
                                                            001
                                                        </td>
                                                        <td className="p-0 border-l border-r">
                                                            English 1
                                                        </td>
                                                        <td className="p-0 border-l border-r">
                                                            40
                                                        </td>
                                                        <td className="p-0 border-l border-r">
                                                            40
                                                        </td>
                                                        <td className="p-0 border-l border-r"></td>
                                                        <td className="p-0 border-l border-r"></td>
                                                    </tr>
                                                    <tr className="border -b border-t-0 hover:bg-gray-50 text-center h-10">
                                                        <td className="p-0 border-l border-r">
                                                            001
                                                        </td>
                                                        <td className="p-0 border-l border-r">
                                                            English 1
                                                        </td>
                                                        <td className="p-0 border-l border-r">
                                                            40
                                                        </td>
                                                        <td className="p-0 border-l border-r">
                                                            40
                                                        </td>
                                                        <td className="p-0 border-l border-r">
                                                            80
                                                        </td>
                                                        <td className="p-0 border-l border-r">
                                                            A+
                                                        </td>
                                                    </tr>
                                                    <tr className="border-b hover:bg-gray-50 text-center h-10">
                                                        <td className="p-4 border">
                                                            001
                                                        </td>
                                                        <td className="p-4 border">
                                                            English 1
                                                        </td>
                                                        <td className="p-4 border">
                                                            40
                                                        </td>
                                                        <td className="p-4 border">
                                                            40
                                                        </td>
                                                        <td className="p-4 border"></td>
                                                        <td className="p-4 border">
                                                            A+
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg  mb-4 mt-4 ">
                                            {/* <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border">
                                                    <tr className="bg-gray-2 dark:bg-meta-4">
                                                        <th className="min-w-[10px] py-2 px-2 text-sm text-black dark:text-white">
                                                            No.
                                                        </th>
                                                        <th className="min-w-[100px] py-2 px-2 text-sm text-black dark:text-white">
                                                            Currency
                                                        </th>
                                                        <th className="min-w-[50px] py-2 px-2 text-sm text-black dark:text-white">
                                                            Sum Insured
                                                        </th>
                                                        <th className="min-w-[50px] py-2 px-2 text-sm text-black dark:text-white">
                                                            Rate %
                                                        </th>
                                                        <th className="min-w-[50px] py-2 px-2 text-sm text-black dark:text-white">
                                                            Gross Premium
                                                        </th>
                                                        <th className="min-w-[50px] py-2 px-2 text-sm text-black dark:text-white">
                                                            Lost Limit %
                                                        </th>
                                                        <th className="min-w-[100px] py-2 px-2 text-sm text-black dark:text-white">
                                                            Lost Limit Amount
                                                        </th>
                                                        <th className="min-w-[100px] py-2 px-2 text-sm text-black dark:text-white">
                                                            Lost Limit Scale
                                                        </th>
                                                        <th className="min-w-[100px] py-2 px-2 text-sm text-black dark:text-white">
                                                            Insurance Discount %
                                                        </th>
                                                        <th className="min-w-[100px] py-2 px-2 text-sm text-black dark:text-white">
                                                            Insurance Discount
                                                            Amount
                                                        </th>
                                                        <th className="min-w-[100px] py-2 px-2 text-sm text-black dark:text-white">
                                                            Premium
                                                        </th>
                                                        <th className="min-w-[50px] py-2 px-2 text-sm text-black dark:text-white">
                                                            Delete
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {coverage?.policy_coverage_detail?.map(
                                                        (
                                                            detail: any,
                                                            m: number
                                                        ) => {
                                                            return (
                                                                <tr key={m}>
                                                                    <td className="border-b w-10 text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        {m + 1}
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        <select
                                                                            className="mt-0 block w-20 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                            value={
                                                                                detail.CURRENCY_ID
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) => {
                                                                                inputInsuredDetail(
                                                                                    "CURRENCY_ID",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    l,
                                                                                    m
                                                                                );
                                                                            }}
                                                                        >
                                                                            <option
                                                                                value={
                                                                                    ""
                                                                                }
                                                                            >
                                                                                --{" "}
                                                                                <i>
                                                                                    Choose
                                                                                    Currency
                                                                                </i>{" "}
                                                                                --
                                                                            </option>
                                                                            {currency.map(
                                                                                (
                                                                                    currencies: any,
                                                                                    k: number
                                                                                ) => {
                                                                                    return (
                                                                                        <option
                                                                                            key={
                                                                                                k
                                                                                            }
                                                                                            value={
                                                                                                currencies.CURRENCY_ID
                                                                                            }
                                                                                        >
                                                                                            {
                                                                                                currencies.CURRENCY_SYMBOL
                                                                                            }
                                                                                        </option>
                                                                                    );
                                                                                }
                                                                            )}
                                                                        </select>
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        <CurrencyInput
                                                                            id="sum_insured"
                                                                            name="SUM_INSURED"
                                                                            value={
                                                                                detail.SUM_INSURED
                                                                            }
                                                                            decimalScale={
                                                                                2
                                                                            }
                                                                            decimalsLimit={
                                                                                2
                                                                            }
                                                                            onValueChange={(
                                                                                values
                                                                            ) => {
                                                                                inputInsuredDetail(
                                                                                    "SUM_INSURED",
                                                                                    values,
                                                                                    l,
                                                                                    m
                                                                                );
                                                                            }}
                                                                            className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        <CurrencyInput
                                                                            id="rate"
                                                                            name="RATE"
                                                                            value={
                                                                                detail.RATE
                                                                            }
                                                                            decimalScale={
                                                                                2
                                                                            }
                                                                            decimalsLimit={
                                                                                2
                                                                            }
                                                                            onValueChange={(
                                                                                values
                                                                            ) => {
                                                                                inputInsuredDetail(
                                                                                    "RATE",
                                                                                    values,
                                                                                    l,
                                                                                    m
                                                                                );
                                                                            }}
                                                                            className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        <CurrencyInput
                                                                            id="sum_insured"
                                                                            name="GROSS_PREMIUM"
                                                                            value={
                                                                                detail.GROSS_PREMIUM
                                                                            }
                                                                            decimalScale={
                                                                                2
                                                                            }
                                                                            decimalsLimit={
                                                                                2
                                                                            }
                                                                            onValueChange={(
                                                                                values
                                                                            ) => {
                                                                                inputInsuredDetail(
                                                                                    "GROSS_PREMIUM",
                                                                                    values,
                                                                                    l,
                                                                                    m
                                                                                );
                                                                            }}
                                                                            className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        <CurrencyInput
                                                                            id="lost_limit_percentage"
                                                                            name="LOST_LIMIT_PERCENTAGE"
                                                                            value={
                                                                                detail.LOST_LIMIT_PERCENTAGE
                                                                            }
                                                                            decimalScale={
                                                                                2
                                                                            }
                                                                            decimalsLimit={
                                                                                2
                                                                            }
                                                                            onValueChange={(
                                                                                values
                                                                            ) => {
                                                                                inputInsuredDetail(
                                                                                    "LOST_LIMIT_PERCENTAGE",
                                                                                    values,
                                                                                    l,
                                                                                    m
                                                                                );
                                                                            }}
                                                                            className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        <CurrencyInput
                                                                            id="lost_limit_amount"
                                                                            name="LOST_LIMIT_AMOUNT"
                                                                            value={
                                                                                detail.LOST_LIMIT_AMOUNT
                                                                            }
                                                                            decimalScale={
                                                                                2
                                                                            }
                                                                            decimalsLimit={
                                                                                2
                                                                            }
                                                                            onValueChange={(
                                                                                values
                                                                            ) => {
                                                                                inputInsuredDetail(
                                                                                    "LOST_LIMIT_AMOUNT",
                                                                                    values,
                                                                                    l,
                                                                                    m
                                                                                );
                                                                            }}
                                                                            className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        <CurrencyInput
                                                                            id="lost_limit_scale"
                                                                            name="LOST_LIMIT_SCALE"
                                                                            value={
                                                                                detail.LOST_LIMIT_SCALE
                                                                            }
                                                                            decimalScale={
                                                                                2
                                                                            }
                                                                            decimalsLimit={
                                                                                2
                                                                            }
                                                                            onValueChange={(
                                                                                values
                                                                            ) => {
                                                                                inputInsuredDetail(
                                                                                    "LOST_LIMIT_SCALE",
                                                                                    values,
                                                                                    l,
                                                                                    m
                                                                                );
                                                                            }}
                                                                            className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        <CurrencyInput
                                                                            id="insurance_disc_percentage"
                                                                            name="INSURANCE_DISC_PERCENTAGE"
                                                                            value={
                                                                                detail.INSURANCE_DISC_PERCENTAGE
                                                                            }
                                                                            decimalScale={
                                                                                2
                                                                            }
                                                                            decimalsLimit={
                                                                                2
                                                                            }
                                                                            onValueChange={(
                                                                                values
                                                                            ) => {
                                                                                inputInsuredDetail(
                                                                                    "INSURANCE_DISC_PERCENTAGE",
                                                                                    values,
                                                                                    l,
                                                                                    m
                                                                                );
                                                                            }}
                                                                            className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        <CurrencyInput
                                                                            id="insurance_disc_amount"
                                                                            name="INSURANCE_DISC_AMOUNT"
                                                                            value={
                                                                                detail.INSURANCE_DISC_AMOUNT
                                                                            }
                                                                            decimalScale={
                                                                                2
                                                                            }
                                                                            decimalsLimit={
                                                                                2
                                                                            }
                                                                            onValueChange={(
                                                                                values
                                                                            ) => {
                                                                                inputInsuredDetail(
                                                                                    "INSURANCE_DISC_AMOUNT",
                                                                                    values,
                                                                                    l,
                                                                                    m
                                                                                );
                                                                            }}
                                                                            className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td className="border-b text-sm border-[#eee] py-3 px-4 dark:border-strokedark">
                                                                        <CurrencyInput
                                                                            id="premium"
                                                                            name="PREMIUM"
                                                                            value={
                                                                                detail.PREMIUM
                                                                            }
                                                                            decimalScale={
                                                                                2
                                                                            }
                                                                            decimalsLimit={
                                                                                2
                                                                            }
                                                                            onValueChange={(
                                                                                values
                                                                            ) => {
                                                                                inputInsuredDetail(
                                                                                    "PREMIUM",
                                                                                    values,
                                                                                    l,
                                                                                    m
                                                                                );
                                                                            }}
                                                                            className="block w-40 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        {m >
                                                                        0 ? (
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                viewBox="0 0 24 24"
                                                                                strokeWidth={
                                                                                    1.5
                                                                                }
                                                                                stroke="currentColor"
                                                                                className="mx-auto h-6 text-red-500 cursor-pointer"
                                                                                onClick={() => {
                                                                                    deleteRowInsuredDetail(
                                                                                        l,
                                                                                        m
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <path
                                                                                    fill="#AB7C94"
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    d="M6 18 18 6M6 6l12 12"
                                                                                />
                                                                            </svg>
                                                                        ) : (
                                                                            ""
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        }
                                                    )}
                                                    <div className="ml-4 w-40 mb-2 mt-2">
                                                        <a
                                                            href=""
                                                            className="text-xs mt-1 text-primary-pelindo ms-1"
                                                            onClick={(e) =>
                                                                addRowInsuredDetail(
                                                                    e,
                                                                    l
                                                                )
                                                            }
                                                        >
                                                            + Add Row
                                                        </a>
                                                    </div>
                                                </tbody>
                                            </table> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="ml-4 w-40 mb-2 mt-2">
                            <a
                                href=""
                                className="text-xs mt-1 text-primary-pelindo ms-1"
                                onClick={(e) => addRowInsured(e)}
                            >
                                + Add Insured
                            </a>
                        </div>
                    </>
                }
            />
            {/* End Modal Add Insured */}
        </>
    );
}
