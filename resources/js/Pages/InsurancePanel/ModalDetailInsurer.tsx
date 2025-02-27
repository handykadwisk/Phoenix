import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import defaultImage from "../../Images/user/default.jpg";
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
import { parse } from "path";

export default function ModalDetailInsurer({
    insurer,
    listPolicy,
    // endorsements,
    insurance,
    currency,
    onDeleteSuccess,
}: PropsWithChildren<{
    insurer: any;
    listPolicy: any | null;
    // endorsements: any | null;
    insurance: any | null;
    currency: any | null;
    onDeleteSuccess: any;
}>) {
    const [insurancePanels, setInsurancePanels] = useState<any>([]);
    const [xx, setXx] = useState<any>([]);
    const [dataById, setDataById] = useState<any>(insurer);
    const [isCalculate, setIsCalculate] = useState<number>(0);
    const [isEditCalculate, setIsEditCalculate] = useState<number>(0);
    const [endorsements, setEndorsements] = useState<any>([]);
    const [policyPremiums, setpolicyPremiums] = useState<any>([]);
    const [endorsementPremiums, setEndorsementPremiums] = useState<any>([]);
    const [currencyPremiums, setCurrencyPremiums] = useState<any>([]);

    const getEndorsement = async (policy_id: string) => {
        await axios
            .get(`/getEndorsementByPolicyId/${policy_id}`)
            .then((res) => {
                setEndorsements(res.data);
            })
            .catch((err) => console.log(err));
    };

    const premiumType = [
        { id: "1", stat: "Initial Premium" },
        { id: "2", stat: "Additional Premium" },
    ];

    const getPremium = async (
        policy_id: string,
        endorsement_id: string
    ) => {
        await axios
            .post(`/getPremium?`, {
                policy_id: policy_id,
                endorsement_id: endorsement_id,
            })
            .then((res) => {
                if (endorsement_id) {
                    setpolicyPremiums([]);
                    setEndorsementPremiums(res.data);
                } else {
                    setEndorsementPremiums([]);
                    setpolicyPremiums(res.data);
                }
            })
            .catch((err) => console.log(err));
    };

    const getCurrency = async (policy_id: string, endorsement_id: string) => {
        await axios
            .post(`/getCurrency?`, {
                policy_id: policy_id,
                endorsement_id: endorsement_id,
            })
            .then((res) => {
                setCurrencyPremiums(res.data);
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        getInsurancePanel(insurer.IP_ID);
        getEndorsement(insurer.POLICY_ID);
        getPremium(insurer.POLICY_ID, insurer.ENDORSEMENT_ID);
        getCurrency(insurer.POLICY_ID, insurer.ENDORSEMENT_ID);
    }, [insurer.IP_ID]);

    const getInsurancePanel = async (id: number) => {
        // harusnya insurancePanelByEndorsementId
        await axios
            .get(`/insurancePanelByPolicyId/${id}`)
            .then((res) => setInsurancePanels(res.data))
            .catch((err) => console.log(err));
    };
    console.log("dataById: ", dataById);
    console.log("insurer: ", insurer);

    const editClick = () => {
        alert("a");
    };

    const [modal, setModal] = useState({
        add: false,
        delete: false,
        edit: false,
        view: false,
        document: false,
        search: false,
    });

    // edit
    const handleEditModal = async () => {
        // e.preventDefault();
        const id = insurer.IP_ID;

        await axios
            .get(`/getInsurancePanel/${id}`)
            .then((res) => {setDataById(res.data),
                setXx(res.data);
            })
            .catch((err) => console.log(err));

        setModal({
            add: false,
            delete: false,
            edit: !modal.edit,
            view: false,
            document: false,
            search: false,
        });
    };
    console.log('xx: ',xx)

    const editInstallment = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...dataById.installment];
        changeVal[i][name] = value;
        setDataById({ ...dataById, installment: changeVal });
    };

    const addRowEditInstallment = (e: FormEvent) => {
        e.preventDefault();
        setDataById({
            ...dataById,
            installment: [
                ...dataById.installment,
                {
                    INSTALLMENT_TERM: "",
                    INSTALLMENT_PERCENTAGE: "",
                    INSTALLMENT_DUE_DATE: "",
                    INSTALLMENT_AR: "",
                    INSTALLMENT_AP: "",
                    INSTALLMENT_GROSS_BF: "",
                    INSTALLMENT_VAT: "",
                    INSTALLMENT_PPH_23: "",
                    INSTALLMENT_NET_BF: "",
                    INSTALLMENT_ADMIN_COST: "",
                    INSTALLMENT_POLICY_COST: "",
                },
            ],
        });
    };

    const deleteRowEditInstallment = (i: number) => {
        const val = [...dataById.installment];
        val.splice(i, 1);
        if (dataById.installment[i].installment_id !== null) {
            if (dataById.deletedInstallment) {
                setDataById({
                    ...dataById,
                    installment: val,
                    deletedInstallment: [
                        ...dataById.deletedInstallment,
                        {
                            INSTALLMENT_ID:
                                dataById.installment[i].INSTALLMENT_ID,
                        },
                    ],
                });
            } else {
                // alert("b");
                setDataById({
                    ...dataById,
                    installment: val,
                    deletedInstallment: [
                        {
                            INSTALLMENT_ID:
                                dataById.installment[i].INSTALLMENT_ID,
                        },
                    ],
                });
            }
        } else {
            setDataById({
                ...dataById,
                installment: val,
            });
        }
    };
    // end edit

    const handleSuccess = (message: string) => {
        Swal.fire({
            title: "Success",
            text: "New Group Added",
            icon: "success",
        }).then((result: any) => {
            if (result.value) {
                setModal({
                    add: false,
                    delete: false,
                    edit: false,
                    view: false,
                    document: false,
                    search: false,
                });
            }
        });
    };

    const handleDeleteModal = async () => {
        const ip_id = insurer.IP_ID;
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            width: 400,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`/deleteInsurer/${ip_id}`)
                    .then((res) => {
                        console.log(res.data.status);
                        if (res.data.status) {
                            Swal.fire({
                                title: "Deleted!",
                                text: res.data.msg,
                                icon: "success",
                            });
                            onDeleteSuccess(true);
                        } else {
                            Swal.fire({
                                title: "Error!",
                                text: res.data.msg,
                                icon: "error",
                            });
                        }
                    })
                    .catch((err) => console.log(err));
            }
        });
    };

    // Start hitung otomatis
    useEffect(() => {
        if (isEditCalculate != 0) {
            editCalculate();
        } 
        
        // console.log("isCalculate: ",isCalculate);
    }, [isEditCalculate]);

    const editCalculate = () => {
        // console.log("isCalculate: ", isCalculate);
        const iP = dataById.IP_POLICY_INITIAL_PREMIUM;
        const discInsurance = dataById.IP_DISC_INSURANCE;
        const policyShare = dataById.IP_POLICY_SHARE;
        let shareAmount: number = 0;
        let bfAmount: number = 0;
        let vatAmount: number = 0;
        let pphAmount: number = 0;
        let netBF: number = 0;
        // console.log(iP);

        if (iP && policyShare) {
            // console.log("a");
            if (discInsurance) {
                shareAmount =
                    (iP * policyShare) / 100 -
                    (((iP * policyShare) / 100) * discInsurance) / 100;
            } else {
                shareAmount = (iP * policyShare) / 100;
            }
        }

        // BF Amount
        if (dataById.IP_PIP_AFTER_DISC && dataById.IP_POLICY_BF) {
            if (dataById.IP_VAT == 1) {
                bfAmount =
                    (dataById.IP_PIP_AFTER_DISC *
                        (dataById.IP_POLICY_BF / 1.022)) /
                    100;
            } else {
                bfAmount =
                    (dataById.IP_PIP_AFTER_DISC * dataById.IP_POLICY_BF) / 100;
            }
        }

        // vat
        if (bfAmount) {
            vatAmount = (bfAmount * 2.2) / 100;
            pphAmount = (bfAmount * -2) / 100;
            netBF = bfAmount + pphAmount;
        }

        setDataById({
            ...dataById,
            IP_PIP_AFTER_DISC: shareAmount,
            IP_BF_AMOUNT: bfAmount.toFixed(2),
            IP_VAT_AMOUNT: vatAmount.toFixed(2),
            IP_PPH_23: pphAmount.toFixed(2),
            IP_NET_BF: netBF.toFixed(2),
        });

        calculateInstallment();

    };
    const calculateInstallment = () => {
        // Detail Installment
        const prev: any = [...dataById.installment];
        prev.map((installment: any, i: number) => {
            const ar =
                (dataById.IP_PIP_AFTER_DISC *
                    installment.INSTALLMENT_PERCENTAGE) /
                100;
            const grossBf =
                dataById.IP_VAT == 1
                    ? (ar * (dataById.IP_POLICY_BF / 1.022)) / 100
                    : (ar * dataById.IP_POLICY_BF) / 100;
            const vat = (grossBf * 2.2) / 100;
            const pph23 = (grossBf * -2) / 100;
            const netBF = grossBf + pph23;
            // console.log(
            //     ar +
            //         " | " +
            //         netBF +
            //         " | " +
            //         installment.INSTALLMENT_POLICY_COST +
            //         " | " +
            //         grossBf.toFixed(2)
            // );
            const ap = ar - netBF + parseFloat(installment.INSTALLMENT_POLICY_COST);
            console.log(
                ar +
                    " | " +
                    netBF +
                    " | " +
                    parseFloat(installment.INSTALLMENT_POLICY_COST) +
                    " | " +
                    grossBf.toFixed(2) +
                    " | " +
                    ap
            );
            prev[i]["INSTALLMENT_ADMIN_COST"] = 0;
            prev[i]["INSTALLMENT_POLICY_COST"] = 0;
            prev[i]["INSTALLMENT_AR"] = ar.toFixed(2);
            prev[i]["INSTALLMENT_GROSS_BF"] = grossBf.toFixed(2);
            prev[i]["INSTALLMENT_VAT"] = vat.toFixed(2);
            prev[i]["INSTALLMENT_PPH_23"] = pph23.toFixed(2);
            prev[i]["INSTALLMENT_NET_BF"] = netBF.toFixed(2);
            prev[i]["INSTALLMENT_AP"] = ap;
        });
    };

    const reCalculateInstallment = (name: string, value: any, i: number) => {
        // console.log('data: ', data.installment)
        const changeVal: any = [...dataById.installment];
        // console.log('value: ',value)
        // console.log("changeVal: ", changeVal);
        const ap =
            parseFloat(changeVal[i].INSTALLMENT_AR) -
            parseFloat(changeVal[i].INSTALLMENT_NET_BF) +
            // parseFloat(value);
            // parseFloat(changeVal[i].INSTALLMENT_ADMIN_COST) +
            parseFloat(changeVal[i].INSTALLMENT_POLICY_COST);
        // console.log('ap: ',ap)
        changeVal[i]["INSTALLMENT_AP"] = ap;
        setDataById({
            ...dataById,
            installment: changeVal,
        });
    };
    // End hitung otomatis

    return (
        <>
            {/* modal edit */}
            <ModalToAction
                show={modal.edit}
                onClose={() =>
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                    })
                }
                title={"Edit Insurer"}
                url={`/editInsurancePanel/${dataById.IP_ID}`}
                data={dataById}
                onSuccess={handleSuccess}
                method={"patch"}
                headers={null}
                submitButtonName={"Submit"}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-6xl"
                }
                body={
                    <>
                        <div className="grid grid-rows grid-flow-col gap-4 mb-4 ml-4 mr-4">
                            <div>
                                <InputLabel
                                    htmlFor="policy_number"
                                    value="Policy Number"
                                />
                                <select
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                    value={dataById.POLICY_ID}
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            POLICY_ID: e.target.value,
                                            IP_PREMIUM_TYPE:
                                                dataById.ENDORSEMENT_ID ? 2 : 1,
                                        })
                                    }
                                >
                                    <option>
                                        -- <i>Choose Policy Number</i> --
                                    </option>
                                    {listPolicy.map(
                                        (policy: any, i: number) => {
                                            return (
                                                <option
                                                    key={i}
                                                    value={policy.POLICY_ID}
                                                >
                                                    {policy.POLICY_NUMBER}
                                                </option>
                                            );
                                        }
                                    )}
                                </select>
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="endorsement_number"
                                    value="Endorsement Number"
                                />
                                <select
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                    value={dataById.ENDORSEMENT_ID}
                                    onChange={(e) => {
                                        // setData({
                                        //     ...data,
                                        //     endorsement_id: e.target.value,
                                        //     ip_premium_type: e.target.value
                                        //         ? 2
                                        //         : 1,
                                        // }),
                                        setDataById({
                                            ...dataById,
                                            ENDORSEMENT_ID: e.target.value,
                                            IP_PREMIUM_TYPE: e.target.value
                                                ? 2
                                                : 1,
                                        });
                                        // getPremium(
                                        //     data.policy_id,
                                        //     e.target.value
                                        // ),
                                        // getPolicyInstallment(
                                        //     e.target.value,
                                        //     e.target.value
                                        // );
                                    }}
                                >
                                    <option value={""}>
                                        -- <i>Choose Endorsement Number</i> --
                                    </option>
                                    {endorsements.map(
                                        (endorsement: any, i: number) => {
                                            return (
                                                <option
                                                    key={i}
                                                    value={
                                                        endorsement.ENDORSEMENT_ID
                                                    }
                                                >
                                                    {
                                                        endorsement.ENDORSEMENT_NUMBER
                                                    }
                                                </option>
                                            );
                                        }
                                    )}
                                </select>
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="premium_type"
                                    value="Premium Type"
                                />
                                <select
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    value={dataById.IP_PREMIUM_TYPE}
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            IP_PREMIUM_TYPE: e.target.value,
                                        })
                                    }
                                    disabled={true}
                                >
                                    <option>
                                        -- <i>Choose Status</i> --
                                    </option>
                                    {premiumType?.map((status: any) => {
                                        return (
                                            <option value={status.id}>
                                                {status.stat}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-rows grid-flow-col gap-4 mb-4 ml-4 mr-4">
                            <div>
                                <InputLabel
                                    htmlFor="insurance_id"
                                    value="Insurance"
                                />
                                <select
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                    value={dataById.INSURANCE_ID}
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            INSURANCE_ID: e.target.value,
                                        })
                                    }
                                >
                                    <option>
                                        -- <i>Choose Insurance</i> --
                                    </option>
                                    {insurance.map(
                                        (insurances: any, i: number) => {
                                            return (
                                                <option
                                                    key={i}
                                                    value={
                                                        insurances.RELATION_ORGANIZATION_ID
                                                    }
                                                >
                                                    {
                                                        insurances.RELATION_ORGANIZATION_NAME
                                                    }
                                                </option>
                                            );
                                        }
                                    )}
                                </select>
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="policy_leader"
                                    value="Policy Leader"
                                />
                                <div className="mt-2 space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                                    <div className="flex items-center">
                                        <input
                                            id="radio1"
                                            name="ip_policy_leader"
                                            type="radio"
                                            value={1}
                                            onChange={(e) =>
                                                setDataById({
                                                    ...dataById,
                                                    IP_POLICY_LEADER:
                                                        e.target.value,
                                                })
                                            }
                                            checked={
                                                dataById.IP_POLICY_LEADER == "1"
                                                    ? true
                                                    : false
                                            }
                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                        />
                                        <label
                                            htmlFor="radio1"
                                            className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            Yes
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            id="radio2"
                                            name="ip_policy_leader"
                                            type="radio"
                                            value={0}
                                            onChange={(e) =>
                                                setDataById({
                                                    ...dataById,
                                                    IP_POLICY_LEADER:
                                                        e.target.value,
                                                })
                                            }
                                            checked={
                                                dataById.IP_POLICY_LEADER == "0"
                                                    ? true
                                                    : false
                                            }
                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                        />
                                        <label
                                            htmlFor="radio2"
                                            className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            no
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 mb-4 ml-4 mr-4">
                            <div>
                                <InputLabel
                                    htmlFor="currency_id"
                                    value="Currency"
                                />
                                <select
                                    className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                    value={dataById.IP_CURRENCY_ID}
                                    onChange={(e) => {
                                        setDataById({
                                            ...dataById,
                                            IP_CURRENCY_ID: e.target.value,
                                        });
                                        // getPremiumByCurrency(e.target.value);
                                    }}
                                >
                                    <option value={""}>
                                        -- <i>Choose Currency</i> --
                                    </option>
                                    {currencyPremiums.length > 0
                                        ? currencyPremiums.map(
                                              (curr: any, i: number) => {
                                                  return (
                                                      <option
                                                          key={i}
                                                          value={
                                                              curr.CURRENCY_ID
                                                          }
                                                      >
                                                          {
                                                              curr.currency
                                                                  .CURRENCY_SYMBOL
                                                          }
                                                      </option>
                                                  );
                                              }
                                          )
                                        : ""}
                                </select>
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="ip_policy_initial_premium"
                                    value="Premium"
                                />
                                <CurrencyInput
                                    id="ip_policy_initial_premium"
                                    name="ip_policy_initial_premium"
                                    value={dataById.IP_POLICY_INITIAL_PREMIUM}
                                    decimalScale={2}
                                    decimalsLimit={2}
                                    onValueChange={(values) => {
                                        setDataById({
                                            ...dataById,
                                            IP_POLICY_INITIAL_PREMIUM: values,
                                        });
                                    }}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    readOnly
                                />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="ip_policy_share"
                                    value="Policy Share (%)"
                                />
                                <CurrencyInput
                                    id="ip_policy_share"
                                    name="ip_policy_share"
                                    value={dataById.IP_POLICY_SHARE}
                                    decimalScale={2}
                                    decimalsLimit={2}
                                    onValueChange={(values) => {
                                        setDataById({
                                            ...dataById,
                                            IP_POLICY_SHARE: values,
                                        });
                                        setIsEditCalculate(isEditCalculate + 1);
                                    }}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    required
                                />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="ip_pip_after_disc"
                                    value="PIP After Disc (Share)"
                                />
                                <CurrencyInput
                                    id="ip_pip_after_disc"
                                    name="ip_pip_after_disc"
                                    value={dataById.IP_PIP_AFTER_DISC}
                                    decimalScale={2}
                                    decimalsLimit={2}
                                    onValueChange={(values) => {
                                        setDataById({
                                            ...dataById,
                                            IP_PIP_AFTER_DISC: values,
                                        });
                                    }}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4 ml-4 mr-4">
                            <div>
                                <InputLabel
                                    htmlFor="ip_policy_bf"
                                    value="Policy BF (%)"
                                />
                                <CurrencyInput
                                    id="ip_policy_bf"
                                    name="ip_policy_bf"
                                    value={dataById.IP_POLICY_BF}
                                    decimalScale={2}
                                    decimalsLimit={2}
                                    onValueChange={(values) => {
                                        setDataById({
                                            ...dataById,
                                            IP_POLICY_BF: values,
                                        });
                                    }}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    required
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="vat" value="VAT" />
                                <div className=" mt-2 space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                                    <div className="flex items-center">
                                        <input
                                            checked={
                                                dataById.IP_VAT == 1
                                                    ? true
                                                    : false
                                            }
                                            required
                                            id="radioVat1"
                                            name="ip_vat"
                                            type="radio"
                                            value={1}
                                            onChange={(e) => {
                                                setDataById({
                                                    ...dataById,
                                                    IP_VAT: e.target.value,
                                                });
                                                setIsEditCalculate(
                                                    isEditCalculate + 1
                                                );
                                            }}
                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                        />
                                        <label
                                            htmlFor="radioVat1"
                                            className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            Include VAT
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            checked={
                                                dataById.IP_VAT == 2
                                                    ? true
                                                    : false
                                            }
                                            required
                                            id="radioVat2"
                                            name="ip_vat"
                                            type="radio"
                                            value={2}
                                            onChange={(e) => {
                                                setDataById({
                                                    ...dataById,
                                                    IP_VAT: e.target.value,
                                                });
                                                setIsEditCalculate(
                                                    isEditCalculate + 1
                                                );
                                            }}
                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                        />
                                        <label
                                            htmlFor="radioVat2"
                                            className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            Exclude VAT
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="engineering_fee"
                                    value="Engineering Fee(%)"
                                />
                                <CurrencyInput
                                    id="engineering_fee"
                                    name="engineering_fee"
                                    value={dataById.ENGINEERING_FEE}
                                    decimalScale={2}
                                    decimalsLimit={2}
                                    onValueChange={(values) => {
                                        setDataById({
                                            ...dataById,
                                            ENGINEERING_FEE: values,
                                        });
                                    }}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mb-4 ml-4 mr-4">
                            <div>
                                <InputLabel
                                    htmlFor="ip_bf_amount"
                                    value="BF Amount"
                                />
                                <CurrencyInput
                                    id="ip_bf_amount"
                                    name="ip_bf_amount"
                                    value={dataById.IP_BF_AMOUNT}
                                    decimalScale={2}
                                    decimalsLimit={2}
                                    onValueChange={(values) => {
                                        setDataById({
                                            ...dataById,
                                            IP_BF_AMOUNT: values,
                                        });
                                    }}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    readOnly
                                />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="ip_vat_amount"
                                    value="VAT (2.2%)"
                                />
                                <CurrencyInput
                                    id="ip_vat_amount"
                                    name="ip_vat_amount"
                                    value={dataById.IP_VAT_AMOUNT}
                                    decimalScale={2}
                                    decimalsLimit={2}
                                    onValueChange={(values) => {
                                        setDataById({
                                            ...dataById,
                                            IP_VAT_AMOUNT: values,
                                        });
                                    }}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    readOnly
                                />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="ip_pph_23"
                                    value="PPh 23 (2%)"
                                />
                                <CurrencyInput
                                    id="ip_pph_23"
                                    name="ip_pph_23"
                                    value={dataById.IP_PPH_23}
                                    decimalScale={2}
                                    decimalsLimit={2}
                                    onValueChange={(values) => {
                                        setDataById({
                                            ...dataById,
                                            IP_PPH_23: values,
                                        });
                                    }}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    readOnly
                                />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="ip_net_bf"
                                    value="Net BF"
                                />
                                <CurrencyInput
                                    id="ip_net_bf"
                                    name="ip_net_bf"
                                    value={dataById.IP_NET_BF}
                                    decimalScale={2}
                                    decimalsLimit={2}
                                    onValueChange={(values) => {
                                        setDataById({
                                            ...dataById,
                                            IP_NET_BF: values,
                                        });
                                    }}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    readOnly
                                />
                            </div>
                        </div>

                        

                        <div className="mt-10 ml-4 mr-4">
                            <h3 className="text-xl font-semibold leading-6 text-gray-900">
                                Installment
                            </h3>
                            <hr className="my-3" />
                        </div>
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg ml-4 mr-4">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr className="bg-gray-2 dark:bg-meta-4">
                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                            No.
                                        </th>
                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                            Term rate (%)
                                        </th>
                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                            Due Date
                                        </th>
                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                            Gross Premi/AR
                                        </th>
                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                            Gross BF
                                        </th>
                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                            VAT
                                        </th>
                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                            PPh 23
                                        </th>
                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                            Net BF
                                        </th>
                                        {/* <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                            Admin Cost
                                        </th> */}
                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                            Policy Cost
                                        </th>
                                        <th className="min-w-[50px] py-4 px-4 text-sm text-black dark:text-white">
                                            Premium Nett/AP
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataById.installment.map(
                                        (inst: any, i: number) => {
                                            return (
                                                <tr key={i}>
                                                    <td className="border-b text-sm border-[#eee] dark:border-strokedark">
                                                        <TextInput
                                                            id="installment_term"
                                                            name="installment_term"
                                                            value={
                                                                inst.INSTALLMENT_TERM
                                                            }
                                                            onChange={(e) =>
                                                                editInstallment(
                                                                    "INSTALLMENT_TERM",
                                                                    e.target
                                                                        .value,
                                                                    i
                                                                )
                                                            }
                                                            className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-pelindo sm:text-sm sm:leading-6"
                                                            required
                                                            readOnly
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee] dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="installment_percentage"
                                                            name="installment_percentage"
                                                            value={
                                                                inst.INSTALLMENT_PERCENTAGE
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                editInstallment(
                                                                    "INSTALLMENT_PERCENTAGE",
                                                                    values,
                                                                    i
                                                                );
                                                            }}
                                                            className="block w-32 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                            required
                                                            readOnly
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee] dark:border-strokedark">
                                                        <TextInput
                                                            id="installment_due_date"
                                                            name="installment_due_date"
                                                            value={
                                                                inst.INSTALLMENT_DUE_DATE
                                                            }
                                                            type="date"
                                                            onChange={(e) =>
                                                                editInstallment(
                                                                    "INSTALLMENT_DUE_DATE",
                                                                    e.target
                                                                        .value,
                                                                    i
                                                                )
                                                            }
                                                            className="block w-15 mx-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-pelindo sm:text-sm sm:leading-6"
                                                            required
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee] dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="installment_ar"
                                                            name="installment_ar"
                                                            value={
                                                                inst.INSTALLMENT_AR
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                editInstallment(
                                                                    "INSTALLMENT_AR",
                                                                    values,
                                                                    i
                                                                );
                                                            }}
                                                            className="block w-32 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                            required
                                                            readOnly
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee] dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="installment_gross_bf"
                                                            name="installment_gross_bf"
                                                            value={
                                                                inst.INSTALLMENT_GROSS_BF
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                editInstallment(
                                                                    "INSTALLMENT_GROSS_BF",
                                                                    values,
                                                                    i
                                                                );
                                                            }}
                                                            className="block w-32 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                            required
                                                            readOnly
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee] dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="installment_vat"
                                                            name="installment_vat"
                                                            value={
                                                                inst.INSTALLMENT_VAT
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                editInstallment(
                                                                    "INSTALLMENT_VAT",
                                                                    values,
                                                                    i
                                                                );
                                                            }}
                                                            className="block w-32 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                            required
                                                            readOnly
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee] dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="installment_pph_23"
                                                            name="installment_pph_23"
                                                            value={
                                                                inst.INSTALLMENT_PPH_23
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                editInstallment(
                                                                    "INSTALLMENT_PPH_23",
                                                                    values,
                                                                    i
                                                                );
                                                            }}
                                                            className="block w-32 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                            required
                                                            readOnly
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee] dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="installment_net_bf"
                                                            name="installment_net_bf"
                                                            value={
                                                                inst.INSTALLMENT_NET_BF
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                editInstallment(
                                                                    "INSTALLMENT_NET_BF",
                                                                    values,
                                                                    i
                                                                );
                                                            }}
                                                            className="block w-32 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                            required
                                                            readOnly
                                                        />
                                                    </td>
                                                    {/* <td className="border-b text-sm border-[#eee] dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="installment_admin_cost"
                                                            name="installment_admin_cost"
                                                            value={
                                                                inst.INSTALLMENT_ADMIN_COST
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                editInstallment(
                                                                    "INSTALLMENT_ADMIN_COST",
                                                                    values,
                                                                    i
                                                                );
                                                            }}
                                                            className="block w-32 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                            required
                                                        />
                                                    </td> */}
                                                    <td className="border-b text-sm border-[#eee] dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="installment_policy_cost"
                                                            name="installment_policy_cost"
                                                            value={
                                                                inst.INSTALLMENT_POLICY_COST
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                editInstallment(
                                                                    "INSTALLMENT_POLICY_COST",
                                                                    values,
                                                                    i
                                                                );
                                                                reCalculateInstallment(
                                                                    "INSTALLMENT_POLICY_COST",
                                                                    values,
                                                                    i
                                                                );
                                                            }}
                                                            className="block w-32 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                            required
                                                        />
                                                    </td>
                                                    <td className="border-b text-sm border-[#eee] dark:border-strokedark">
                                                        <CurrencyInput
                                                            id="installment_ap"
                                                            name="installment_ap"
                                                            value={
                                                                inst.INSTALLMENT_AP
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                editInstallment(
                                                                    "INSTALLMENT_AP",
                                                                    values,
                                                                    i
                                                                );
                                                            }}
                                                            className="block w-32 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                            required
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                }
            />
            {/* end modal edit */}

            <div>
                <dl className="mt-0">
                    {/* Top */}
                    <div className="grid grid-cols-1 xs:grid-cols-1 md:grid-cols-1">
                        {/* All Information */}
                        <div className="rounded-lg bg-white px-4 py-5 shadow-md col-span-2 sm:p-6 xs:col-span-1 md:col-span-2">
                            <div className="mb-3">
                                <div className="flex">
                                    <div className="text-xl font-semibold leading-6 items-center text-gray-900 ml-4 mr-4 border-b-2 w-fit">
                                        <span className="">
                                            {
                                                insurer.insurance
                                                    .RELATION_ORGANIZATION_NAME
                                            }
                                        </span>
                                    </div>
                                    <div className="rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                        {insurer.IP_POLICY_LEADER == 1 ? (
                                            <span>Co Leader</span>
                                        ) : (
                                            <span>Co Member</span>
                                        )}
                                    </div>
                                </div>
                                {/* <div className="grid grid-cols-3 gap-4 mr-6">
                                    <div className="col-span-2">
                                        <h3 className="text-xl font-semibold leading-6 text-gray-900 ml-4 mr-4">
                                            {
                                                insurer.insurance
                                                    .RELATION_ORGANIZATION_NAME
                                            }{" "}
                                            <sup>
                                                {insurer.IP_POLICY_LEADER ==
                                                1 ? (
                                                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                        Co Leader
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                        Co Member
                                                    </span>
                                                )}
                                            </sup>
                                        </h3>
                                    </div>
                                </div> */}

                                {/* <hr className="my-3 w-auto ml-4 mr-6" /> */}
                            </div>
                            <div className="grid grid-cols-3 gap-2 ml-4 mb-3">
                                <div className="">
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="">
                                            <span>Policy Number</span>
                                        </div>
                                        <div className=" col-span-3">
                                            <span className="font-normal text-gray-500">
                                                {insurer.policy.POLICY_NUMBER}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {insurer.ENDORSEMENT_ID ? (
                                    <div className="">
                                        <div className="grid grid-cols-4 gap-4">
                                            <div className="">
                                                <span>Endorsement Number</span>
                                            </div>
                                            <div className=" col-span-3">
                                                <span className="font-normal text-gray-500">
                                                    {
                                                        insurer.endorsement
                                                            .ENDORSEMENT_NUMBER
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    ""
                                )}

                                <div className="">
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="">
                                            <span>Premium Type</span>
                                        </div>
                                        <div className=" col-span-3">
                                            <span className="font-normal text-gray-500">
                                                {insurer.IP_PREMIUM_TYPE == 1
                                                    ? "Initial Premium"
                                                    : "Additional Premium"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 ml-4 mb-3">
                                <div className="">
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="">
                                            <span>Premium</span>
                                        </div>
                                        <div className=" col-span-3">
                                            <span className="font-normal text-gray-500">
                                                {insurer.currency
                                                    ? insurer.currency
                                                          .CURRENCY_SYMBOL + " "
                                                    : ""}
                                                {new Intl.NumberFormat("id", {
                                                    style: "decimal",
                                                }).format(
                                                    insurer.IP_POLICY_INITIAL_PREMIUM
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="">
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="">
                                            <span>Policy Share</span>
                                        </div>
                                        <div className=" col-span-3">
                                            <span className="font-normal text-gray-500">
                                                {insurer.IP_POLICY_SHARE + " %"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 ml-4 mb-3">
                                {/* <div className="">
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="">
                                            <span>Discount Insurance</span>
                                        </div>
                                        <div className=" col-span-3">
                                            <span className="font-normal text-gray-500">
                                                {insurer.IP_DISC_INSURANCE +
                                                    " %"}
                                            </span>
                                        </div>
                                    </div>
                                </div> */}
                                <div className="">
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="">
                                            <span>Engineering Fee</span>
                                        </div>
                                        <div className=" col-span-3">
                                            <span className="font-normal text-gray-500">
                                                {insurer.ENGINEERING_FEE + " %"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="">
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="">
                                            <span>PIP After Disc (Share)</span>
                                        </div>
                                        <div className=" col-span-3">
                                            <span className="font-normal text-gray-500">
                                                {new Intl.NumberFormat("id", {
                                                    style: "decimal",
                                                }).format(
                                                    insurer.IP_PIP_AFTER_DISC
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 ml-4 mb-3">
                                <div className="">
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="">
                                            <span>Policy BF</span>
                                        </div>
                                        <div className=" col-span-3">
                                            <span className="font-normal text-gray-500">
                                                {insurer.IP_POLICY_BF + " %"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="">
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="">
                                            <span>VAT</span>
                                        </div>
                                        <div className=" col-span-3">
                                            <span className="font-normal text-gray-500">
                                                {insurer.IP_VAT == 1
                                                    ? "Include VAT"
                                                    : "Exclude VAT"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 ml-4 mb-3">
                                <div className="">
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="">
                                            <span>BF Amount</span>
                                        </div>
                                        <div className=" col-span-3">
                                            <span className="font-normal text-gray-500">
                                                {new Intl.NumberFormat("id", {
                                                    style: "decimal",
                                                }).format(insurer.IP_BF_AMOUNT)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="">
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="">
                                            <span>VAT Amount</span>
                                        </div>
                                        <div className=" col-span-3">
                                            <span className="font-normal text-gray-500">
                                                {new Intl.NumberFormat("id", {
                                                    style: "decimal",
                                                }).format(
                                                    insurer.IP_VAT_AMOUNT
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 ml-4 mb-3">
                                <div className="">
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="">
                                            <span>PPh 23</span>
                                        </div>
                                        <div className=" col-span-3">
                                            <span className="font-normal text-gray-500">
                                                {new Intl.NumberFormat("id", {
                                                    style: "decimal",
                                                }).format(insurer.IP_PPH_23)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="">
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="">
                                            <span>Net BF</span>
                                        </div>
                                        <div className=" col-span-3">
                                            <span className="font-normal text-gray-500">
                                                {new Intl.NumberFormat("id", {
                                                    style: "decimal",
                                                }).format(insurer.IP_NET_BF)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* <hr className="mt-5" /> */}

                            {/* Installment */}
                            <div>
                                <div className="mt-10">
                                    <h3 className="text-xl font-semibold leading-6 text-gray-900 ml-4 mr-4 mb-3 border-b-2 w-fit">
                                        Installment
                                    </h3>
                                    {/* <hr className="my-3 w-auto ml-4 mr-6" /> */}
                                </div>
                                <div className="grid gap-x-2 gap-y-2 -mt-4 ml-0">
                                    {/* <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"></div> */}
                                    <div className="ml-4">
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
                                                        Term Rate
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
                                                        Gross Premi/AR
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                    >
                                                        Gross BF
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                    >
                                                        VAT
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                    >
                                                        PPh 23
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                    >
                                                        Net BF
                                                    </th>
                                                    {/* <th
                                                        scope="col"
                                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                    >
                                                        Admin Cost
                                                    </th> */}
                                                    <th
                                                        scope="col"
                                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                    >
                                                        Policy Cost
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                    >
                                                        Premium Nett/AP
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {insurer.installment.map(
                                                    (
                                                        install: any,
                                                        i: number
                                                    ) => (
                                                        <tr key={i}>
                                                            <td className="whitespace-nowrap pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                                                {
                                                                    install.INSTALLMENT_TERM
                                                                }
                                                            </td>
                                                            <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                                                                {new Intl.NumberFormat(
                                                                    "id",
                                                                    {
                                                                        style: "decimal",
                                                                    }
                                                                ).format(
                                                                    install.INSTALLMENT_PERCENTAGE
                                                                ) + " %"}
                                                            </td>
                                                            <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                                                                {
                                                                    install.INSTALLMENT_DUE_DATE
                                                                }
                                                            </td>
                                                            <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                                                                {new Intl.NumberFormat(
                                                                    "id",
                                                                    {
                                                                        style: "decimal",
                                                                    }
                                                                ).format(
                                                                    install.INSTALLMENT_AR
                                                                )}
                                                            </td>
                                                            <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                                                                {new Intl.NumberFormat(
                                                                    "id",
                                                                    {
                                                                        style: "decimal",
                                                                    }
                                                                ).format(
                                                                    install.INSTALLMENT_GROSS_BF
                                                                )}
                                                            </td>
                                                            <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                                                                {new Intl.NumberFormat(
                                                                    "id",
                                                                    {
                                                                        style: "decimal",
                                                                    }
                                                                ).format(
                                                                    install.INSTALLMENT_VAT
                                                                )}
                                                            </td>
                                                            <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                                                                {new Intl.NumberFormat(
                                                                    "id",
                                                                    {
                                                                        style: "decimal",
                                                                    }
                                                                ).format(
                                                                    install.INSTALLMENT_PPH_23
                                                                )}
                                                            </td>
                                                            <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                                                                {new Intl.NumberFormat(
                                                                    "id",
                                                                    {
                                                                        style: "decimal",
                                                                    }
                                                                ).format(
                                                                    install.INSTALLMENT_NET_BF
                                                                )}
                                                            </td>
                                                            {/* <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                                                                {new Intl.NumberFormat(
                                                                    "id",
                                                                    {
                                                                        style: "decimal",
                                                                    }
                                                                ).format(
                                                                    install.INSTALLMENT_ADMIN_COST
                                                                )}
                                                            </td> */}
                                                            <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                                                                {new Intl.NumberFormat(
                                                                    "id",
                                                                    {
                                                                        style: "decimal",
                                                                    }
                                                                ).format(
                                                                    install.INSTALLMENT_POLICY_COST
                                                                )}
                                                            </td>
                                                            <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                                                                {new Intl.NumberFormat(
                                                                    "id",
                                                                    {
                                                                        style: "decimal",
                                                                    }
                                                                ).format(
                                                                    install.INSTALLMENT_AP
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            {/* End Installment */}
                        </div>
                        {/* end all information */}
                    </div>
                    {/* End Top */}
                </dl>
            </div>
            <div className="absolute bottom-3 left-4">
                <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-opacity-90 sm:mt-0 sm:w-auto"
                    onClick={() => {
                        handleDeleteModal();
                    }}
                >
                    Delete
                </button>
                <button
                    type="button"
                    className="ml-4 mt-3 inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-opacity-90 sm:mt-0 sm:w-auto"
                    onClick={() => {
                        handleEditModal();
                    }}
                >
                    Edit
                </button>
            </div>
        </>
        // </AuthenticatedLayout>
    );
}
