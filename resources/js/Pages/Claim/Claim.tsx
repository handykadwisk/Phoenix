import InputLabel from "@/Components/InputLabel";
import ModalToAction from "@/Components/Modal/ModalToAction";
import TextInput from "@/Components/TextInput";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import axios from "axios";
import { set } from "date-fns";
import { useEffect, useState, FormEvent } from "react";
import Select from "react-tailwindcss-select";
import {
    BuildingLibraryIcon,
    ClipboardDocumentListIcon,
    Cog6ToothIcon,
    Cog8ToothIcon,
    CogIcon,
    DocumentPlusIcon,
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
    FolderPlusIcon,
    ListBulletIcon,
    MinusCircleIcon,
    PlusCircleIcon,
    PresentationChartBarIcon,
} from "@heroicons/react/20/solid";
import { start } from "node:repl";
import ToastMessage from "@/Components/ToastMessage";
import AGGrid from "@/Components/AgGrid";
import { event, param } from "jquery";
import Swal from "sweetalert2";
import PrimaryButton from "@/Components/PrimaryButton";
import ModalToAdd from "@/Components/Modal/ModalToAddRelation";
import ActionModal from "@/Components/Modal/ActionModal";
import { motion, steps } from "framer-motion";
import Loader from "@/Components/Loader";
import TextArea from "@/Components/TextArea";
import CurrencyInput from "react-currency-input-field";
import { ScaleIcon } from "@heroicons/react/24/outline";
import Input from "@/Components/Input";

// import TreeView from "@/Components/ThreeView";

export default function Claim({
    auth,
    workbook,
    relation,
    agent,
    policy,
    causeOfLoss,
}: any) {
    //state
    const [modal, setModal] = useState<any>({
        add: false,
        edit: false,
        delete: false,
        stepper: false,
        updateValue: false,
        historyValue: false,
        uploadDoc: false,
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [search, setSearch] = useState<any>({
        claim_search: [
            {
                CLAIM_ID: "",
                CLAIM_NAME: "",
            },
        ],
    });

    //data
    const [data, setData] = useState<any>({
        client: null,
        workbook: null,
        potentialInsurancePolicy: [
            {
                potentialInsurancePolicy: null,
                note: "",
                coverage: [],
                causeOfLoss: [{ causeOfLoss: null, note: "" }],
            },
        ],
    });
    const createSelectOptions = (
        data: any[],
        labelKey: string,
        valueKey: string
    ) => {
        return data.map((item: any) => ({
            label: item[labelKey],
            value: item[valueKey],
        }));
    };

    const causeOfLossOptions = createSelectOptions(
        causeOfLoss,
        "CAUSE_OF_LOSS_NAME",
        "CAUSE_OF_LOSS_ID"
    );

    //relation data
    const relations = relation;
    const client = relations?.filter((el: any) => {
        return el?.m_relation_type[0]?.RELATION_TYPE_ID === 1;
    });

    const relationOptions = client.map((el: any) => {
        return {
            label: el.RELATION_ORGANIZATION_NAME,
            value: el.RELATION_ORGANIZATION_ID,
        };
    });
    //end relation data

    //policy data
    const policyOptionsFilter = policy
        .filter((el: any) => el.RELATION_ID === data.client)
        ?.map((el: any) => {
            return {
                label: el.POLICY_NUMBER,
                value: el.POLICY_ID,
            };
        });
    //end policy data

    //get coverage from policy
    const coverage = policy.filter((el: any) => {
        return el.POLICY_ID === data.client ? el.policy_coverage : null;
    });

    const coverages = coverage.map((el: any) => {
        return el.policy_coverage;
    });

    const coveragesOptions =
        coverages[0]?.map((el: any) => {
            return {
                label: el.POLICY_COVERAGE_NAME,
                value: el.POLICY_COVERAGE_ID,
            };
        }) || [];

    //workbook
    const workbookOptions = workbook.map((el: any) => {
        return {
            label: el.WORKBOOK_NAME,
            value: el.WORKBOOK_ID,
        };
    }); //end workbook

    //add row input polis
    const addRowPolis = (e: FormEvent) => {
        e.preventDefault();
        setData({
            ...data,
            potentialInsurancePolicy: [
                ...data.potentialInsurancePolicy,
                {
                    potentialInsurancePolicy: "",
                    note: "",
                },
            ],
        });
    };
    //end add row input polis

    //remove row input polis
    const removeRowPolis = (index: number) => {
        setData({
            ...data,
            potentialInsurancePolicy: data.potentialInsurancePolicy.filter(
                (_: any, i: number) => i !== index
            ),
        });
    };
    //end remove row input polis

    //add row claim value
    const addRowClaimValue = (e: FormEvent) => {
        e.preventDefault();
        setData({
            ...data,
            claimValueSubmitted: [
                ...data.claimValueSubmitted,
                {
                    claimValueSubmitted: "",
                    note: "",
                },
            ],
        });
    };
    //end add row claim value

    //remove row claim value
    const removeRowClaimValue = (index: number) => {
        setData({
            ...data,
            claimValueSubmitted: data.claimValueSubmitted.filter(
                (_: any, i: number) => i !== index
            ),
        });
    };
    //end remove row claim value

    const addRow = (e: FormEvent) => {
        e.preventDefault();
        setData({
            ...data,
            potentialInsurancePolicy: [
                ...data.potentialInsurancePolicy,
                {
                    potentialInsurancePolicy: null,
                    note: "",
                },
            ],
            // claimValueSubmitted: [
            //     ...data.claimValueSubmitted,
            //     {
            //         claimValueSubmitted: 0,
            //         note: ""
            //     },
            // ]
        });
    };

    const removeRow = (e: FormEvent) => {
        e.preventDefault();
        setData({
            ...data,
            potentialInsurancePolicy: data.potentialInsurancePolicy.filter(
                (_: any, i: number) =>
                    i !== data.potentialInsurancePolicy.length - 1
            ),
            // claimValueSubmitted: data.claimValueSubmitted.filter((_: any, i: number) => i !== data.claimValueSubmitted.length - 1)
        });
    };

    //add coverage
    const addCoverage = (e: FormEvent, index: any) => {
        e.preventDefault();

        setData({
            ...data,
            potentialInsurancePolicy: data.potentialInsurancePolicy.map(
                (el: any, i: number) => {
                    if (i === index) {
                        return {
                            ...el,
                            coverage: [
                                ...(el.coverage || []),
                                {
                                    coverage: null,
                                    note: "",
                                    ValueSubmitClaim: null,
                                    noteValueSubmitClaim: "",
                                },
                            ],
                        };
                    }
                    return el;
                }
            ),
        });
    };

    const addInterestInsured = (e: FormEvent, index: any) => {
        e.preventDefault();

        setData({
            ...data,
            potentialInsurancePolicy: data.potentialInsurancePolicy.map(
                (el: any, i: number) => {
                    if (i === index) {
                        return {
                            ...el,
                            coverage: el.coverage.map((coverageItem: any) => ({
                                ...coverageItem,
                                interestInsured: [
                                    ...(coverageItem.interestInsured || []),
                                    {
                                        interestInsured: null,
                                        note: "",
                                        ValueSubmitClaim: null,
                                        noteValueSubmitClaim: "",
                                    },
                                ],
                            })),
                        };
                    }
                    return el;
                }
            ),
        });
    };

    const removeInterestInsured = (
        e: FormEvent,
        policyIndex: number,
        coverageIndex: number
    ) => {
        e.preventDefault();
        setData({
            ...data,
            potentialInsurancePolicy: data.potentialInsurancePolicy.map(
                (policy: any, i: number) => {
                    if (i === policyIndex) {
                        return {
                            ...policy,
                            coverage: policy.coverage.map(
                                (coverage: any, j: number) => {
                                    if (j === coverageIndex) {
                                        return {
                                            ...coverage,
                                            interestInsured:
                                                coverage.interestInsured.filter(
                                                    (_: any, k: number) =>
                                                        k !==
                                                        coverage.interestInsured
                                                            .length -
                                                            1
                                                ),
                                        };
                                    }
                                    return coverage;
                                }
                            ),
                        };
                    }
                    return policy;
                }
            ),
        });
    };

    //remove coverage
    const removeCoverage = (e: any, policyIndex: number) => {
        e.preventDefault();
        const coverageIndex =
            data.potentialInsurancePolicy[policyIndex].coverage.length - 1;
        setData({
            ...data,
            potentialInsurancePolicy: data.potentialInsurancePolicy.map(
                (policy: any, i: number) => {
                    if (i === policyIndex) {
                        return {
                            ...policy,
                            coverage: policy.coverage.filter(
                                (_: any, j: number) => j !== coverageIndex
                            ),
                        };
                    }
                    return policy;
                }
            ),
        });
    };

    //handle detail
    const [dataId, setDataId] = useState<any>({});
    const handleDetail = async (data: any) => {
        setLoading(true);
        try {
            const response = await axios.get(`/getClaimById/${data.CLAIM_ID}`);
            setDataId(response.data);
            setModal({ ...modal, updateValue: false, edit: true });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    //handle success
    const [isSuccess, setIsSuccess] = useState<any>("");
    const handleSuccess = (message: any) => {
        setIsSuccess("");
        if (message !== "") {
            setIsSuccess(message[0]);
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
    };

    const [claimId, setClaimId] = useState<any>(0);
    const handleSuccessAdd = (message: any) => {
        setIsSuccess("");
        if (message !== "") {
            setIsSuccess(message[0]);
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
        setModal({
            ...modal,
            add: false,
            stepper: false,
            updateValue: false,
            edit: false,
        });
        handleDetail(dataId);
    };

    const popupDetail = (e: any) => {
        e.preventDefault();
        setModal({ ...modal, edit: true, stepper: false, updateValue: false });
    };

    function Stepper() {
        const [currentStep, setCurrentStep] = useState(0);
        const [completedMilestones, setCompletedMilestones] = useState<any>({});
        const [uploadedFiles, setUploadedFiles] = useState<any>({});

        const nextStep = () => {
            if (currentStep < milestones.length - 1) {
                setCurrentStep((prev) => prev + 1);
            }
        };

        const prevStep = () => {
            if (currentStep > 0) {
                setCurrentStep((prev) => prev - 1);
            }
        };

        //handleCheckboxChange
        const handleCheckboxChange = (milestoneId: number) => {
            setCompletedMilestones((prev: any) => ({
                ...prev,
                [milestoneId]: !prev[milestoneId],
            }));
        };

        //handleFileChange
        const handleFileChange = (milestoneId: number, file: File) => {
            setUploadedFiles((prev: any) => ({
                ...prev,
                [milestoneId]: file,
            }));
        };

        //component MilestoneItem recursive
        function MilestoneItem({
            milestone,
            completedMilestones,
            handleCheckboxChange,
            handleFileChange,
        }: any) {
            return (
                <div className="rounded-md p-2 mt-4">
                    <fieldset className="border border-gray-400 p-3 rounded-md flex-1">
                        <legend className="text-sm font-semibold px-2 text-gray-600">
                            {milestone?.MILESTONE_NAME}
                        </legend>
                        <div className="flex gap-6">
                            <div className="flex-1">
                                <label
                                    htmlFor={`input-${milestone?.MILESTONE_ID}`}
                                    className="text-sm text-gray-800"
                                >
                                    Note
                                </label>
                                <TextInput
                                    id={`input-${milestone?.MILESTONE_ID}`}
                                    type="text"
                                    className="mt-1 block w-full"
                                    placeholder={`Enter data for ${milestone?.MILESTONE_NAME}`}
                                />
                            </div>
                            <div className="mt-3 flex items-center">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    id={`checkbox-${milestone?.MILESTONE_ID}`}
                                    checked={
                                        completedMilestones[
                                            milestone?.MILESTONE_ID
                                        ] || false
                                    }
                                    onChange={() =>
                                        handleCheckboxChange(
                                            milestone?.MILESTONE_ID
                                        )
                                    }
                                />
                                <label
                                    htmlFor={`checkbox-${milestone?.MILESTONE_ID}`}
                                    className="text-sm text-gray-800"
                                >
                                    Completed
                                </label>
                            </div>
                            <div className="mt-2">
                                <label
                                    htmlFor={`file-${milestone?.MILESTONE_ID}`}
                                    className="text-sm text-gray-800"
                                >
                                    Upload Document
                                </label>
                                <input
                                    type="file"
                                    className="mt-2 block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
                                    id={`file-${milestone?.MILESTONE_ID}`}
                                    onChange={(e) => {
                                        if (
                                            e.target.files &&
                                            e.target.files.length > 0
                                        ) {
                                            handleFileChange(
                                                milestone?.MILESTONE_ID,
                                                e.target.files[0]
                                            );
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        {milestone?.children &&
                            milestone?.children?.length > 0 && (
                                <>
                                    <div className="mt-4 ml-4">
                                        {milestone.children.map(
                                            (child: any) => (
                                                <MilestoneItem
                                                    key={child?.MILESTONE_ID}
                                                    milestone={child}
                                                    completedMilestones={
                                                        completedMilestones
                                                    }
                                                    handleCheckboxChange={
                                                        handleCheckboxChange
                                                    }
                                                    handleFileChange={
                                                        handleFileChange
                                                    }
                                                />
                                            )
                                        )}
                                    </div>
                                </>
                            )}
                    </fieldset>
                </div>
            );
        }
        const milestones = dataId?.workbook.milestone;
        // console.log(dataId.workbook.milestone, "milestones");

        return (
            <div className="w-full mx-auto p-4">
                <div className="flex items-center justify-between mt-2 ">
                    {milestones?.map((milestone: any, index: number) => (
                        // console.log(milestone, "milestone"),
                        <>
                            <div className=" w-full">
                                <div
                                    key={index}
                                    className=" flex-1 flex flex-col items-center gap-4"
                                >
                                    <div
                                        className={`w-5 h-5 flex items-center justify-center rounded-full text-white text-xs font-bold 
              ${
                  index === currentStep
                      ? "bg-blue-600 border-4 border-blue-300 shadow-lg"
                      : index < currentStep
                      ? "bg-green-500"
                      : "bg-gray-300"
              }`}
                                    >
                                        {index < currentStep ? "✔" : index + 1}
                                    </div>

                                    {index < milestones?.length - 1 && (
                                        <div
                                            className={`flex-1 h-1 w-full ${
                                                index < currentStep
                                                    ? "bg-green-500"
                                                    : "bg-gray-300"
                                            }`}
                                        />
                                    )}

                                    <p className="h-10 text-center  text-xs font-medium text-gray-700">
                                        {milestone?.MILESTONE_NAME}
                                    </p>
                                </div>
                            </div>
                        </>
                    ))}
                </div>

                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="p-6"
                >
                    <fieldset className="border border-gray-300 p-6 rounded-md">
                        <legend className=" text-gray-700">
                            <div className="p-2 rounded-md">
                                <p className="text-lg font-semibold">
                                    {milestones[currentStep].MILESTONE_NAME}
                                </p>
                                <p className="ml-1 italic text-xs text-red-500">
                                    {
                                        milestones[currentStep]
                                            .MILESTONE_DURATION_DESCRIPTION
                                    }
                                </p>
                            </div>
                        </legend>

                        <div className="">
                            {milestones[currentStep].children.map(
                                (child: any, index: number) => (
                                    <MilestoneItem
                                        key={index}
                                        milestone={child}
                                        completedMilestones={
                                            completedMilestones
                                        }
                                        handleCheckboxChange={
                                            handleCheckboxChange
                                        }
                                        handleFileChange={handleFileChange}
                                    />
                                )
                            )}

                            {/* {milestones[currentStep].children.map((child, index) => (
                                <div key={index} className=" rounded-md p-2 mt-4">
                                    <fieldset className="border border-gray-400 p-3 rounded-md flex-1">
                                        <legend className="text-sm font-semibold px-2 text-gray-600">{child.MILESTONE_NAME}</legend>
                                        <div className="flex gap-6">
                                            <div className="flex-1">
                                                <label htmlFor={`input-${child.MILESTONE_ID}`} className="text-sm text-gray-800">
                                                    Note
                                                </label>
                                                <TextInput
                                                    id={`input-${child.MILESTONE_ID}`}
                                                    type="text"
                                                    className="mt-1 block w-full"
                                                    placeholder={`Enter data for ${child.MILESTONE_NAME}`}
                                                />
                                            </div>
                                            <div className="mt-3 flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="mr-2"
                                                    id={`checkbox-${child.MILESTONE_ID}`}
                                                    checked={completedMilestones[child.MILESTONE_ID] || false}
                                                    onChange={() => handleCheckboxChange(child.MILESTONE_ID)}
                                                />
                                                <label htmlFor={`checkbox-${child.MILESTONE_ID}`} className="text-sm text-gray-800">
                                                    Completed
                                                </label>
                                            </div>
                                            <div className="mt-2">
                                                <label htmlFor={`file-${child.MILESTONE_ID}`} className="text-sm text-gray-800">
                                                    Upload Document
                                                </label>
                                                <input
                                                    type="file"
                                                    className="mt-2 block w-full text-sm text-gray-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-blue-50 file:text-blue-700
                                            hover:file:bg-blue-100"
                                                    id={`file-${child.MILESTONE_ID}`}
                                                />
                                            </div>
                                        </div>

                                    </fieldset>
                                </div>
                            ))
                            } */}

                            {/* <fieldset className="border border-gray-400 p-3 rounded-md flex-1">
                                <legend className="text-sm font-semibold px-2 text-gray-600">Kategori 1</legend>
                                {milestones[currentStep].children.map((child, index) => (
                                    <div key={index} className="mt-2">
                                        <h3 className="text-sm text-gray-800">{child.MILESTONE_NAME}</h3>
                                        <TextInput
                                            type="text"
                                            className="mt-2 ring-1 ring-red-600"
                                            placeholder={`Input for ${child.MILESTONE_NAME}`}
                                        />
                                    </div>
                                ))}
                            </fieldset> */}

                            {/* <fieldset className="border border-gray-400 p-3 rounded-md flex-1">
                                <legend className="text-sm font-semibold px-2 text-gray-600">Kategori 2</legend>
                                {milestones[currentStep].children.map((child, index) => (
                                    <div key={index} className="mt-2">
                                        <h3 className="text-sm text-gray-800">{child.MILESTONE_NAME}</h3>
                                    </div>
                                ))}
                            </fieldset> */}
                        </div>
                    </fieldset>
                </motion.div>

                <div className="mt-6 flex justify-between">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        onClick={nextStep}
                        disabled={currentStep === milestones.length - 1}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        );
    }

    const [insuredId, setInsuredId] = useState<any>([]);
    const [valueRev, setValueRev] = useState<any>({
        CLAIM_COVERAGE_ID: null,
        POLICY_COVERAGE_DETAIL_ID: null,
        VALUE_SUBMIT_COVERAGE: null,
        NOTE: "",
    });

    const valueRevChange = (e: any, data: any) => {
        e.preventDefault();
        setInsuredId(data);
        setValueRev({
            ...valueRev,
            POLICY_COVERAGE_DETAIL_ID: data.POLICY_COVERAGE_DETAIL_ID,
            VALUE_SUBMIT_COVERAGE: data.VALUE_SUBMIT_COVERAGE,
            CLAIM_COVERAGE_ID: data.CLAIM_COVERAGE_ID,
        });
        setModal({ ...modal, updateValue: true });
    };

    const coveragePolicy = coverages;

    const coverageBySelect =
        coveragePolicy &&
        coveragePolicy[0]?.filter((el: any) => {
            return (
                el.POLICY_COVERAGE_ID ===
                data?.potentialInsurancePolicy[0]?.coverage?.[0]?.coverage
            );
        });

    const coverageInsured = coverageBySelect?.map((el: any) => {
        return el;
    });
    const coverageInsuredDetail = coverageInsured?.map((el: any) => {
        return el.policy_coverage_detail;
    });
    // console.log(coveragePolicy, "coveragePolicy");

    const coverageInsuredDetailOptions =
        coverageInsuredDetail &&
        coverageInsuredDetail[0]?.map((el: any) => {
            return {
                label: el.interest_insured?.INTEREST_INSURED_NAME,
                value: el?.POLICY_COVERAGE_DETAIL_ID,
            };
        });

    const [sumValueSub, setSumValueSub] = useState<any>(0);

    const [document, setDocument] = useState<any>({
        document: null,
        note: "",
    });

    return (
        <Authenticated header="Claim" user={auth.user}>
            <Head title="Claim" />

            {/* Toast Message */}
            {isSuccess && (
                <ToastMessage
                    message={isSuccess}
                    isShow={true}
                    type={"success"}
                />
            )}
            {loading && <Loader />}

            <ActionModal
                submitButtonName={""}
                headers={""}
                method=""
                title="Add Claim"
                show={modal.stepper}
                onClose={() => setModal({ ...modal, stepper: false })}
                data={""}
                url={""}
                onSuccess={""}
                classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 lg:w-3/4 w-full mx-5`}
                body={
                    <>
                        <Stepper />
                    </>
                }
            />

            <ActionModal
                submitButtonName={""}
                headers={""}
                method=""
                title="Add Claim"
                show={modal.aasdadd}
                onClose={() => setModal({ ...modal, add: false })}
                data={""}
                url={""}
                onSuccess={""}
                classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 lg:w-3/4 w-full mx-5`}
                body={
                    <>
                        <Stepper />

                        {dataId.policy?.map((el: any) => {
                            return (
                                <>
                                    <div className="rounded-lg mt-2 ">
                                        <div className="border-b border-gray-400 mx-1"></div>

                                        <div className="bg-slate-200 font-medium rounded-md flex gap-2 justify-between text-center p-2 h-24 text-md mt-3">
                                            <div className="w-full rounded-lg h-10 mt-2">
                                                <div className="text-md">
                                                    {
                                                        el?.policy[0]
                                                            ?.POLICY_THE_INSURED
                                                    }
                                                </div>
                                                <div className="text-xs text-gray-400 mt-2">
                                                    {" "}
                                                    {el?.NOTE}
                                                </div>
                                            </div>
                                            <div className="w-full rounded-lg h-10 mt-2 ">
                                                {el?.policy[0]?.POLICY_NUMBER}
                                            </div>
                                            <div className="w-full rounded-lg h-10 mt-2 flex flex-col ">
                                                {/* <span className="text-sm">Cause Of Loss</span> */}
                                                <div className="text-md">
                                                    {
                                                        el?.cause_of_loss[0]
                                                            ?.CAUSE_OF_LOSS_NAME
                                                    }
                                                </div>
                                                <div className="text-xs text-gray-400 mt-2">
                                                    {" "}
                                                    {el?.NOTE_CAUSE_OF_LOSS}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="border-b mt-2 border-gray-400 mx-1 "></div>
                                        {dataId.coverage?.map((el: any) => {
                                            return (
                                                <>
                                                    <div className="mt-1 rounded-md p-2 mx-4">
                                                        <fieldset className="">
                                                            <legend className=" text-md font-semibold text-gray-400 ">
                                                                Coverage
                                                            </legend>
                                                            <div className="flex gap-2">
                                                                <div className="bg-grey-50 border-gray-400 border rounded-md w-full p-4">
                                                                    {
                                                                        el
                                                                            .coverage
                                                                            ?.POLICY_COVERAGE_NAME
                                                                    }
                                                                    <div className="text-sm italic text-gray-400">
                                                                        Note :{" "}
                                                                        {
                                                                            el.NOTE
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <fieldset className="mt-2 p-4 justify-end border border-gray-400 rounded-md">
                                                                <legend className=" text-sm font-semibold px-2 text-gray-600">
                                                                    Insured
                                                                </legend>

                                                                {el?.insured
                                                                    ?.reduce(
                                                                        (
                                                                            acc: any,
                                                                            curr: any
                                                                        ) => {
                                                                            const existing =
                                                                                acc.find(
                                                                                    (
                                                                                        item: any
                                                                                    ) =>
                                                                                        item.POLICY_COVERAGE_DETAIL_ID ===
                                                                                        curr
                                                                                            .claim_coverage
                                                                                            .POLICY_COVERAGE_DETAIL_ID
                                                                                );
                                                                            if (
                                                                                existing
                                                                            ) {
                                                                                existing.values.push(
                                                                                    curr
                                                                                );
                                                                            } else {
                                                                                acc.push(
                                                                                    {
                                                                                        POLICY_COVERAGE_DETAIL_ID:
                                                                                            curr
                                                                                                .claim_coverage
                                                                                                .POLICY_COVERAGE_DETAIL_ID,
                                                                                        INTEREST_INSURED_NAME:
                                                                                            curr
                                                                                                .claim_coverage
                                                                                                .interest_insured
                                                                                                .INTEREST_INSURED_NAME,
                                                                                        values: [
                                                                                            curr,
                                                                                        ],
                                                                                    }
                                                                                );
                                                                            }
                                                                            return acc;
                                                                        },
                                                                        []
                                                                    )
                                                                    .map(
                                                                        (
                                                                            group: any
                                                                        ) => {
                                                                            const currency =
                                                                                group
                                                                                    .values[0]
                                                                                    ?.claim_coverage
                                                                                    ?.currency
                                                                                    ?.CURRENCY_SYMBOL;
                                                                            return (
                                                                                <>
                                                                                    <div
                                                                                        key={
                                                                                            group.POLICY_COVERAGE_DETAIL_ID
                                                                                        }
                                                                                        className="mt-2 flex gap-2 justify-between "
                                                                                    >
                                                                                        <div className="flex w-full">
                                                                                            <div className="bg-slate-200 border-gray-300 border rounded-md p-2 h-15 w-full">
                                                                                                {
                                                                                                    group.INTEREST_INSURED_NAME
                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="flex text-center items-center">
                                                                                            <div className="">
                                                                                                {
                                                                                                    currency
                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="flex gap-2 w-full">
                                                                                            {group
                                                                                                .values
                                                                                                .length >
                                                                                                0 && (
                                                                                                <>
                                                                                                    <div className=" bg-slate-200 border-gray-300 border rounded-md w-40 p-2 mx-2 text-center">
                                                                                                        <div className="text-md ">
                                                                                                            {
                                                                                                                group
                                                                                                                    .values[
                                                                                                                    group
                                                                                                                        .values
                                                                                                                        .length -
                                                                                                                        1
                                                                                                                ]
                                                                                                                    .VALUE_SUBMIT_COVERAGE
                                                                                                            }
                                                                                                        </div>
                                                                                                        <div className="text-xs italic text-gray-400">
                                                                                                            {" "}
                                                                                                            Note
                                                                                                            :{" "}
                                                                                                            {
                                                                                                                group
                                                                                                                    .values[
                                                                                                                    group
                                                                                                                        .values
                                                                                                                        .length -
                                                                                                                        1
                                                                                                                ]
                                                                                                                    .NOTE_VALUE_SUBMIT_COVERAGE
                                                                                                            }
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="flex-col space-y-3 mt-1">
                                                                                                        <div
                                                                                                            className="text-gray-500 text-sm flex flex-col gap-2 italic hover:text-red-400 cursor-pointer"
                                                                                                            onClick={(
                                                                                                                e
                                                                                                            ) =>
                                                                                                                removeRow(
                                                                                                                    e
                                                                                                                )
                                                                                                            }
                                                                                                        >
                                                                                                            <Cog6ToothIcon className="w-5 h-5" />
                                                                                                        </div>
                                                                                                        <div
                                                                                                            className="text-gray-500 text-sm flex flex-col gap-2 italic hover:text-red-400 cursor-pointer"
                                                                                                            onClick={(
                                                                                                                e
                                                                                                            ) =>
                                                                                                                removeRow(
                                                                                                                    e
                                                                                                                )
                                                                                                            }
                                                                                                        >
                                                                                                            <ListBulletIcon className="w-5 h-5" />
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="text-center border border-gray-300 bg-slate-200 w-full  flex items-center rounded-md">
                                                                                                        <div className="text-2xl text-green-400 font-serif w-full  ">
                                                                                                            {
                                                                                                                group
                                                                                                                    .values[
                                                                                                                    group
                                                                                                                        .values
                                                                                                                        .length -
                                                                                                                        1
                                                                                                                ]
                                                                                                                    .VALUE_SUBMIT_COVERAGE
                                                                                                            }
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                </>
                                                                            );
                                                                        }
                                                                    )}
                                                            </fieldset>

                                                            {/* <div className="flex gap-2  p-2">
                                                                            <div className="bg-grey-50 border-gray-300 border rounded-md w-full p-4  mt-2">
                                                                                {el?.VALUE}
                                                                                <div className="text-sm italic text-gray-400">
                                                                                    Note : {el.NOTE_VALUE}
                                                                                </div>
                                                                            </div>
                                                                        </div> */}
                                                        </fieldset>
                                                    </div>
                                                </>
                                            );
                                        })}

                                        <div className="flex gap-2 justify-end mb-2 p-">
                                            <div
                                                className="mt-2 text-gray-500 text-sm flex gap-2 italic hover:text-red-400 cursor-pointer"
                                                onClick={(e) => addRow(e)}
                                            >
                                                <PlusCircleIcon className="w-5 h-5" />{" "}
                                                action 1
                                            </div>
                                            <div
                                                className="mt-2 text-gray-500 text-sm flex gap-2 italic hover:text-red-400 cursor-pointer"
                                                onClick={(e) => removeRow(e)}
                                            >
                                                <MinusCircleIcon className="w-5 h-5" />{" "}
                                                action 2
                                            </div>
                                        </div>
                                    </div>
                                </>
                            );
                        })}
                    </>
                }
            />

            <ActionModal
                submitButtonName={"Register"}
                headers={"Claim Registration"}
                method="post"
                title="Claim Registration"
                show={modal.add}
                onClose={() => {
                    setModal({ ...modal, add: false });
                    setData({
                        client: 0,
                        potentialInsurancePolicy: [
                            {
                                potentialInsurancePolicy: 0,
                                note: "",
                            },
                        ],
                    });
                }}
                data={data}
                url={"/addClaim"}
                onSuccess={handleSuccess}
                classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 lg:w-full w-full mx-5`}
                body={
                    <>
                        <div className="flex gap-4 justify-between">
                            <div className="mt-2 w-full">
                                <InputLabel>
                                    Client Name
                                    <span className=" text-red-600">*</span>
                                </InputLabel>
                                <Select
                                    classNames={{
                                        menuButton: () =>
                                            `flex text-sm text-gray-500 mt-2 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                        menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                        listItem: ({ isSelected }: any) =>
                                            ` block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                isSelected
                                                    ? `text-white bg-red-500`
                                                    : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
                                            }`,
                                    }}
                                    isClearable={true}
                                    primaryColor="red"
                                    options={relationOptions}
                                    isSearchable={true}
                                    placeholder="Select Client Name"
                                    value={
                                        relationOptions.find(
                                            (el: { value: any }) =>
                                                el.value === data.client
                                        ) || null
                                    }
                                    onChange={(e: any) => {
                                        setData({
                                            ...data,
                                            client: e ? e.value : null,
                                        });
                                    }}
                                />
                            </div>

                            <div className="mt-2 w-full">
                                <InputLabel>
                                    Workbook
                                    <span className=" text-red-600">*</span>
                                </InputLabel>
                                <Select
                                    classNames={{
                                        menuButton: () =>
                                            `flex text-sm text-gray-500 mt-2 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                        menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                        listItem: ({ isSelected }: any) =>
                                            ` block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                isSelected
                                                    ? `text-white bg-red-500`
                                                    : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
                                            }`,
                                    }}
                                    isClearable={true}
                                    primaryColor="red"
                                    options={workbookOptions}
                                    isSearchable={true}
                                    placeholder="Select Workbook Milestones"
                                    value={
                                        workbookOptions.find(
                                            (el: { value: any }) =>
                                                el.value === data.workbook
                                        ) || null
                                    }
                                    onChange={(e: any) => {
                                        setData({
                                            ...data,
                                            workbook: e ? e.value : null,
                                        });
                                    }}
                                />
                            </div>
                        </div>

                        {/* form */}
                        <div className=" border-2 border-gray-400 rounded-md bg-gray-100 lg:flex lg:gap-4 lg:justify-between mt-4 p-4">
                            <div className="w-full">
                                <InputLabel className="">
                                    Potential Insurance Policy
                                    <span className=" text-red-600">*</span>
                                </InputLabel>
                                {data?.potentialInsurancePolicy?.map(
                                    (row: any, index: number) => (
                                        <>
                                            <div className="w-full flex gap-4">
                                                <div
                                                    key={index}
                                                    className="mt-2 w-full"
                                                >
                                                    {/* select policy */}
                                                    <Select
                                                        classNames={{
                                                            menuButton: () =>
                                                                `flex text-sm text-gray-500 mt-2 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                            menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                            listItem: ({
                                                                isSelected,
                                                            }: any) =>
                                                                `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                                    isSelected
                                                                        ? `text-white bg-red-500`
                                                                        : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
                                                                }`,
                                                        }}
                                                        primaryColor="red"
                                                        isSearchable={true}
                                                        isClearable={true} // Izinkan penghapusan pilihan
                                                        placeholder="Select Potential Insurance Policy"
                                                        options={
                                                            policyOptionsFilter
                                                        }
                                                        onChange={(e: any) => {
                                                            // Tangani penghapusan (clear) dengan memeriksa nilai e
                                                            const updatedPolicies =
                                                                [
                                                                    ...data.potentialInsurancePolicy,
                                                                ];

                                                            updatedPolicies[
                                                                index
                                                            ] = {
                                                                potentialInsurancePolicy:
                                                                    e
                                                                        ? e.value
                                                                        : null,
                                                                note: "",
                                                            };
                                                            // Update state dengan array yang telah diperbarui
                                                            setData({
                                                                ...data,
                                                                potentialInsurancePolicy:
                                                                    updatedPolicies,
                                                            });
                                                        }}
                                                        value={
                                                            // Tentukan nilai value yang benar, atau null jika tidak ada yang dipilih
                                                            data
                                                                .potentialInsurancePolicy[
                                                                index
                                                            ]
                                                                ? policyOptionsFilter.find(
                                                                      (el: {
                                                                          value: any;
                                                                      }) =>
                                                                          el.value ===
                                                                          data
                                                                              .potentialInsurancePolicy[
                                                                              index
                                                                          ]
                                                                              ?.potentialInsurancePolicy
                                                                  ) || null
                                                                : null
                                                        }
                                                    />
                                                    {/* end select policy */}

                                                    {/* input note */}
                                                    <TextArea
                                                        className="mt-2 h-12"
                                                        placeholder="Note :"
                                                        onChange={(e: any) => {
                                                            const updatedPolicies =
                                                                [
                                                                    ...data.potentialInsurancePolicy,
                                                                ];
                                                            updatedPolicies[
                                                                index
                                                            ] = {
                                                                potentialInsurancePolicy:
                                                                    data
                                                                        .potentialInsurancePolicy[
                                                                        index
                                                                    ]
                                                                        ?.potentialInsurancePolicy,
                                                                note: e.target
                                                                    .value,
                                                            };
                                                            setData({
                                                                ...data,
                                                                potentialInsurancePolicy:
                                                                    updatedPolicies,
                                                            });
                                                        }}
                                                        value={
                                                            data
                                                                .potentialInsurancePolicy[
                                                                index
                                                            ]?.note
                                                        }
                                                    />
                                                    <span className="ml-2 text-sm italic text-gray-400">
                                                        # add note if needed
                                                    </span>
                                                    {/* end input note */}
                                                </div>

                                                <div
                                                    key={index}
                                                    className="mt-2 w-full"
                                                >
                                                    {/* cause of loss */}
                                                    <Select
                                                        classNames={{
                                                            menuButton: () =>
                                                                `flex text-sm text-gray-500 mt-2 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                            menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                            listItem: ({
                                                                isSelected,
                                                            }: any) =>
                                                                `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                                    isSelected
                                                                        ? `text-white bg-red-500`
                                                                        : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
                                                                }`,
                                                        }}
                                                        primaryColor="red"
                                                        isSearchable={true}
                                                        isClearable={true}
                                                        placeholder="Select Cause of Loss"
                                                        options={
                                                            causeOfLossOptions
                                                        }
                                                        onChange={(e: any) => {
                                                            const updatedPolicies =
                                                                [
                                                                    ...data.potentialInsurancePolicy,
                                                                ];
                                                            updatedPolicies[
                                                                index
                                                            ] = {
                                                                ...updatedPolicies[
                                                                    index
                                                                ],
                                                                causeOfLoss: e
                                                                    ? [
                                                                          {
                                                                              causeOfLoss:
                                                                                  e.value,
                                                                              note: "",
                                                                          },
                                                                      ]
                                                                    : [],
                                                            };
                                                            setData({
                                                                ...data,
                                                                potentialInsurancePolicy:
                                                                    updatedPolicies,
                                                            });
                                                        }}
                                                        value={
                                                            data
                                                                .potentialInsurancePolicy[
                                                                index
                                                            ]?.causeOfLoss
                                                                ?.length > 0
                                                                ? causeOfLossOptions.find(
                                                                      (el: {
                                                                          value: any;
                                                                      }) =>
                                                                          el.value ===
                                                                          data
                                                                              .potentialInsurancePolicy[
                                                                              index
                                                                          ]
                                                                              ?.causeOfLoss[0]
                                                                              ?.causeOfLoss
                                                                  ) || null
                                                                : null
                                                        }
                                                    />
                                                    {/* end cause of loss */}

                                                    {/* input note causeOfloss */}
                                                    <TextArea
                                                        className="mt-2 h-12"
                                                        placeholder="Note :"
                                                        onChange={(e: any) => {
                                                            const updatedPolicies =
                                                                [
                                                                    ...data.potentialInsurancePolicy,
                                                                ];
                                                            if (
                                                                updatedPolicies[
                                                                    index
                                                                ]?.causeOfLoss
                                                                    ?.length > 0
                                                            ) {
                                                                updatedPolicies[
                                                                    index
                                                                ].causeOfLoss[0].note =
                                                                    e.target.value;
                                                            }
                                                            setData({
                                                                ...data,
                                                                potentialInsurancePolicy:
                                                                    updatedPolicies,
                                                            });
                                                        }}
                                                        value={
                                                            data
                                                                .potentialInsurancePolicy[
                                                                index
                                                            ]?.causeOfLoss?.[0]
                                                                ?.note || ""
                                                        }
                                                    />
                                                    <span className="ml-2 text-sm italic text-gray-400">
                                                        # add note if needed
                                                    </span>
                                                    {/*end input note causeOfloss */}
                                                </div>
                                            </div>

                                            {/* button add and remove row */}
                                            <div className="flex gap-4">
                                                <div
                                                    className="mt-2 ml-2  w-40 text-gray-500 text-sm flex gap-2 italic hover:text-red-400 cursor-pointer"
                                                    onClick={(e) =>
                                                        addCoverage(e, index)
                                                    }
                                                >
                                                    <PlusCircleIcon className="w-5 h-5" />
                                                    add coverage
                                                </div>
                                                <div
                                                    className="mt-2 ml-2  w-40 text-gray-500 text-sm flex gap-2 italic hover:text-red-400 cursor-pointer"
                                                    onClick={(e) =>
                                                        removeCoverage(e, index)
                                                    }
                                                >
                                                    <MinusCircleIcon className="w-5 h-5" />
                                                    remove coverage
                                                </div>
                                            </div>
                                            {/* end button add and remove row */}

                                            <div className="flex  gap-4 items-end ">
                                                <fieldset className="border border-gray-400 p-4 rounded-md w-full mt-2 ">
                                                    <legend className=" text-sm font-semibold px-2 text-gray-600">
                                                        Coverage
                                                    </legend>

                                                    {data?.potentialInsurancePolicy[
                                                        index
                                                    ]?.coverage?.map(
                                                        (
                                                            coverageItem: any,
                                                            coverageIndex: number
                                                        ) => (
                                                            <>
                                                                <div
                                                                    key={
                                                                        coverageIndex
                                                                    }
                                                                    className=" w-full flex justify-between gap-4"
                                                                >
                                                                    <div className="flex-col w-full">
                                                                        <Select
                                                                            classNames={{
                                                                                menuButton:
                                                                                    () =>
                                                                                        `flex text-sm text-gray-500 mt-2 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                                                menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                                                listItem:
                                                                                    ({
                                                                                        isSelected,
                                                                                    }: any) =>
                                                                                        `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                                                            isSelected
                                                                                                ? `text-white bg-red-500`
                                                                                                : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
                                                                                        }`,
                                                                            }}
                                                                            primaryColor="red"
                                                                            isSearchable={
                                                                                true
                                                                            }
                                                                            isClearable={
                                                                                true
                                                                            }
                                                                            placeholder="Select Coverage"
                                                                            options={
                                                                                coveragesOptions
                                                                            }
                                                                            onChange={(
                                                                                e: any
                                                                            ) => {
                                                                                const updatedPolicies =
                                                                                    [
                                                                                        ...data.potentialInsurancePolicy,
                                                                                    ];
                                                                                const updatedCoverage =
                                                                                    [
                                                                                        ...updatedPolicies[
                                                                                            index
                                                                                        ]
                                                                                            .coverage,
                                                                                    ];
                                                                                updatedCoverage[
                                                                                    coverageIndex
                                                                                ] =
                                                                                    {
                                                                                        coverage:
                                                                                            e
                                                                                                ? e.value
                                                                                                : null,
                                                                                        note: "",
                                                                                    };
                                                                                updatedPolicies[
                                                                                    index
                                                                                ].coverage =
                                                                                    updatedCoverage;
                                                                                setData(
                                                                                    {
                                                                                        ...data,
                                                                                        potentialInsurancePolicy:
                                                                                            updatedPolicies,
                                                                                    }
                                                                                );
                                                                            }}
                                                                            value={
                                                                                data
                                                                                    .potentialInsurancePolicy[
                                                                                    index
                                                                                ]
                                                                                    ?.coverage[
                                                                                    coverageIndex
                                                                                ]
                                                                                    ? coveragesOptions.find(
                                                                                          (el: {
                                                                                              value: any;
                                                                                          }) =>
                                                                                              el.value ===
                                                                                              data
                                                                                                  .potentialInsurancePolicy[
                                                                                                  index
                                                                                              ]
                                                                                                  ?.coverage[
                                                                                                  coverageIndex
                                                                                              ]
                                                                                                  ?.coverage
                                                                                      ) ||
                                                                                      null
                                                                                    : null
                                                                            }
                                                                        />

                                                                        <TextArea
                                                                            className="mt-2 h-12"
                                                                            placeholder="Note :"
                                                                            onChange={(
                                                                                e: any
                                                                            ) => {
                                                                                const updatedPolicies =
                                                                                    [
                                                                                        ...data.potentialInsurancePolicy,
                                                                                    ];
                                                                                const updatedCoverage =
                                                                                    [
                                                                                        ...updatedPolicies[
                                                                                            index
                                                                                        ]
                                                                                            .coverage,
                                                                                    ];
                                                                                updatedCoverage[
                                                                                    coverageIndex
                                                                                ] =
                                                                                    {
                                                                                        coverage:
                                                                                            data
                                                                                                .potentialInsurancePolicy[
                                                                                                index
                                                                                            ]
                                                                                                ?.coverage[
                                                                                                coverageIndex
                                                                                            ]
                                                                                                ?.coverage,
                                                                                        note: e
                                                                                            .target
                                                                                            .value,
                                                                                    };
                                                                                updatedPolicies[
                                                                                    index
                                                                                ].coverage =
                                                                                    updatedCoverage;
                                                                                setData(
                                                                                    {
                                                                                        ...data,
                                                                                        potentialInsurancePolicy:
                                                                                            updatedPolicies,
                                                                                    }
                                                                                );
                                                                            }}
                                                                            value={
                                                                                data
                                                                                    .potentialInsurancePolicy[
                                                                                    index
                                                                                ]
                                                                                    ?.coverage[
                                                                                    coverageIndex
                                                                                ]
                                                                                    ?.note
                                                                            }
                                                                        />
                                                                        <span className="ml-2 text-sm italic text-gray-400">
                                                                            #
                                                                            add
                                                                            note
                                                                            if
                                                                            needed
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                {/* button add and remove row */}
                                                                <div className="flex gap-4">
                                                                    <div
                                                                        className="mt-2 ml-2  w-60 text-gray-500 text-sm flex gap-2 italic hover:text-red-400 cursor-pointer"
                                                                        onClick={(
                                                                            e
                                                                        ) =>
                                                                            addInterestInsured(
                                                                                e,
                                                                                index
                                                                            )
                                                                        }
                                                                    >
                                                                        <PlusCircleIcon className="w-5 h-5" />
                                                                        add
                                                                        Interest
                                                                        Insured
                                                                    </div>
                                                                    <div
                                                                        className="mt-2 ml-2  w-60 text-gray-500 text-sm flex gap-2 italic hover:text-red-400 cursor-pointer"
                                                                        onClick={(
                                                                            e
                                                                        ) =>
                                                                            removeInterestInsured(
                                                                                e,
                                                                                index,
                                                                                coverageIndex
                                                                            )
                                                                        }
                                                                    >
                                                                        <MinusCircleIcon className="w-5 h-5" />
                                                                        remove
                                                                        Interest
                                                                        Insured
                                                                    </div>
                                                                </div>
                                                                {/* end button add and remove row */}

                                                                {/* form select interest insured */}

                                                                {/* interest insured */}
                                                                {coverageItem.interestInsured &&
                                                                    coverageItem
                                                                        .interestInsured
                                                                        .length >
                                                                        0 && (
                                                                        <div className="mt-4">
                                                                            <fieldset className="border border-gray-400 p-4 rounded-md">
                                                                                <legend className="text-sm font-semibold px-2 text-gray-600">
                                                                                    Interest
                                                                                    Insured
                                                                                </legend>
                                                                                {coverageItem.interestInsured.map(
                                                                                    (
                                                                                        interest: any,
                                                                                        interestIndex: number
                                                                                    ) => (
                                                                                        <div
                                                                                            key={
                                                                                                interestIndex
                                                                                            }
                                                                                            className="w-full flex justify-between gap-4"
                                                                                        >
                                                                                            <div className="flex-col w-full">
                                                                                                <Select
                                                                                                    classNames={{
                                                                                                        menuButton:
                                                                                                            () =>
                                                                                                                `flex text-sm text-gray-500 mt-2 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                                                                        menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                                                                        listItem:
                                                                                                            ({
                                                                                                                isSelected,
                                                                                                            }: any) =>
                                                                                                                `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                                                                                    isSelected
                                                                                                                        ? `text-white bg-red-500`
                                                                                                                        : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
                                                                                                                }`,
                                                                                                    }}
                                                                                                    primaryColor="red"
                                                                                                    isSearchable={
                                                                                                        true
                                                                                                    }
                                                                                                    isClearable={
                                                                                                        true
                                                                                                    }
                                                                                                    placeholder="Select Interest Insured"
                                                                                                    options={
                                                                                                        coverageInsuredDetailOptions
                                                                                                    }
                                                                                                    onChange={(
                                                                                                        e: any
                                                                                                    ) => {
                                                                                                        const updatedPolicies =
                                                                                                            [
                                                                                                                ...data.potentialInsurancePolicy,
                                                                                                            ];
                                                                                                        const updatedCoverage =
                                                                                                            [
                                                                                                                ...updatedPolicies[
                                                                                                                    index
                                                                                                                ]
                                                                                                                    .coverage,
                                                                                                            ];
                                                                                                        const updatedInterest =
                                                                                                            [
                                                                                                                ...updatedCoverage[
                                                                                                                    coverageIndex
                                                                                                                ]
                                                                                                                    .interestInsured,
                                                                                                            ];
                                                                                                        updatedInterest[
                                                                                                            interestIndex
                                                                                                        ] =
                                                                                                            {
                                                                                                                interestInsured:
                                                                                                                    e
                                                                                                                        ? e.value
                                                                                                                        : null,
                                                                                                                note: "",
                                                                                                            };
                                                                                                        updatedCoverage[
                                                                                                            coverageIndex
                                                                                                        ].interestInsured =
                                                                                                            updatedInterest;
                                                                                                        updatedPolicies[
                                                                                                            index
                                                                                                        ].coverage =
                                                                                                            updatedCoverage;
                                                                                                        setData(
                                                                                                            {
                                                                                                                ...data,
                                                                                                                potentialInsurancePolicy:
                                                                                                                    updatedPolicies,
                                                                                                            }
                                                                                                        );
                                                                                                    }}
                                                                                                    value={
                                                                                                        interest.interestInsured
                                                                                                            ? coverageInsuredDetailOptions.find(
                                                                                                                  (el: {
                                                                                                                      value: any;
                                                                                                                  }) =>
                                                                                                                      el.value ===
                                                                                                                      interest.interestInsured
                                                                                                              ) ||
                                                                                                              null
                                                                                                            : null
                                                                                                    }
                                                                                                />

                                                                                                <TextArea
                                                                                                    className="mt-2 h-12"
                                                                                                    placeholder="Note :"
                                                                                                    onChange={(
                                                                                                        e: any
                                                                                                    ) => {
                                                                                                        const updatedPolicies =
                                                                                                            [
                                                                                                                ...data.potentialInsurancePolicy,
                                                                                                            ];
                                                                                                        const updatedCoverage =
                                                                                                            [
                                                                                                                ...updatedPolicies[
                                                                                                                    index
                                                                                                                ]
                                                                                                                    .coverage,
                                                                                                            ];
                                                                                                        const updatedInterest =
                                                                                                            [
                                                                                                                ...updatedCoverage[
                                                                                                                    coverageIndex
                                                                                                                ]
                                                                                                                    .interestInsured,
                                                                                                            ];
                                                                                                        updatedInterest[
                                                                                                            interestIndex
                                                                                                        ] =
                                                                                                            {
                                                                                                                interestInsured:
                                                                                                                    interest.interestInsured,
                                                                                                                note: e
                                                                                                                    .target
                                                                                                                    .value,
                                                                                                            };
                                                                                                        updatedCoverage[
                                                                                                            coverageIndex
                                                                                                        ].interestInsured =
                                                                                                            updatedInterest;
                                                                                                        updatedPolicies[
                                                                                                            index
                                                                                                        ].coverage =
                                                                                                            updatedCoverage;
                                                                                                        setData(
                                                                                                            {
                                                                                                                ...data,
                                                                                                                potentialInsurancePolicy:
                                                                                                                    updatedPolicies,
                                                                                                            }
                                                                                                        );
                                                                                                    }}
                                                                                                    value={
                                                                                                        interest.note
                                                                                                    }
                                                                                                />
                                                                                                <span className="ml-2 text-sm italic text-gray-400">
                                                                                                    #
                                                                                                    add
                                                                                                    note
                                                                                                    if
                                                                                                    needed
                                                                                                </span>
                                                                                            </div>

                                                                                            {/* value submit */}
                                                                                            <div className="flex-col w-full">
                                                                                                <CurrencyInput
                                                                                                    id="interest-value-submitted"
                                                                                                    className="mt-2 block w-full h-9 rounded-md border-0 "
                                                                                                    placeholder="Enter interest value submitted"
                                                                                                    prefix="Rp. "
                                                                                                    decimalsLimit={
                                                                                                        2
                                                                                                    }
                                                                                                    onValueChange={(
                                                                                                        value
                                                                                                    ) => {
                                                                                                        const updatedPolicies =
                                                                                                            [
                                                                                                                ...data.potentialInsurancePolicy,
                                                                                                            ];
                                                                                                        const updatedCoverage =
                                                                                                            [
                                                                                                                ...updatedPolicies[
                                                                                                                    index
                                                                                                                ]
                                                                                                                    .coverage,
                                                                                                            ];
                                                                                                        const updatedInterest =
                                                                                                            [
                                                                                                                ...updatedCoverage[
                                                                                                                    coverageIndex
                                                                                                                ]
                                                                                                                    .interestInsured,
                                                                                                            ];
                                                                                                        updatedInterest[
                                                                                                            interestIndex
                                                                                                        ] =
                                                                                                            {
                                                                                                                ...updatedInterest[
                                                                                                                    interestIndex
                                                                                                                ],
                                                                                                                ValueSubmitClaim:
                                                                                                                    value
                                                                                                                        ? parseFloat(
                                                                                                                              value
                                                                                                                          )
                                                                                                                        : 0,
                                                                                                            };
                                                                                                        updatedCoverage[
                                                                                                            coverageIndex
                                                                                                        ].interestInsured =
                                                                                                            updatedInterest;
                                                                                                        updatedPolicies[
                                                                                                            index
                                                                                                        ].coverage =
                                                                                                            updatedCoverage;
                                                                                                        setData(
                                                                                                            {
                                                                                                                ...data,
                                                                                                                potentialInsurancePolicy:
                                                                                                                    updatedPolicies,
                                                                                                            }
                                                                                                        );
                                                                                                    }}
                                                                                                />

                                                                                                <TextArea
                                                                                                    className="mt-2 h-12"
                                                                                                    placeholder="Note :"
                                                                                                    onChange={(
                                                                                                        e: any
                                                                                                    ) => {
                                                                                                        const updatedPolicies =
                                                                                                            [
                                                                                                                ...data.potentialInsurancePolicy,
                                                                                                            ];
                                                                                                        const updatedCoverage =
                                                                                                            [
                                                                                                                ...updatedPolicies[
                                                                                                                    index
                                                                                                                ]
                                                                                                                    .coverage,
                                                                                                            ];
                                                                                                        const updatedInterest =
                                                                                                            [
                                                                                                                ...updatedCoverage[
                                                                                                                    coverageIndex
                                                                                                                ]
                                                                                                                    .interestInsured,
                                                                                                            ];
                                                                                                        updatedInterest[
                                                                                                            interestIndex
                                                                                                        ] =
                                                                                                            {
                                                                                                                ...updatedInterest[
                                                                                                                    interestIndex
                                                                                                                ],
                                                                                                                ValueSubmitClaim:
                                                                                                                    interest.ValueSubmitClaim,
                                                                                                                noteValueSubmitClaim:
                                                                                                                    e
                                                                                                                        .target
                                                                                                                        .value,
                                                                                                            };
                                                                                                        updatedCoverage[
                                                                                                            coverageIndex
                                                                                                        ].interestInsured =
                                                                                                            updatedInterest;
                                                                                                        updatedPolicies[
                                                                                                            index
                                                                                                        ].coverage =
                                                                                                            updatedCoverage;
                                                                                                        setData(
                                                                                                            {
                                                                                                                ...data,
                                                                                                                potentialInsurancePolicy:
                                                                                                                    updatedPolicies,
                                                                                                            }
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                                <span className="ml-2 text-sm italic text-gray-400">
                                                                                                    #
                                                                                                    add
                                                                                                    note
                                                                                                    if
                                                                                                    needed
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                )}
                                                                            </fieldset>
                                                                        </div>
                                                                    )}
                                                                {/* end interest insured */}
                                                            </>
                                                        )
                                                    )}
                                                </fieldset>
                                            </div>

                                            <div className="border border-1 mt-4"></div>
                                        </>
                                    )
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <div
                                className="mt-2 text-gray-500 text-sm flex gap-2 italic hover:text-red-400 cursor-pointer"
                                onClick={(e) => addRow(e)}
                            >
                                <PlusCircleIcon className="w-5 h-5" /> add row
                            </div>
                            <div
                                className="mt-2 text-gray-500 text-sm flex gap-2 italic hover:text-red-400 cursor-pointer"
                                onClick={(e) => removeRow(e)}
                            >
                                <MinusCircleIcon className="w-5 h-5" /> remove
                                row
                            </div>
                        </div>

                        {/* end form */}
                    </>
                }
            />

            <ActionModal
                submitButtonName={""}
                cancelButtonName={"Close"}
                headers={"Claim info"}
                method=""
                title=""
                show={modal.edit}
                onClose={() => {
                    setModal({ ...modal, edit: false, updateValue: false });
                }}
                data={""}
                url={""}
                onSuccess={handleSuccess}
                classPanel={`relative transform overflow-x-auto rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 lg:w-full w-full mx-5  `}
                body={
                    <>
                        {/* form */}
                        <div className="h-auto p-4 ">
                            <fieldset className=" sm:flex sm:flex-col sm:gap-4 lg:flex lg:flex-row lg:gap-2 border border-gray-400 px-4 rounded-md w-full mt-2 ">
                                <legend className="text-lg font-semibold px-2 text-gray-600 mb-2">
                                    Claim Info
                                </legend>
                                <div className="sm:w-full lg:w-full ">
                                    {/* claim status */}
                                    <div className="flex gap-2 justify-between p-2">
                                        <div className=" text-lg font-medium italic mt-2">
                                            {dataId?.CLAIM_STATUS === 0 && (
                                                <div className=" flex gap-2 justify-center p-2 rounded-md text-blue-400 border-blue-400">
                                                    <PresentationChartBarIcon className="w-7 h-7" />
                                                    <div className="flex items-center">
                                                        Normal Progress
                                                    </div>
                                                </div>
                                            )}
                                            {dataId?.CLAIM_STATUS === 1 && (
                                                <div className=" flex gap-2 justify-center p-2 rounded-md text-yellow-300 border-yellow-300">
                                                    <ExclamationTriangleIcon className="w-7 h-7 " />
                                                    <div className="flex items-center">
                                                        {" "}
                                                        Potential Dispute
                                                    </div>
                                                </div>
                                            )}
                                            {dataId?.CLAIM_STATUS === 2 && (
                                                <div className=" flex gap-2 justify-center p-2 rounded-md text-green-400 border-green-300">
                                                    <ExclamationTriangleIcon className="w-7 h-7" />
                                                    <div className="flex items-center">
                                                        Potential Litigation
                                                    </div>
                                                </div>
                                            )}
                                            {dataId?.CLAIM_STATUS === 3 && (
                                                <div className=" flex gap-2 justify-center p-2 rounded-md text-green-400 border-green-300">
                                                    <ScaleIcon className="w-7 h-7" />
                                                    <div className="flex items-center">
                                                        Litigation
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex">
                                            <div
                                                className="italic flex gap-2 justify-center p-2 rounded-md text-gray-500 hover:text-red-400 cursor-pointer"
                                                onClick={() =>
                                                    setModal({
                                                        ...modal,
                                                        uploadDoc: true,
                                                    })
                                                }
                                            >
                                                <FolderPlusIcon className="w-7 h-7" />
                                                <div className="flex items-center text-lg font-medium">
                                                    Upload Documents
                                                </div>
                                            </div>
                                            <div
                                                className="italic flex gap-2 justify-center p-2 rounded-md text-gray-500 hover:text-red-400 cursor-pointer"
                                                onClick={() =>
                                                    setModal({
                                                        ...modal,
                                                        stepper: true,
                                                    })
                                                }
                                            >
                                                <ClipboardDocumentListIcon className="w-7 h-7" />
                                                <div className="flex items-center text-lg font-medium">
                                                    Claim Milestone
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/*end  claim status */}

                                    <div className="text-lg flex gap-2 text-center rounded-lg border border-gray-300 bg-slate-200">
                                        <div className=" w-full p-2 rounded-lg font-medium ">
                                            <div className="w-full rounded-lg h-10 mt-2">
                                                ({" "}
                                                {
                                                    dataId?.relation
                                                        ?.RELATION_ORGANIZATION_NAME
                                                }
                                                )
                                            </div>
                                        </div>
                                        <div className=" w-full p-2 rounded-md ">
                                            <div className=" w-full p-2 rounded-lg ">
                                                ( {dataId?.CLAIM_ID} Claim Code)
                                            </div>
                                        </div>
                                    </div>
                                    <fieldset className="mt-1 p-4 justify-end border border-gray-400 rounded-md mb-6">
                                        <legend className=" text-md font-semibold px-2 text-gray-600">
                                            Claim Value
                                        </legend>

                                        <div className="text-md bg-slate-200 border-gray-300 border flex gap-2 w-full text-center rounded-md font-semibold">
                                            <div className=" rounded-md p-2 h-15 w-full">
                                                Potential Policy
                                            </div>
                                            <div className=" rounded-md p-2 h-15 w-full">
                                                Proposes Values
                                            </div>
                                            <div className=" rounded-md p-2 h-15 w-full">
                                                Value Proposed By Adjuster
                                            </div>
                                            <div className=" rounded-md p-2 h-15 w-full">
                                                Agreed Values
                                            </div>
                                        </div>

                                        <div className="px-3 flex space-x-2 w-full mt-2">
                                            {/* Potential policy */}
                                            <div className=" rounded-md p-2 h-15 w-full">
                                                {dataId.policy?.map(
                                                    (el: any) => {
                                                        // console.log(el, 'policy');
                                                        // console.log(dataId, 'dataId');

                                                        return (
                                                            <>
                                                                <div className="mt-2 mb-4">
                                                                    <div className="bg-slate-200 border-gray-300 border rounded-md w-full p-4 h-24">
                                                                        <div className="text-lg text-center font-sans border-gray-300">
                                                                            {" "}
                                                                            {
                                                                                el
                                                                                    ?.policy[0]
                                                                                    ?.POLICY_THE_INSURED
                                                                            }{" "}
                                                                        </div>
                                                                        <div className="text-lg text-center font-sans border-gray-300">
                                                                            {" "}
                                                                            {
                                                                                el
                                                                                    ?.policy[0]
                                                                                    ?.POLICY_NUMBER
                                                                            }{" "}
                                                                        </div>
                                                                    </div>
                                                                    {dataId.coverage?.map(
                                                                        (
                                                                            el: any
                                                                        ) => {
                                                                            const currency =
                                                                                el
                                                                                    ?.insured?.[0]
                                                                                    ?.claim_coverage
                                                                                    ?.currency
                                                                                    ?.CURRENCY_SYMBOL;
                                                                            const coverageName =
                                                                                el
                                                                                    ?.coverage
                                                                                    ?.POLICY_COVERAGE_NAME;
                                                                            return (
                                                                                <>
                                                                                    <div className="px-4 mt-2 ">
                                                                                        <div className="h-16 font-semibold">
                                                                                            {
                                                                                                coverageName
                                                                                            }
                                                                                        </div>
                                                                                        {el?.insured
                                                                                            ?.reduce(
                                                                                                (
                                                                                                    acc: any,
                                                                                                    curr: any
                                                                                                ) => {
                                                                                                    const existing =
                                                                                                        acc.find(
                                                                                                            (
                                                                                                                item: any
                                                                                                            ) =>
                                                                                                                item
                                                                                                                    .claim_coverage
                                                                                                                    .POLICY_COVERAGE_DETAIL_ID ===
                                                                                                                curr
                                                                                                                    .claim_coverage
                                                                                                                    .POLICY_COVERAGE_DETAIL_ID
                                                                                                        );
                                                                                                    if (
                                                                                                        existing
                                                                                                    ) {
                                                                                                        existing.values.push(
                                                                                                            curr
                                                                                                        );
                                                                                                    } else {
                                                                                                        acc.push(
                                                                                                            {
                                                                                                                claim_coverage:
                                                                                                                    curr.claim_coverage,
                                                                                                                values: [
                                                                                                                    curr,
                                                                                                                ],
                                                                                                            }
                                                                                                        );
                                                                                                    }
                                                                                                    return acc;
                                                                                                },
                                                                                                []
                                                                                            )
                                                                                            .map(
                                                                                                (
                                                                                                    group: any,
                                                                                                    index: any
                                                                                                ) => (
                                                                                                    <div
                                                                                                        key={
                                                                                                            index
                                                                                                        }
                                                                                                        className={`rounded-md px-4 mt-3 p-2 h-10 ${
                                                                                                            index %
                                                                                                                2 ===
                                                                                                            0
                                                                                                                ? "bg-slate-200"
                                                                                                                : ""
                                                                                                        }`}
                                                                                                    >
                                                                                                        -{" "}
                                                                                                        {
                                                                                                            group
                                                                                                                .claim_coverage
                                                                                                                .interest_insured
                                                                                                                .INTEREST_INSURED_NAME
                                                                                                        }
                                                                                                    </div>
                                                                                                )
                                                                                            )}
                                                                                    </div>
                                                                                </>
                                                                            );
                                                                        }
                                                                    )}
                                                                </div>
                                                                <div className="border border-gray-300 mb-4"></div>
                                                            </>
                                                        );
                                                    }
                                                )}
                                            </div>
                                            {/* Potential policy */}

                                            {/* value propose */}
                                            <div className="rounded-md p-2 h-15 w-full">
                                                {dataId.policy?.map(
                                                    (el: any) => {
                                                        return (
                                                            <>
                                                                <div className="mt-2 mb-4">
                                                                    <div className=" flex flex-row justify-center gap-2 bg-slate-200 border-gray-300 border rounded-md w-full p-4 h-24 text-2xl font-sans text-center items-center font-medium   ">
                                                                        {/* <div className="text-lg font-sans border-gray-300 text-center"> */}
                                                                        {dataId.coverage?.map(
                                                                            (
                                                                                el: any,
                                                                                index: number
                                                                            ) => {
                                                                                if (
                                                                                    !el
                                                                                        ?.insured
                                                                                        ?.length
                                                                                )
                                                                                    return null; // Pastikan ada data

                                                                                // Group by POLICY_COVERAGE_DETAIL_ID
                                                                                const grouped =
                                                                                    el.insured.reduce(
                                                                                        (
                                                                                            acc: any,
                                                                                            insured: any
                                                                                        ) => {
                                                                                            const policyId =
                                                                                                insured.POLICY_COVERAGE_DETAIL_ID;
                                                                                            if (
                                                                                                !acc[
                                                                                                    policyId
                                                                                                ] ||
                                                                                                acc[
                                                                                                    policyId
                                                                                                ]
                                                                                                    .CLAIM_COVERAGE_INSURED_ID <
                                                                                                    insured.CLAIM_COVERAGE_INSURED_ID
                                                                                            ) {
                                                                                                acc[
                                                                                                    policyId
                                                                                                ] =
                                                                                                    insured; // Simpan insured dengan ID terbesar
                                                                                            }
                                                                                            return acc;
                                                                                        },
                                                                                        {}
                                                                                    );

                                                                                // Ambil insured terakhir dari setiap POLICY_COVERAGE_DETAIL_ID dan jumlahkan VALUE_SUBMIT_COVERAGE
                                                                                const sumValue =
                                                                                    Object.values(
                                                                                        grouped
                                                                                    ).reduce(
                                                                                        (
                                                                                            acc: number,
                                                                                            insured: any
                                                                                        ) => {
                                                                                            return (
                                                                                                acc +
                                                                                                (Number(
                                                                                                    insured?.VALUE_SUBMIT_COVERAGE
                                                                                                ) ||
                                                                                                    0)
                                                                                            );
                                                                                        },
                                                                                        0
                                                                                    );

                                                                                // Ambil currency dari insured terakhir yang dipilih
                                                                                const firstGroupedItem =
                                                                                    Object.values(
                                                                                        grouped
                                                                                    )[0];
                                                                                const currency =
                                                                                    (
                                                                                        firstGroupedItem as any
                                                                                    )
                                                                                        ?.claim_coverage
                                                                                        ?.currency
                                                                                        ?.CURRENCY_SYMBOL ||
                                                                                    "IDR";

                                                                                return (
                                                                                    <div
                                                                                        key={
                                                                                            index
                                                                                        }
                                                                                        className="flex items-center space-x-2"
                                                                                    >
                                                                                        <div>
                                                                                            {
                                                                                                currency
                                                                                            }
                                                                                        </div>
                                                                                        <div className="flex flex-col">
                                                                                            {
                                                                                                sumValue
                                                                                            }
                                                                                        </div>
                                                                                        <div
                                                                                            className="text-gray-500 text-sm flex italic hover:text-red-400 cursor-pointer"
                                                                                            onClick={() => {
                                                                                                setModal(
                                                                                                    {
                                                                                                        ...modal,
                                                                                                        historyValue:
                                                                                                            true,
                                                                                                    }
                                                                                                );
                                                                                            }}
                                                                                        >
                                                                                            <ExclamationCircleIcon className="w-6 h-8" />
                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            }
                                                                        )}

                                                                        {/* </div> */}
                                                                    </div>
                                                                    {dataId.coverage?.map(
                                                                        (
                                                                            el: any,
                                                                            index: number
                                                                        ) => {
                                                                            const currency =
                                                                                el
                                                                                    ?.insured?.[0]
                                                                                    ?.claim_coverage
                                                                                    ?.currency
                                                                                    ?.CURRENCY_SYMBOL;
                                                                            return (
                                                                                <>
                                                                                    <div className="px-4 mt-2 text-center ">
                                                                                        <div className="h-16">
                                                                                            Values
                                                                                            Claim
                                                                                            submitted
                                                                                        </div>
                                                                                        <div className="">
                                                                                            {el?.insured
                                                                                                ?.reduce(
                                                                                                    (
                                                                                                        acc: any,
                                                                                                        curr: any
                                                                                                    ) => {
                                                                                                        const existing =
                                                                                                            acc.find(
                                                                                                                (
                                                                                                                    item: any
                                                                                                                ) =>
                                                                                                                    item
                                                                                                                        .claim_coverage
                                                                                                                        .POLICY_COVERAGE_DETAIL_ID ===
                                                                                                                    curr
                                                                                                                        .claim_coverage
                                                                                                                        .POLICY_COVERAGE_DETAIL_ID
                                                                                                            );
                                                                                                        if (
                                                                                                            existing
                                                                                                        ) {
                                                                                                            existing.values.push(
                                                                                                                curr
                                                                                                            );
                                                                                                        } else {
                                                                                                            acc.push(
                                                                                                                {
                                                                                                                    claim_coverage:
                                                                                                                        curr.claim_coverage,
                                                                                                                    values: [
                                                                                                                        curr,
                                                                                                                    ],
                                                                                                                }
                                                                                                            );
                                                                                                        }
                                                                                                        return acc;
                                                                                                    },
                                                                                                    []
                                                                                                )
                                                                                                .map(
                                                                                                    (
                                                                                                        group: any,
                                                                                                        index: any
                                                                                                    ) => {
                                                                                                        const latestValue =
                                                                                                            group
                                                                                                                .values[
                                                                                                                group
                                                                                                                    .values
                                                                                                                    .length -
                                                                                                                    1
                                                                                                            ];
                                                                                                        return (
                                                                                                            <div
                                                                                                                key={
                                                                                                                    index
                                                                                                                }
                                                                                                                className={`rounded-md flex justify-between px-4 mt-3 p-2 h-10 ${
                                                                                                                    index %
                                                                                                                        2 ===
                                                                                                                    0
                                                                                                                        ? "bg-slate-200"
                                                                                                                        : ""
                                                                                                                }`}
                                                                                                            >
                                                                                                                <div className="">
                                                                                                                    {
                                                                                                                        currency
                                                                                                                    }
                                                                                                                </div>
                                                                                                                <div className="">
                                                                                                                    {
                                                                                                                        latestValue?.VALUE_SUBMIT_COVERAGE
                                                                                                                    }
                                                                                                                </div>
                                                                                                                <div
                                                                                                                    className="text-gray-500 text-sm flex italic hover:text-red-400 cursor-pointer"
                                                                                                                    onClick={(
                                                                                                                        e
                                                                                                                    ) => {
                                                                                                                        valueRevChange(
                                                                                                                            e,
                                                                                                                            latestValue
                                                                                                                        );
                                                                                                                    }}
                                                                                                                >
                                                                                                                    <CogIcon className="w-5 h-5" />
                                                                                                                    {/* Rev */}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        );
                                                                                                    }
                                                                                                )}
                                                                                        </div>
                                                                                    </div>
                                                                                </>
                                                                            );
                                                                        }
                                                                    )}
                                                                </div>
                                                                <div className="border border-gray-300 mb-4"></div>
                                                            </>
                                                        );
                                                    }
                                                )}
                                            </div>
                                            {/* end value propose */}

                                            {/* value from adjuster */}
                                            <div className="rounded-md p-2 h-15 w-full">
                                                {dataId.policy?.map(
                                                    (el: any) => {
                                                        return (
                                                            <>
                                                                <div className="mt-2 mb-4">
                                                                    <div className=" flex flex-row justify-center gap-2 bg-slate-200 border-gray-300 border rounded-md w-full p-4 h-24 text-2xl font-sans text-center items-center font-medium   ">
                                                                        {/* <div className="text-lg font-sans border-gray-300 text-center"> */}
                                                                        {dataId.coverage?.map(
                                                                            (
                                                                                el: any
                                                                            ) => {
                                                                                const sumValue =
                                                                                    el?.insured?.reduce(
                                                                                        (
                                                                                            acc: any,
                                                                                            el: any
                                                                                        ) => {
                                                                                            return (
                                                                                                acc +
                                                                                                el?.VALUE_SUBMIT_COVERAGE
                                                                                            );
                                                                                        },
                                                                                        0
                                                                                    );
                                                                                const currency =
                                                                                    el
                                                                                        ?.insured?.[0]
                                                                                        ?.claim_coverage
                                                                                        ?.currency
                                                                                        ?.CURRENCY_SYMBOL;
                                                                                return (
                                                                                    <>
                                                                                        <div className="">
                                                                                            {
                                                                                                currency
                                                                                            }
                                                                                        </div>
                                                                                        <div className="">
                                                                                            {/* {sumValue} */}
                                                                                            No
                                                                                            data
                                                                                        </div>
                                                                                        <div
                                                                                            className="text-gray-500 text-sm flex italic hover:text-red-400 cursor-pointer"
                                                                                            onClick={(
                                                                                                e
                                                                                            ) =>
                                                                                                removeRow(
                                                                                                    e
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            <ExclamationCircleIcon className="w-6 h-8" />
                                                                                        </div>
                                                                                    </>
                                                                                );
                                                                            }
                                                                        )}
                                                                        {/* </div> */}
                                                                    </div>
                                                                    {dataId.coverage?.map(
                                                                        (
                                                                            el: any,
                                                                            index: number
                                                                        ) => {
                                                                            const currency =
                                                                                el
                                                                                    ?.insured?.[0]
                                                                                    ?.claim_coverage
                                                                                    ?.currency
                                                                                    ?.CURRENCY_SYMBOL;
                                                                            return (
                                                                                <>
                                                                                    <div className="px-4 mt-2 text-center ">
                                                                                        <div className="h-16">
                                                                                            Value
                                                                                            Proposed
                                                                                            By
                                                                                            Adjuster
                                                                                        </div>
                                                                                        <div className="">
                                                                                            {el?.insured
                                                                                                ?.reduce(
                                                                                                    (
                                                                                                        acc: any,
                                                                                                        curr: any
                                                                                                    ) => {
                                                                                                        const existing =
                                                                                                            acc.find(
                                                                                                                (
                                                                                                                    item: any
                                                                                                                ) =>
                                                                                                                    item
                                                                                                                        .claim_coverage
                                                                                                                        .POLICY_COVERAGE_DETAIL_ID ===
                                                                                                                    curr
                                                                                                                        .claim_coverage
                                                                                                                        .POLICY_COVERAGE_DETAIL_ID
                                                                                                            );
                                                                                                        if (
                                                                                                            existing
                                                                                                        ) {
                                                                                                            existing.values.push(
                                                                                                                curr
                                                                                                            );
                                                                                                        } else {
                                                                                                            acc.push(
                                                                                                                {
                                                                                                                    claim_coverage:
                                                                                                                        curr.claim_coverage,
                                                                                                                    values: [
                                                                                                                        curr,
                                                                                                                    ],
                                                                                                                }
                                                                                                            );
                                                                                                        }
                                                                                                        return acc;
                                                                                                    },
                                                                                                    []
                                                                                                )
                                                                                                .map(
                                                                                                    (
                                                                                                        group: any,
                                                                                                        index: any
                                                                                                    ) => {
                                                                                                        const latestValue =
                                                                                                            group
                                                                                                                .values[
                                                                                                                group
                                                                                                                    .values
                                                                                                                    .length -
                                                                                                                    1
                                                                                                            ];
                                                                                                        return (
                                                                                                            <div
                                                                                                                key={
                                                                                                                    index
                                                                                                                }
                                                                                                                className={`rounded-md flex justify-between px-4 mt-3 p-2 h-10 ${
                                                                                                                    index %
                                                                                                                        2 ===
                                                                                                                    0
                                                                                                                        ? "bg-slate-200"
                                                                                                                        : ""
                                                                                                                }`}
                                                                                                            >
                                                                                                                {/* <div className="">{currency}</div>
                                                                                                    <div className="">{latestValue?.VALUE_SUBMIT_COVERAGE}</div>
                                                                                                    <div className="text-gray-500 text-sm flex italic hover:text-red-400 cursor-pointer"
                                                                                                        onClick={(e) => {
                                                                                                            valueRevChange(e, latestValue)
                                                                                                        }}>
                                                                                                        <CogIcon className="w-5 h-5" />
                                                                                                    </div> */}
                                                                                                            </div>
                                                                                                        );
                                                                                                    }
                                                                                                )}
                                                                                        </div>
                                                                                    </div>
                                                                                </>
                                                                            );
                                                                        }
                                                                    )}
                                                                </div>
                                                                <div className="border border-gray-300 mb-4"></div>
                                                            </>
                                                        );
                                                    }
                                                )}
                                            </div>
                                            {/* end value adjuster */}

                                            {/* Agreed Value */}
                                            <div className="rounded-md p-2 h-15 w-full">
                                                {dataId.policy?.map(
                                                    (el: any) => {
                                                        return (
                                                            <>
                                                                <div className="mt-2 mb-4">
                                                                    <div className=" flex flex-row justify-center gap-2 bg-slate-200 border-gray-300 border rounded-md w-full p-4 h-24 text-2xl font-sans text-center items-center font-medium   ">
                                                                        {/* <div className="text-lg font-sans border-gray-300 text-center"> */}
                                                                        {dataId.coverage?.map(
                                                                            (
                                                                                el: any
                                                                            ) => {
                                                                                const sumValue =
                                                                                    el?.insured?.reduce(
                                                                                        (
                                                                                            acc: any,
                                                                                            el: any
                                                                                        ) => {
                                                                                            return (
                                                                                                acc +
                                                                                                el?.VALUE_SUBMIT_COVERAGE
                                                                                            );
                                                                                        },
                                                                                        0
                                                                                    );
                                                                                const currency =
                                                                                    el
                                                                                        ?.insured?.[0]
                                                                                        ?.claim_coverage
                                                                                        ?.currency
                                                                                        ?.CURRENCY_SYMBOL;
                                                                                return (
                                                                                    <>
                                                                                        <div className="">
                                                                                            {
                                                                                                currency
                                                                                            }
                                                                                        </div>
                                                                                        <div className="">
                                                                                            {/* {sumValue} */}
                                                                                            No
                                                                                            data
                                                                                        </div>
                                                                                        <div
                                                                                            className="text-gray-500 text-sm flex italic hover:text-red-400 cursor-pointer"
                                                                                            onClick={(
                                                                                                e
                                                                                            ) =>
                                                                                                removeRow(
                                                                                                    e
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            <ExclamationCircleIcon className="w-6 h-8" />
                                                                                        </div>
                                                                                    </>
                                                                                );
                                                                            }
                                                                        )}
                                                                        {/* </div> */}
                                                                    </div>
                                                                    {dataId.coverage?.map(
                                                                        (
                                                                            el: any,
                                                                            index: number
                                                                        ) => {
                                                                            const currency =
                                                                                el
                                                                                    ?.insured?.[0]
                                                                                    ?.claim_coverage
                                                                                    ?.currency
                                                                                    ?.CURRENCY_SYMBOL;
                                                                            return (
                                                                                <>
                                                                                    <div className="px-4 mt-2 text-center ">
                                                                                        <div className="h-16">
                                                                                            Agreed
                                                                                            Values
                                                                                        </div>
                                                                                        <div className="">
                                                                                            {el?.insured
                                                                                                ?.reduce(
                                                                                                    (
                                                                                                        acc: any,
                                                                                                        curr: any
                                                                                                    ) => {
                                                                                                        const existing =
                                                                                                            acc.find(
                                                                                                                (
                                                                                                                    item: any
                                                                                                                ) =>
                                                                                                                    item
                                                                                                                        .claim_coverage
                                                                                                                        .POLICY_COVERAGE_DETAIL_ID ===
                                                                                                                    curr
                                                                                                                        .claim_coverage
                                                                                                                        .POLICY_COVERAGE_DETAIL_ID
                                                                                                            );
                                                                                                        if (
                                                                                                            existing
                                                                                                        ) {
                                                                                                            existing.values.push(
                                                                                                                curr
                                                                                                            );
                                                                                                        } else {
                                                                                                            acc.push(
                                                                                                                {
                                                                                                                    claim_coverage:
                                                                                                                        curr.claim_coverage,
                                                                                                                    values: [
                                                                                                                        curr,
                                                                                                                    ],
                                                                                                                }
                                                                                                            );
                                                                                                        }
                                                                                                        return acc;
                                                                                                    },
                                                                                                    []
                                                                                                )
                                                                                                .map(
                                                                                                    (
                                                                                                        group: any,
                                                                                                        index: any
                                                                                                    ) => {
                                                                                                        const latestValue =
                                                                                                            group
                                                                                                                .values[
                                                                                                                group
                                                                                                                    .values
                                                                                                                    .length -
                                                                                                                    1
                                                                                                            ];
                                                                                                        return (
                                                                                                            <div
                                                                                                                key={
                                                                                                                    index
                                                                                                                }
                                                                                                                className={`rounded-md flex justify-between px-4 mt-3 p-2 h-10 ${
                                                                                                                    index %
                                                                                                                        2 ===
                                                                                                                    0
                                                                                                                        ? "bg-slate-200"
                                                                                                                        : ""
                                                                                                                }`}
                                                                                                            >
                                                                                                                {/* <div className="">{currency}</div> */}
                                                                                                                {/* <div className="">{latestValue?.VALUE_SUBMIT_COVERAGE}</div> */}
                                                                                                                {/* <div className="text-gray-500 text-sm flex italic hover:text-red-400 cursor-pointer"
                                                                                                        onClick={(e) => {
                                                                                                            valueRevChange(e, latestValue)
                                                                                                        }}>
                                                                                                        <CogIcon className="w-5 h-5" />
                                                                                                    </div> */}
                                                                                                            </div>
                                                                                                        );
                                                                                                    }
                                                                                                )}
                                                                                        </div>
                                                                                    </div>
                                                                                </>
                                                                            );
                                                                        }
                                                                    )}
                                                                </div>
                                                                <div className="border border-gray-300 mb-4"></div>
                                                            </>
                                                        );
                                                    }
                                                )}
                                            </div>
                                            {/* Agreed Value */}
                                        </div>
                                    </fieldset>
                                </div>
                            </fieldset>
                        </div>
                        {/* end form */}

                        <ActionModal
                            submitButtonName={"Submit"}
                            headers={"updated value"}
                            method="POST"
                            title="Update Value"
                            show={modal.updateValue}
                            onClose={(e: any) => {
                                setModal({
                                    ...modal,
                                    updateValue: false,
                                    edit: false,
                                });
                            }}
                            data={valueRev}
                            url={"/storeInsuredValue"}
                            onSuccess={handleSuccessAdd}
                            // classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 lg:w-3/4 w-full mx-5`}
                            classPanel={
                                "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-1xl"
                            }
                            body={
                                <>
                                    <div className=" w-full p-2 rounded-lg ">
                                        {
                                            dataId?.coverage?.[0]?.coverage
                                                ?.POLICY_COVERAGE_NAME
                                        }
                                    </div>
                                    <div className=" w-full p-2 rounded-lg ">
                                        {
                                            insuredId?.claim_coverage
                                                ?.interest_insured
                                                ?.INTEREST_INSURED_NAME
                                        }
                                    </div>
                                    <div className="relative">
                                        <div className="mb-2">
                                            <div className="container">
                                                <InputLabel>
                                                    Values Revision
                                                    <span className=" text-red-600">
                                                        *
                                                    </span>
                                                </InputLabel>
                                            </div>
                                            <CurrencyInput
                                                className="mt-2 block w-full h-9 rounded-md border-0 "
                                                placeholder="Enter claim value submitted"
                                                onValueChange={(value) => {
                                                    setValueRev(
                                                        (prev: any) => ({
                                                            ...prev,
                                                            VALUE_SUBMIT_COVERAGE:
                                                                value
                                                                    ? parseFloat(
                                                                          value
                                                                      )
                                                                    : 0,
                                                        })
                                                    );
                                                }}
                                                value={
                                                    valueRev?.VALUE_SUBMIT_COVERAGE
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <div className="mb-2">
                                            <div className="container">
                                                <InputLabel>
                                                    Values Revision
                                                    <span className=" text-red-600">
                                                        *
                                                    </span>
                                                </InputLabel>
                                            </div>
                                            <TextArea
                                                type="number"
                                                // value={dataInputEdit?.name || ''}
                                                value={valueRev?.NOTE || ""}
                                                className="mt-2"
                                                onChange={(e: any) => {
                                                    setValueRev(
                                                        (prev: any) => ({
                                                            ...prev,
                                                            NOTE: e.target
                                                                .value,
                                                        })
                                                    );
                                                }}
                                                // required
                                                autoComplete="off"
                                                placeholder="Note"
                                            />
                                        </div>
                                    </div>
                                </>
                            }
                        />
                    </>
                }
            />

            <ActionModal
                submitButtonName={""}
                headers={""}
                method=""
                title="Value Revision"
                show={modal.historyValue}
                onClose={() => setModal({ ...modal, historyValue: false })}
                data={""}
                url={""}
                onSuccess={""}
                classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 lg:w-3/4 w-full mx-5`}
                body={
                    <>
                        <div className="p-4"></div>
                        <h2 className="text-lg font-semibold mb-4">
                            History of Value Submitted Coverage
                        </h2>
                        <div className="overflow-y-auto max-h-96">
                            {dataId.coverage?.map(
                                (coverage: any, index: number) => (
                                    <div key={index} className="mb-4">
                                        <h3 className="text-md font-medium">
                                            {
                                                coverage.coverage
                                                    .POLICY_COVERAGE_NAME
                                            }
                                        </h3>
                                        <div className="border border-black mb-2"></div>
                                        {coverage.insured
                                            ?.sort(
                                                (a: any, b: any) =>
                                                    a.claim_coverage
                                                        .POLICY_COVERAGE_DETAIL_ID -
                                                    b.claim_coverage
                                                        .POLICY_COVERAGE_DETAIL_ID
                                            )
                                            ?.reduce((acc: any, curr: any) => {
                                                // console.log(acc, curr);

                                                const existing = acc.find(
                                                    (item: any) =>
                                                        item.claim_coverage
                                                            .POLICY_COVERAGE_DETAIL_ID ===
                                                        curr.claim_coverage
                                                            .POLICY_COVERAGE_DETAIL_ID
                                                );
                                                if (existing) {
                                                    existing.values.push(curr);
                                                } else {
                                                    acc.push({
                                                        claim_coverage:
                                                            curr.claim_coverage,
                                                        values: [curr],
                                                    });
                                                }
                                                return acc;
                                            }, [])
                                            ?.map(
                                                (
                                                    group: any,
                                                    groupIndex: number
                                                ) => (
                                                    <div
                                                        key={groupIndex}
                                                        className="mb-4"
                                                    >
                                                        <h4 className="text-sm font-semibold">
                                                            {
                                                                group
                                                                    .claim_coverage
                                                                    .interest_insured
                                                                    .INTEREST_INSURED_NAME
                                                            }
                                                        </h4>
                                                        {group.values.map(
                                                            (
                                                                insured: any,
                                                                insuredIndex: number
                                                            ) => (
                                                                <>
                                                                    <div
                                                                        key={
                                                                            insuredIndex
                                                                        }
                                                                        className={`p-2 border-b border-gray-300 ${
                                                                            insuredIndex %
                                                                                2 ===
                                                                            0
                                                                                ? "bg-gray-200"
                                                                                : ""
                                                                        }`}
                                                                    >
                                                                        <div className="flex justify-between">
                                                                            <span>
                                                                                {
                                                                                    insured.VALUE_SUBMIT_COVERAGE
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                        <div className="text-sm text-gray-500">
                                                                            Note:{" "}
                                                                            {
                                                                                insured.NOTE_VALUE_SUBMIT_COVERAGE
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )
                                                        )}
                                                    </div>
                                                )
                                            )}
                                    </div>
                                )
                            )}
                        </div>
                    </>
                }
            />

            <ActionModal
                submitButtonName={""}
                headers={""}
                method=""
                title="Upload Documents"
                show={modal.uploadDoc}
                onClose={() => setModal({ ...modal, uploadDoc: false })}
                data={""}
                url={""}
                onSuccess={""}
                classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 lg:w-3/4 w-full mx-5`}
                body={
                    <>
                        <div className="">
                            <div className="mt-2">
                                <InputLabel>
                                    Title Document
                                    {/* <span className=" text-red-600">*</span> */}
                                </InputLabel>
                                <TextInput
                                    type="text"
                                    className="mt-2"
                                    autoComplete="off"
                                    placeholder="Enter title"
                                />
                            </div>
                            <div className="mt-2">
                                <Input
                                    name="proof_of_document"
                                    type="file"
                                    className="w-full"
                                />
                                <TextArea
                                    type="text"
                                    className="mt-2"
                                    autoComplete="off"
                                    placeholder="Enter title"
                                />
                            </div>
                        </div>
                    </>
                }
            />

            {/* body */}
            <div className="grid grid-cols-4 py-4 xs:grid xs:grid-cols-1 xs:gap-0 lg:grid lg:grid-cols-4 lg:gap-4">
                <div className="flex flex-col">
                    <div className="bg-white mb-4 rounded-md p-4">
                        <div
                            className="bg-red-600 w-fit p-2 rounded-md text-white hover:bg-red-500 hover:cursor-pointer"
                            onClick={() => setModal({ ...modal, add: true })}
                        >
                            <span>Add Claim</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-md shadow-md p-4 max-h-[80rem] h-[100%]">
                        <TextInput
                            type="text"
                            className="mt-2 ring-1 ring-red-600"
                            // value={search.workbook_search[0].WORKBOOK_NAME}

                            // onChange={(e) => inputDataSearch("WORKBOOK_NAME", e.target.value, 0)}

                            // onKeyDown={
                            //     (e) => {
                            //         if (e.key === "Enter") {
                            //             if (
                            //                 search.workbook_search[0].WORKBOOK_NAME === ""
                            //             ) {
                            //                 setIsSuccess("Get All Workbooks");
                            //             } else {
                            //                 setIsSuccess("Search");
                            //             }
                            //             setTimeout(() => {
                            //                 setIsSuccess("");
                            //             }, 5000);
                            //         }
                            //     }
                            // }

                            placeholder="Search Claim"
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer"
                                // onClick={() => {
                                //     if (
                                //         search.workbook_search[0]
                                //             .WORKBOOK_ID === "" &&
                                //         search.workbook_search[0]
                                //             .WORKBOOK_NAME === ""
                                //     ) {
                                //         inputDataSearch("flag", "", 0);
                                //     } else {
                                //         inputDataSearch("flag", "", 0);
                                //     }
                                //     setIsSuccess("Search");
                                //     setTimeout(() => {
                                //         setIsSuccess("");
                                //     }, 5000);
                                // }
                                // }
                            >
                                Search
                            </div>
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer"

                                // onClick={
                                //     () => {
                                //         inputDataSearch("WORKBOOK_NAME", "", 0);
                                //         setIsSuccess("Clear Search");
                                //         setTimeout(() => {
                                //             setIsSuccess("");
                                //         }, 5000);
                                //     }
                                // }
                            >
                                Clear Search
                            </div>
                        </div>
                    </div>
                </div>
                {/* AGGrid */}
                <div className="col-span-3 bg-white shadow-md rounded-md p-5 xs:mt-4 lg:mt-0">
                    <div className="ag-grid-layouts rounded-md shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-2.5">
                        <AGGrid
                            addButtonLabel={null}
                            addButtonModalState={undefined}
                            withParam={""}
                            searchParam={search.claim_search}
                            // loading={}
                            url={"getClaim"}
                            doubleClickEvent={handleDetail}
                            triggeringRefreshData={isSuccess}
                            colDefs={[
                                {
                                    headerName: "No.",
                                    valueGetter: "node.rowIndex + 1",
                                    flex: 1.5,
                                    sortable: false,
                                    filter: false,
                                },
                                {
                                    headerName: "Claim Code",
                                    field: "CLAIM_ID",
                                },
                                {
                                    headerName: "Claim Name",
                                    flex: 7,
                                    valueGetter: (params: any) => {
                                        return (
                                            params.data?.relation
                                                ?.RELATION_ORGANIZATION_NAME ||
                                            "-"
                                        );
                                    },
                                },
                            ]}
                        />
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
