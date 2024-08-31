import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import defaultImage from "../../Images/user/default.jpg";
import BreadcrumbPage from "@/Components/Breadcrumbs/BreadcrumbPage";
import { PageProps } from "@/types";
import {
    FormEvent,
    PropsWithChildren,
    useEffect,
    useRef,
    useState,
} from "react";
import { spawn } from "child_process";
import axios from "axios";
import { PencilIcon, PencilSquareIcon } from "@heroicons/react/20/solid";
import ModalToAction from "@/Components/Modal/ModalToAction";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import Switch from "@/Components/Switch";
import Checkbox from "@/Components/Checkbox";
import TextArea from "@/Components/TextArea";
import Swal from "sweetalert2";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import { Datepicker } from "flowbite-react";
import Select from "react-tailwindcss-select";

export default function DetailBankAccountEmployee({
    show,
    modal,
    bank,
    optionsBank,
    idEmployee,
    handleSuccess,
    detailBank,
}: PropsWithChildren<{
    show: any;
    modal: any;
    bank: any;
    optionsBank: any;
    idEmployee: any;
    handleSuccess: any;
    detailBank: any;
}>) {
    useEffect(() => {
        setDataEditBankAccount({
            BANK_ACCOUNT: detailBank,
        });
    }, [detailBank]);

    const [dataEditBankAccount, setDataEditBankAccount] = useState<any>({
        idEmployee: "",
        BANK_ACCOUNT: [
            {
                EMPLOYEE_ID: idEmployee,
                EMPLOYEE_BANK_ACCOUNT_NAME: "",
                EMPLOYEE_BANK_ACCOUNT_NUMBER: "",
                BANK_ID: "",
            },
        ],
    });

    const bankSelect = bank?.map((query: any) => {
        return {
            value: query.BANK_ID,
            label: query.BANK_ABBREVIATION,
        };
    });

    const addRowBankAccount = (e: FormEvent) => {
        e.preventDefault();
        setDataEditBankAccount({
            ...dataEditBankAccount,
            BANK_ACCOUNT: [
                ...dataEditBankAccount.BANK_ACCOUNT,
                {
                    EMPLOYEE_ID: idEmployee,
                    EMPLOYEE_BANK_ACCOUNT_NAME: "",
                    EMPLOYEE_BANK_ACCOUNT_NUMBER: "",
                    BANK_ID: null,
                    m_for_bank: null,
                },
            ],
        });
        // setDataEditBankAccount([
        //     ...dataEditBankAccount.BANK_ACCOUNT,
        //     {
        //         idEmployee: idEmployee,
        //         EMPLOYEE_BANK_ACCOUNT_NAME: "",
        //         EMPLOYEE_BANK_ACCOUNT_NUMBER: "",
        //         EMPLOYEE_BANK_ACCOUNT_FOR: "",
        //         BANK_ID: "",
        //     },
        // ]);
    };

    const getNameBank = (value: any) => {
        if (value) {
            const selected = bankSelect.filter(
                (option: any) => option.value === parseInt(value)
            );
            return selected[0]?.label;
        }
    };
    // const getNameBank = (value: any) => {
    //     if (value) {
    //         const selected = bank.filter(
    //             (option: any) => option.BANK_ID === parseInt(value)
    //         );
    //         const nameBank = selected[0];
    //         if (nameBank !== undefined) {
    //             return {
    //                 label: nameBank.BANK_ABBREVIATION,
    //                 value: value,
    //             };
    //         } else {
    //             return null;
    //         }
    //     }
    // };

    const getNameForBank = (dB: any, i: number) => {
        const bankFor = dB.m_for_bank?.map((query: any) => {
            if (query.for_bank === undefined) {
                return {
                    value: query.value,
                    label: query.label,
                };
            } else {
                return {
                    value: query.for_bank.FOR_BANK_ACCOUNT_ID,
                    label: query.for_bank.FOR_BANK_ACCOUNT_NAME,
                };
            }
        });
        console.log("avaa", bankFor);
        return bankFor;
    };

    const inputDataBank = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...dataEditBankAccount.BANK_ACCOUNT];
        changeVal[i][name] = value;
        setDataEditBankAccount({
            ...dataEditBankAccount,
            BANK_ACCOUNT: changeVal,
        });
    };

    const inputDataBankId = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...dataEditBankAccount.BANK_ACCOUNT];
        changeVal[i][name] = value;
        setDataEditBankAccount({
            ...dataEditBankAccount,
            BANK_ACCOUNT: changeVal,
        });
    };

    const inputDataForBank = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...dataEditBankAccount.BANK_ACCOUNT];
        changeVal[i].m_for_bank = value;
        // console.log(changeVal);
        setDataEditBankAccount({
            ...dataEditBankAccount,
            BANK_ACCOUNT: changeVal,
        });
    };

    // const optionsBank = [
    //     {
    //         EMPLOYEE_BANK_ACCOUNT_FOR: "1",
    //         EMPLOYEE_BANK_ACCOUNT_FOR_LABEL: "Payroll",
    //     },
    //     {
    //         EMPLOYEE_BANK_ACCOUNT_FOR: "2",
    //         EMPLOYEE_BANK_ACCOUNT_FOR_LABEL: "Cash Advance",
    //     },
    //     {
    //         EMPLOYEE_BANK_ACCOUNT_FOR: "3",
    //         EMPLOYEE_BANK_ACCOUNT_FOR_LABEL: "Petty Cash",
    //     },
    //     { EMPLOYEE_BANK_ACCOUNT_FOR: "4", EMPLOYEE_BANK_ACCOUNT_FOR_LABEL: "Loan" },
    // ];

    const bankFor = optionsBank?.map((query: any) => {
        return {
            value: query.FOR_BANK_ACCOUNT_ID,
            label: query.FOR_BANK_ACCOUNT_NAME,
        };
    });

    console.log("hasil", dataEditBankAccount.BANK_ACCOUNT);

    const close = () => {
        modal();
        // setDataEditBankAccount({
        //     BANK_ACCOUNT: [
        //         {
        //             idEmployee: idEmployee,
        //             EMPLOYEE_BANK_ACCOUNT_NAME: "",
        //             EMPLOYEE_BANK_ACCOUNT_NUMBER: "",
        //
        //             BANK_ID: "",
        //         },
        //     ],
        // });
    };

    return (
        <>
            <ModalToAdd
                buttonAddOns={""}
                show={show}
                onClose={close}
                title={"Detail & Edit Bank Account"}
                url={`/editBankAccount`}
                data={dataEditBankAccount}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-4xl"
                }
                onSuccess={handleSuccess}
                body={
                    <>
                        {dataEditBankAccount.BANK_ACCOUNT?.map(
                            (dB: any, i: number) => {
                                return (
                                    <div
                                        className="grid grid-cols-8 gap-3"
                                        key={i}
                                    >
                                        {/* <div>
                                        <span>Bank Account {1 + i}</span>
                                    </div> */}
                                        <div className="col-span-2">
                                            <div className="text-sm mb-2 mt-2">
                                                <span>
                                                    Bank Account {1 + i}
                                                </span>
                                            </div>
                                            <Select
                                                classNames={{
                                                    menuButton: () =>
                                                        `flex text-sm text-gray-500 mt-1 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                    menu: "text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                    listItem: ({
                                                        isSelected,
                                                    }: any) =>
                                                        `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                            isSelected
                                                                ? `text-white bg-red-500`
                                                                : `text-gray-500 hover:bg-red-100 hover:text-black`
                                                        }`,
                                                }}
                                                options={bankSelect}
                                                isSearchable={true}
                                                placeholder={"Bank Name *"}
                                                value={{
                                                    label: getNameBank(
                                                        dB.BANK_ID
                                                    ),
                                                    value: dB.BANK_ID,
                                                }}
                                                // value={getNameBank(dB.BANK_ID)}
                                                // onChange={(e) =>
                                                //     inputDataBank(
                                                //         "BANK_ID",
                                                //         e.target.value,
                                                //         i
                                                //     )
                                                // }
                                                onChange={(val: any) => {
                                                    inputDataBankId(
                                                        "BANK_ID",
                                                        val.value,
                                                        i
                                                    );
                                                    inputDataBank(
                                                        "EMPLOYEE_BANK_ACCOUNT_NAME",
                                                        val.label,
                                                        i
                                                    );
                                                }}
                                                primaryColor={"bg-red-500"}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <TextInput
                                                id="EMPLOYEE_BANK_ACCOUNT_NUMBER"
                                                type="text"
                                                name="EMPLOYEE_BANK_ACCOUNT_NUMBER"
                                                value={
                                                    dB.EMPLOYEE_BANK_ACCOUNT_NUMBER
                                                }
                                                className="mt-9"
                                                onChange={(e) => {
                                                    inputDataBank(
                                                        "EMPLOYEE_BANK_ACCOUNT_NUMBER",
                                                        e.target.value,
                                                        i
                                                    );
                                                    inputDataBank(
                                                        "EMPLOYEE_BANK_ACCOUNT_FOR",
                                                        "flag",
                                                        i
                                                    );
                                                }}
                                                placeholder="Bank Account Number *"
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <Select
                                                classNames={{
                                                    menuButton: () =>
                                                        `flex text-sm text-gray-500 mt-9 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                    menu: "absolute text-left z-20 w-fit bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                    listItem: ({
                                                        isSelected,
                                                    }: any) =>
                                                        `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                            isSelected
                                                                ? `text-white bg-primary-pelindo`
                                                                : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
                                                        }`,
                                                }}
                                                options={bankFor}
                                                isSearchable={true}
                                                isMultiple={true}
                                                placeholder={
                                                    "Select For Bank Account *"
                                                }
                                                isClearable={true}
                                                value={getNameForBank(dB, i)}
                                                onChange={(val: any) => {
                                                    inputDataForBank(
                                                        "FOR_BANK_ACCOUNT_ID",
                                                        val,
                                                        i
                                                    );
                                                }}
                                                primaryColor={"bg-red-500"}
                                            />
                                        </div>
                                        <div className="">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className=" h-6 text-red-500 cursor-pointer font-semibold mt-11"
                                                onClick={() => {
                                                    const updatedData =
                                                        dataEditBankAccount.BANK_ACCOUNT.filter(
                                                            (
                                                                data: any,
                                                                a: number
                                                            ) => a !== i
                                                        );
                                                    setDataEditBankAccount({
                                                        ...dataEditBankAccount,
                                                        BANK_ACCOUNT:
                                                            updatedData,
                                                    });
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
                                );
                            }
                        )}
                        <div className="mt-3">
                            <a
                                className="text-sm cursor-pointer text-slate-500"
                                onClick={(e) => addRowBankAccount(e)}
                            >
                                <span className="hover:underline hover:decoration-from-font">
                                    <i>+ Add Bank Account</i>
                                </span>
                            </a>
                        </div>
                    </>
                }
            />
        </>
    );
}
