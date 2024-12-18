import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import InputLabel from "@/Components/InputLabel";
import TableTH from "@/Components/Table/TableTH";
import axios from "axios";
import { useState, FormEvent, useEffect } from "react";
import TableTD from "@/Components/Table/TableTD";
import TextInput from "@/Components/TextInput";
import Button from "@/Components/Button/Button";
import { Textarea } from "flowbite-react";
import Dropdown from "@/Components/Dropdown";
import ModalToAction from "@/Components/Modal/ModalToAction";
import TH from "@/Components/TH";
import TD from "@/Components/TD";
import ToastMessage from "@/Components/ToastMessage";
import Pagination from "@/Components/Pagination";
import { ArrowDownTrayIcon, ArrowPathIcon } from "@heroicons/react/20/solid";
import dateFormat from "dateformat";
import Input from "@/Components/Input";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-tailwindcss-select";
import CurrencyInput from "react-currency-input-field";
import Swal from "sweetalert2";
import BadgeFlat from "@/Components/BadgeFlat";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import InputSearch from "@/Components/InputSearch";
import ModalToDocument from "@/Components/Modal/ModalToDocument";
import Content from "@/Components/Content";
import AGGrid from "@/Components/AgGrid";

export default function Reimburse({ auth }: PageProps) {
    useEffect(() => {
        getReimburseRequestStatus();
        getReimburseApprove1Status();
        getReimburseApprove2Status();
        getReimburseApprove3Status();
        getReimburseNeedRevisionStatus();
        getReimburseRejectStatus();
        getReimburseApproval();
        getReimburseNotes();
        getReimburseMethod();
    }, []);

    const handleRefresh = () => {
        getReimburseRequestStatus();
        getReimburseApprove1Status();
        getReimburseApprove2Status();
        getReimburseApprove3Status();
        getReimburseNeedRevisionStatus();
        getReimburseRejectStatus();
        getReimburseApproval();
        getReimburseNotes();
        getReimburseMethod();

        setRefreshSuccess("success");
        setTimeout(() => {
            setRefreshSuccess("");
        }, 1000);
    };

    // Modal Add Start
    const [modal, setModal] = useState<any>({
        add: false,
        delete: false,
        edit: false,
        view: false,
        document: false,
        search: false,
        search_ca_report: false,
        approve: false,
        report: false,
        execute: false,
    });
    // Modal Add End

    // Modal Add Files Start
    const [modalFiles, setModalFiles] = useState<any>({
        add_files: false,
        add_files_execute: false,
        show_files: false,
        show_files_revised: false,
        show_files_proof_of_document: false,
        index: "",
        index_show: "",
        index_show_revised: "",
    });
    // Modal Add Files End

    const handleOnCloseModalFiles = () => {
        setModalFiles({
            add_files: false,
            add_files_execute: false,
            show_files: false,
            show_files_revised: false,
            show_files_proof_of_document: false,
            index: "",
            index_show: "",
            index_show_revised: "",
        });
    };

    const { data, setData, errors, reset } = useForm<any>({
        reimburse_id: "",
        reimburse_used_by: "",
        reimburse_requested_by: "",
        reimburse_division: "",
        reimburse_cost_center: "",
        reimburse_branch: "",
        reimburse_first_approval_by: "",
        reimburse_request_note: "",
        reimburse_method: "",
        reimburse_settlement_date: "",
        reimburse_total_amount: "",
        proof_of_document: [],
        ReimburseDetail: [
            {
                reimburse_detail_date: "",
                reimburse_detail_purpose: "",
                reimburse_detail_location: "",
                reimburse_detail_address: "",
                reimburse_detail_type: "",
                reimburse_detail_relation_name: "",
                reimburse_detail_relation_position: "",
                reimburse_detail_relation_organization_id: "",
                reimburse_detail_amount: "",
                reimburse_detail_note: "",
                reimburse_detail_document: [],
            },
        ],
    });

    // Handle Success Start
    const [isSuccess, setIsSuccess] = useState<string>("");
    // console.log(">>>>>>>>", data);
    const handleSuccess = (message: string) => {
        setIsSuccess("");

        reset();
        setData({
            reimburse_id: "",
            reimburse_used_by: "",
            reimburse_requested_by: "",
            reimburse_division: "",
            reimburse_cost_center: "",
            reimburse_branch: "",
            reimburse_first_approval_by: "",
            reimburse_request_note: "",
            reimburse_method: "",
            reimburse_settlement_date: "",
            reimburse_total_amount: "",
            proof_of_document: [],
            ReimburseDetail: [
                {
                    reimburse_detail_date: "",
                    reimburse_detail_purpose: "",
                    reimburse_detail_location: "",
                    reimburse_detail_address: "",
                    reimburse_detail_type: "",
                    reimburse_detail_relation_name: "",
                    reimburse_detail_relation_position: "",
                    reimburse_detail_relation_organization_id: "",
                    reimburse_detail_amount: "",
                    reimburse_detail_note: "",
                    reimburse_detail_document: [],
                },
            ],
        });

        setIsSuccess(message[0]);

        getReimburseRequestStatus();
        getReimburseApprove1Status();
        getReimburseApprove2Status();
        getReimburseApprove3Status();
        getReimburseNeedRevisionStatus();
        getReimburseRejectStatus();
        getReimburseApproval();
        getReimburseNotes();
        getReimburseMethod();
        setTimeout(() => {
            setIsSuccess("");
        }, 5000);

        setRefreshSuccess("success");
        setTimeout(() => {
            setRefreshSuccess("");
        }, 1000);
    };
    // Handle Success End

    const [dataById, setDataById] = useState<any>({
        // REIMBURSE_REQUEST_NOTE: "",
        reimburse_detail: [
            {
                REIMBURSE_DETAIL_ID: "",
                REIMBURSE_DETAIL_DATE: "",
                REIMBURSE_DETAIL_PURPOSE: "",
                REIMBURSE_DETAIL_LOCATION: "",
                REIMBURSE_DETAIL_ADDRESS: "",
                REIMBURSE_DETAIL_TYPE: "",
                REIMBURSE_DETAIL_RELATION_ORGANIZATION_ID: "",
                REIMBURSE_DETAIL_RELATION_NAME: "",
                REIMBURSE_DETAIL_RELATION_POSITION: "",
                REIMBURSE_DETAIL_AMOUNT: "",
                REIMBURSE_DETAIL_APPROVAL: "",
                REIMBURSE_DETAIL_COST_CLASSIFICATION: "",
                REIMBURSE_DETAIL_AMOUNT_APPROVE: "",
                REIMBURSE_DETAIL_REMARKS: "",
            },
        ],
    });

    // Handle Add Row Start
    // const [DataRow, setDataRow] = useState<any>([
    //     {
    //         reimburse_detail_date: "",
    //         reimburse_detail_purpose: "",
    //         reimburse_detail_location: "",
    //         reimburse_detail_address: "",
    //         reimburse_detail_type: "",
    //         reimburse_detail_relation_name: "",
    //         reimburse_detail_relation_position: "",
    //         reimburse_detail_relation_organization_id: "",
    //         reimburse_detail_amount: "",
    //         reimburse_detail_note: "",
    //         reimburse_detail_document: [],
    //     },
    // ]);

    const handleAddRow = (e: FormEvent) => {
        e.preventDefault();

        // setDataRow([
        //     ...DataRow,
        //     {
        //         reimburse_detail_date: "",
        //         reimburse_detail_purpose: "",
        //         reimburse_detail_location: "",
        //         reimburse_detail_address: "",
        //         reimburse_detail_type: "",
        //         reimburse_detail_relation_name: "",
        //         reimburse_detail_relation_position: "",
        //         reimburse_detail_relation_organization_id: "",
        //         reimburse_detail_amount: "",
        //         reimburse_detail_note: "",
        //         reimburse_detail_document: [],
        //     },
        // ]);

        setData("ReimburseDetail", [
            ...data.ReimburseDetail,
            {
                reimburse_detail_date: "",
                reimburse_detail_purpose: "",
                reimburse_detail_location: "",
                reimburse_detail_address: "",
                reimburse_detail_type: "",
                reimburse_detail_relation_name: "",
                reimburse_detail_relation_position: "",
                reimburse_detail_relation_organization_id: "",
                reimburse_detail_amount: "",
                reimburse_detail_note: "",
                reimburse_detail_document: [],
            },
        ]);
    };
    // Handle Add Row End

    // Handle Remove Row Start
    const handleRemoveRow = (i: number) => {
        const deleteRow = [...data.ReimburseDetail];

        deleteRow.splice(i, 1);

        // setDataRow(deleteRow);

        setData("ReimburseDetail", deleteRow);
    };
    // Handle Remove Row End

    // Handle Change Add Start
    const handleChangeAdd = (e: any, i: number) => {
        const { name, value } = e.target;

        const onchangeVal: any = [...data.ReimburseDetail];

        onchangeVal[i][name] = value;

        // setDataRow(onchangeVal);

        setData("ReimburseDetail", onchangeVal);
    };
    // Handle Change Add End

    // Handle Change Add Date Start
    const handleChangeAddDate = (date: any, name: any, i: number) => {
        const onchangeVal: any = [...data.ReimburseDetail];

        onchangeVal[i][name] = date.toLocaleDateString("en-CA");

        // setDataRow(onchangeVal);

        setData("ReimburseDetail", onchangeVal);
    };
    // Handle Change Add Date End

    // Handle Change Add Custom Start
    const handleChangeAddCustom = (value: any, name: any, i: number) => {
        const onchangeVal: any = [...data.ReimburseDetail];

        onchangeVal[i][name] = value;

        // setDataRow(onchangeVal);

        setData("ReimburseDetail", onchangeVal);
    };
    // Handle Change Add Custom End

    // Handle Add Row Files Start
    const handleAddRowFiles = (e: FormEvent) => {
        e.preventDefault();

        const ReimburseDetail: any = [...data.ReimburseDetail];

        ReimburseDetail[modalFiles.index].reimburse_detail_document = [
            ...(ReimburseDetail[modalFiles.index].reimburse_detail_document ||
                []),
            {
                reimburse_detail_document: "",
            },
        ];

        setData({
            ...data,
            ReimburseDetail: ReimburseDetail,
        });
    };
    // Handle Add Row Files End

    // Handle Add Row Files Start
    const handleChangeAddFiles = (e: any, i: number) => {
        const { name, files } = e.target;

        const onchangeFileData: any = [...data.ReimburseDetail];

        onchangeFileData[modalFiles.index][name][i] = files[0];

        setData("ReimburseDetail", onchangeFileData);
    };
    // Handle Add Row Files End

    // Handle Remove Files Row Start
    const handleRemoveFilesRow = (e: any, i: number) => {
        e.preventDefault();

        const deleteFilesData: any = [...data.ReimburseDetail];

        deleteFilesData[modalFiles.index].reimburse_detail_document.splice(
            i,
            1
        );

        setData({ ...data, ReimburseDetail: deleteFilesData });
    };
    // Handle Remove Files Row End

    // Handle Change Approve Start
    const handleChangeApprove = (e: any, i: number) => {
        const { name, value } = e.target;

        const onchangeVal: any = [...dataById.reimburse_detail];

        onchangeVal[i][name] = value;

        setDataById({ ...dataById, reimburse_detail: onchangeVal });
    };
    // Handle Change Approve End

    // Handle Change Approve Custom Report Start
    const handleChangeApproveReportCustom = (
        value: any,
        name: any,
        i: number
    ) => {
        const onchangeVal: any = [...dataById.reimburse_detail];

        onchangeVal[i][name] = value;

        setDataById({
            ...dataById,
            reimburse_detail: onchangeVal,
        });
    };
    // Handle Change Approve Custom Report End

    // Handle Change Approval Report Start
    const handleChangeApprovalReport = (e: any, i: number) => {
        const { name, value } = e.target;

        const onchangeVal = [...dataById.reimburse_detail];

        onchangeVal[i][name] = value;

        const ReimburseDetailAmountApprove = [...onchangeVal];

        ReimburseDetailAmountApprove[i]["REIMBURSE_DETAIL_AMOUNT_APPROVE"] =
            onchangeVal[i]["REIMBURSE_DETAIL_AMOUNT"];

        if (parseInt(value, 10) === 1) {
            setDataById({
                ...dataById,
                reimburse_detail: ReimburseDetailAmountApprove,
            });
        } else {
            onchangeVal[i]["REIMBURSE_DETAIL_AMOUNT_APPROVE"] = 0;
            setDataById({
                ...dataById,
                reimburse_detail: onchangeVal,
            });
        }

        setDataById({
            ...dataById,
            reimburse_detail: onchangeVal,
        });
    };
    // Handle Change Approval Report End

    // Handle Add Row Revised Start
    const handleAddRowRevised = (e: any) => {
        setDataById({
            ...dataById,
            reimburse_detail: [
                ...dataById.reimburse_detail,
                {
                    REIMBURSE_DETAIL_AMOUNT: "",
                    REIMBURSE_DETAIL_AMOUNT_APPROVE: "",
                    REIMBURSE_DETAIL_APPROVAL: "",
                    REIMBURSE_DETAIL_COST_CLASSIFICATION: "",
                    REIMBURSE_DETAIL_DATE: "",
                    REIMBURSE_DETAIL_ID: "",
                    REIMBURSE_DETAIL_LOCATION: "",
                    REIMBURSE_DETAIL_PURPOSE: "",
                    REIMBURSE_DETAIL_RELATION_NAME: "",
                    REIMBURSE_DETAIL_RELATION_ORGANIZATION_ID: "",
                    REIMBURSE_DETAIL_RELATION_POSITION: "",
                    REIMBURSE_DETAIL_REMARKS: "",
                    REIMBURSE_ID: "",
                },
            ],
        });
    };
    // Handle Add Row Revised End

    // Handle Change Revised Start
    const handleChangeRevised = (e: any, i: number) => {
        const { name, value } = e.target;

        const onchangeVal: any = [...dataById.reimburse_detail];

        onchangeVal[i][name] = value;

        setDataById({ ...dataById, reimburse_detail: onchangeVal });
    };
    // Handle Change Revised End

    // Handle Change Revised Custom Start
    const handleChangeRevisedCustom = (value: any, name: any, i: number) => {
        const onchangeVal: any = [...dataById.reimburse_detail];

        onchangeVal[i][name] = value;

        setDataById({ ...dataById, reimburse_detail: onchangeVal });
    };
    // Handle Change Revised Custom End

    // Handle Change Revised Date Start
    const handleChangeRevisedDate = (value: any, name: any, i: number) => {
        const onchangeVal: any = [...dataById.reimburse_detail];

        onchangeVal[i][name] = value.toLocaleDateString("en-CA");

        setDataById({ ...dataById, reimburse_detail: onchangeVal });
    };
    // Handle Change Revised Date End

    // Handle Remove Row Revised Start
    const handleRemoveRowRevised = (i: number, reimburse_detail_id: number) => {
        const deleteRow = [...dataById.reimburse_detail];

        deleteRow.splice(i, 1);

        setDataById({
            ...dataById,
            reimburse_detail: deleteRow,
            deletedRow: [
                ...(dataById.deletedRow || []),
                {
                    REIMBURSE_DETAIL_ID: reimburse_detail_id,
                },
            ],
        });
    };
    // Handle Remove Row Revised End

    // Handle Add Row Revised Files Start
    const handleAddRowRevisedFiles = (reimburse_detail_id: number) => {
        const addFiles = [...dataById.reimburse_detail];

        addFiles[modalFiles.index_show_revised].filesDocument = [
            ...(addFiles[modalFiles.index_show_revised].filesDocument || []),
            {
                REIMBURSE_DETAIL_DOCUMENT: "",
                REIMBURSE_DETAIL_ID: reimburse_detail_id,
            },
        ];

        setDataById({
            ...dataById,
            reimburse_detail: addFiles,
        });
    };
    // Handle Add Row Revised Files End

    // Handle Change Revised Files Start
    const handleChangeRevisedFiles = (e: any, i: number) => {
        const { name, files } = e.target;

        const onchangeFileData: any = [...dataById.reimburse_detail];

        onchangeFileData[modalFiles.index_show_revised].filesDocument[i][name] =
            files[0];

        setDataById({ ...dataById, reimburse_detail: onchangeFileData });
    };
    // Handle Change Revised Files End

    // Handle Remove Row Revised Files Start
    const handleRemoveRowRevisedFiles = (e: any, i: number) => {
        const deleteRow = [...dataById.reimburse_detail];

        deleteRow[modalFiles.index_show_revised].filesDocument.splice(i, 1);

        setDataById({ ...dataById, reimburse_detail: deleteRow });
    };
    // Handle Remove Row Revised Files End

    // Handle Remove Row Revised Show Files Start
    const handleRemoveRowRevisedShowFiles = (
        i: number,
        document_id: number,
        reimburse_detail_id: number
    ) => {
        const deleteRow = [...dataById.reimburse_detail];

        deleteRow[modalFiles.index_show_revised].m_reimburse_document.splice(
            i,
            1
        );

        setDataById({
            ...dataById,
            reimburse_detail: deleteRow,
            deletedDocument: [
                ...(dataById.deletedDocument || []),
                {
                    DOCUMENT_ID: document_id,
                    REIMBURSE_DETAIL_ID: reimburse_detail_id,
                },
            ],
        });
    };
    // Handle Remove Row Revised Show Files End

    // Handle Add Row Proof of Document Start
    const handleAddRowProofOfDocument = (e: any) => {
        e.preventDefault();

        setData({
            ...data,
            proof_of_document: [
                ...data.proof_of_document,
                {
                    proof_of_document: "",
                },
            ],
        });
    };
    // Handle Add Row Proof of Document End

    // Handle Change Row Proof of Document Start
    const handleChangeProofOfDocument = (e: any, i: number) => {
        const { name, files } = e.target;

        const onchangeFileData: any = [...data.proof_of_document];

        onchangeFileData[i][name] = files[0];

        setData({
            ...data,
            proof_of_document: onchangeFileData,
        });
    };
    // Handle Change Row Proof of Document End

    // Handle Remove Row Proof of Document Row Start
    const handleRemoveProofOfDocument = (e: any, i: number) => {
        e.preventDefault();

        const deleteFilesData: any = [...data.proof_of_document];

        deleteFilesData.splice(i, 1);

        setData({
            ...data,
            proof_of_document: deleteFilesData,
        });
    };
    // Handle Remove Row Proof of Document Row End

    // For refresh AG Grid data
    const [refreshSuccess, setRefreshSuccess] = useState<string>("");

    // Search Start
    const [searchReimburse, setSearchReimburse] = useState<any>({
        reimburse_search: [
            {
                REIMBURSE_ID: "",
                REIMBURSE_NUMBER: "",
                REIMBURSE_REQUESTED_BY: "",
                REIMBURSE_DIVISION: "",
                REIMBURSE_USED_BY: "",
                REIMBURSE_START_DATE: "",
                REIMBURSE_END_DATE: "",
                REIMBURSE_COST_CENTER: "",
                REIMBURSE_APPROVAL_STATUS: "",
                flag: "flag",
            },
        ],
    });

    // console.log("Search", searchReimburse);
    // Search End

    // OnChange Input Search Start
    const inputDataSearch = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...searchReimburse.reimburse_search];
        changeVal[i][name] = value;
        setSearchReimburse({
            ...searchReimburse,
            reimburse_search: changeVal,
        });
    };
    // OnChange Input Search End

    // Clear Search Start
    const clearSearchReimburse = () => {
        inputDataSearch("REIMBURSE_ID", "", 0);
        inputDataSearch("REIMBURSE_NUMBER", "", 0);
        inputDataSearch("REIMBURSE_REQUESTED_BY", "", 0);
        inputDataSearch("REIMBURSE_DIVISION", "", 0);
        inputDataSearch("REIMBURSE_USED_BY", "", 0);
        inputDataSearch("REIMBURSE_START_DATE", "", 0);
        inputDataSearch("REIMBURSE_END_DATE", "", 0);
        inputDataSearch("REIMBURSE_COST_CENTER", "", 0);
        inputDataSearch("REIMBURSE_APPROVAL_STATUS", "", 0);
        inputDataSearch("flag", "flag", 0);

        setRefreshSuccess("success");
        setTimeout(() => {
            setRefreshSuccess("");
        }, 1000);
    };
    // Clear Search End

    // Data Start
    const { purposes, relations, coa, employees, office, division }: any =
        usePage().props;
    // Data End

    const [ReimburseApproval, setReimburseApproval] = useState<any>([]);
    const getReimburseApproval = async () => {
        await axios
            .get(`/getReimburseApproval`)
            .then((res) => {
                setReimburseApproval(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [ReimburseNotes, setReimburseNotes] = useState<any>([]);
    const getReimburseNotes = async () => {
        await axios
            .get(`/getReimburseNotes`)
            .then((res) => {
                setReimburseNotes(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [ReimburseMethod, setReimburseMethod] = useState<any>([]);
    const getReimburseMethod = async () => {
        await axios
            .get(`/getReimburseMethod`)
            .then((res) => {
                setReimburseMethod(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // Handle Add Start
    const handleAddModal = async (e: FormEvent) => {
        e.preventDefault();

        setData({
            ...data,
            reimburse_division:
                auth.user.employee?.division?.COMPANY_DIVISION_ID,
            reimburse_requested_by: auth.user.employee?.EMPLOYEE_ID,
        });

        setModal({
            add: true,
            delete: false,
            edit: false,
            view: false,
            document: false,
            search: false,
            search_ca_report: false,
            approve: false,
            report: false,
            execute: false,
        });
    };
    // Handle Add End

    // Handle Approve Start
    const handleApproveModal = async (e: FormEvent, id: number) => {
        e.preventDefault();

        await axios
            .get(`/getReimburseById/${id}`)
            .then((res) => {
                setDataById(res.data);
                // console.log(res.data);
            })
            .catch((err) => console.log(err));

        setModal({
            add: false,
            delete: false,
            edit: false,
            view: false,
            document: false,
            search: false,
            search_ca_report: false,
            approve: !modal.approve,
            report: false,
            execute: false,
        });
    };
    // Handle Approve End

    // Handle Revised Start
    const handleRevisedModal = async (e: FormEvent, id: number) => {
        e.preventDefault();

        await axios
            .get(`/getReimburseById/${id}`)
            .then((res) => {
                setDataById(res.data);
                // console.log(res.data);
            })
            .catch((err) => console.log(err));

        setModal({
            add: false,
            delete: false,
            edit: !modal.edit,
            view: false,
            document: false,
            search: false,
            search_ca_report: false,
            approve: false,
            report: false,
            execute: false,
        });
    };
    // Handle Revised End

    // Handle Execute Start
    const handleExecuteModal = async (e: FormEvent, id: any) => {
        e.preventDefault();

        await axios
            .get(`/getReimburseById/${id}`)
            .then((res) => {
                setDataById(res.data);
                // console.log(res.data);
            })
            .catch((err) => console.log(err));

        setData("reimburse_id", id);

        setModal({
            add: false,
            delete: false,
            edit: false,
            view: false,
            document: false,
            search: false,
            search_ca_report: false,
            approve: false,
            report: false,
            execute: !modal.execute,
        });
    };
    // Handle Execute End

    // Handle Show Start
    const handleShowModal = async (data: any) => {
        await axios
            .get(`/getReimburseById/${data.REIMBURSE_ID}`)
            .then((res) => {
                setDataById(res.data);
                // console.log(res.data);
            })
            .catch((err) => console.log(err));

        setModal({
            add: false,
            delete: false,
            edit: false,
            view: !modal.view,
            document: false,
            search: false,
            search_ca_report: false,
            approve: false,
            report: false,
            execute: false,
        });
    };
    // Handle Show End

    const handleBtnStatus = async (status: number) => {
        setDataById({
            ...dataById,
            REIMBURSE_FIRST_APPROVAL_STATUS: status,
        });

        if (auth.user.employee?.division?.COMPANY_DIVISION_ID === 132) {
            setDataById({
                ...dataById,
                REIMBURSE_SECOND_APPROVAL_BY: auth.user.employee?.EMPLOYEE_ID,
                REIMBURSE_SECOND_APPROVAL_USER:
                    auth.user.employee?.EMPLOYEE_FIRST_NAME,
                REIMBURSE_SECOND_APPROVAL_STATUS: status,
            });
        }

        if (auth.user.employee?.division?.COMPANY_DIVISION_ID === 122) {
            setDataById({
                ...dataById,
                REIMBURSE_THIRD_APPROVAL_BY: auth.user.employee?.EMPLOYEE_ID,
                REIMBURSE_THIRD_APPROVAL_USER:
                    auth.user.employee?.EMPLOYEE_FIRST_NAME,
                REIMBURSE_THIRD_APPROVAL_STATUS: status,
            });
        }
    };

    const handleFileDownload = async (
        reimburse_detail_id: number,
        document_id: number
    ) => {
        await axios({
            url: `/reimburseDownload/${reimburse_detail_id}/${document_id}`,
            method: "GET",
            responseType: "blob",
        })
            .then((response) => {
                // console.log(response);
                const url = window.URL.createObjectURL(
                    new Blob([response.data])
                );
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", response.headers.filename);
                document.body.appendChild(link);
                link.click();
            })
            .catch((err) => {
                console.log(err);
                if (err.response.status === 404) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "File not found!",
                        timer: 1500,
                        timerProgressBar: true,
                    });
                }
            });
    };

    const handleFileProofOfDocumentDownload = async (
        reimburse_id: number,
        document_id: number
    ) => {
        await axios({
            url: `/reimburseProofOfDocumentDownload/${reimburse_id}/${document_id}`,
            method: "GET",
            responseType: "blob",
        })
            .then((response) => {
                // console.log(response);
                const url = window.URL.createObjectURL(
                    new Blob([response.data])
                );
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", response.headers.filename);
                document.body.appendChild(link);
                link.click();
            })
            .catch((err) => {
                console.log(err);
                if (err.response.status === 404) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "File not found!",
                        timer: 1500,
                        timerProgressBar: true,
                    });
                }
            });
    };

    const [getCountReimburseRequestStatus, setCountReimburseRequestStatus] =
        useState<any>([]);
    const getReimburseRequestStatus = async () => {
        await axios
            .get(`/getCountReimburseRequestStatus`)
            .then((res) => {
                setCountReimburseRequestStatus(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [getCountReimburseApprove1Status, setCountReimburseApprove1Status] =
        useState<any>([]);
    const getReimburseApprove1Status = async () => {
        await axios
            .get(`/getCountReimburseApprove1Status`)
            .then((res) => {
                setCountReimburseApprove1Status(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [getCountReimburseApprove2Status, setCountReimburseApprove2Status] =
        useState<any>([]);
    const getReimburseApprove2Status = async () => {
        await axios
            .get(`/getCountReimburseApprove2Status`)
            .then((res) => {
                setCountReimburseApprove2Status(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [getCountReimburseApprove3Status, setCountReimburseApprove3Status] =
        useState<any>([]);
    const getReimburseApprove3Status = async () => {
        await axios
            .get(`/getCountReimburseApprove3Status`)
            .then((res) => {
                setCountReimburseApprove3Status(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [
        getCountReimburseNeedRevisionStatus,
        setCountReimburseNeedRevisionStatus,
    ] = useState<any>([]);
    const getReimburseNeedRevisionStatus = async () => {
        await axios
            .get(`/getCountReimburseNeedRevisionStatus`)
            .then((res) => {
                setCountReimburseNeedRevisionStatus(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [getCountReimburseRejectStatus, setCountReimburseRejectStatus] =
        useState<any>([]);
    const getReimburseRejectStatus = async () => {
        await axios
            .get(`/getCountReimburseRejectStatus`)
            .then((res) => {
                setCountReimburseRejectStatus(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // Function Format Currency
    const formatCurrency = new Intl.NumberFormat("default", {
        style: "currency",
        currency: "IDR",
    });
    // End Function Format Currency

    const [totalAmount, setTotalAmount] = useState(0);
    useEffect(() => {
        let newTotalAmount = 0;

        data.ReimburseDetail.forEach((item: any) => {
            const amount = Number(item.reimburse_detail_amount);

            if (!isNaN(amount)) {
                newTotalAmount += amount;
            }
        });

        if (newTotalAmount !== 0) {
            setTotalAmount(newTotalAmount);
        } else {
            setTotalAmount(0);
        }
    }, [data]);

    useEffect(() => {
        if (totalAmount !== 0) {
            setData("reimburse_total_amount", totalAmount);
        }
    }, [totalAmount]);

    // Start get data reimburse revised total amount
    const [revisedTotalAmount, setRevisedTotalAmount] = useState(0);
    useEffect(() => {
        let newRevisedTotalAmount = 0;

        dataById.reimburse_detail.forEach((item: any) => {
            const revisedAmount = Number(item.REIMBURSE_DETAIL_AMOUNT);

            if (!isNaN(revisedAmount)) {
                newRevisedTotalAmount += revisedAmount;
            }
        });

        if (newRevisedTotalAmount !== 0) {
            setRevisedTotalAmount(newRevisedTotalAmount);
        } else {
            setRevisedTotalAmount(0);
        }
    }, [dataById]);

    useEffect(() => {
        if (revisedTotalAmount !== 0) {
            setDataById({
                ...dataById,
                REIMBURSE_TOTAL_AMOUNT: revisedTotalAmount,
            });
        }
    }, [revisedTotalAmount]);
    // End get data reimburse revised total amount

    // Start get data reimburse approve total amount
    const [approveTotalAmount, setApproveTotalAmount] = useState(0);
    // console.log("Approve Total Amount", approveTotalAmount);
    useEffect(() => {
        let newApproveTotalAmount = 0;

        dataById?.reimburse_detail.forEach((item: any) => {
            const approveAmount = Number(item.REIMBURSE_DETAIL_AMOUNT_APPROVE);

            if (!isNaN(approveAmount)) {
                newApproveTotalAmount += approveAmount;
            }
        });

        if (newApproveTotalAmount !== 0) {
            setApproveTotalAmount(newApproveTotalAmount);
        } else {
            setApproveTotalAmount(0);
        }
    }, [dataById]);

    useEffect(() => {
        if (approveTotalAmount !== 0) {
            setDataById({
                ...dataById,
                REIMBURSE_TOTAL_AMOUNT_APPROVE: approveTotalAmount,
            });
        }
    }, [approveTotalAmount]);
    // End get data reimburse approve total amount

    useEffect(() => {
        const difference =
            dataById.REIMBURSE_TOTAL_AMOUNT_APPROVE -
            dataById.REIMBURSE_TOTAL_AMOUNT;

        if (difference < 0) {
            setDataById({ ...dataById, REIMBURSE_TYPE: 1 });
        } else {
            setDataById({ ...dataById, REIMBURSE_TYPE: 2 });
        }
    }, [
        dataById.REIMBURSE_TOTAL_AMOUNT_APPROVE,
        dataById.REIMBURSE_TOTAL_AMOUNT,
    ]);

    const selectDivision = division
        ?.filter((m: any) => m.COMPANY_ID === auth.user.employee?.COMPANY_ID)
        .map((query: any) => {
            return {
                value: query.COMPANY_DIVISION_ID,
                label: query.COMPANY_DIVISION_ALIAS,
            };
        });

    const selectEmployee = employees
        ?.filter(
            (m: any) =>
                m.DIVISION_ID === data.reimburse_cost_center.value &&
                m.STRUCTURE_ID === 136 &&
                m.EMPLOYEE_IS_DELETED === 0
        )
        .map((query: any) => {
            return {
                value: query.EMPLOYEE_ID,
                label: query.EMPLOYEE_FIRST_NAME,
            };
        });

    const selectBranch = office
        ?.filter((m: any) => m.COMPANY_ID === auth.user.employee?.COMPANY_ID)
        .map((query: any) => {
            return {
                value: query.COMPANY_OFFICE_ID,
                label: query.COMPANY_OFFICE_ALIAS,
            };
        });

    const selectApproval = employees
        ?.filter((m: any) =>
            data.reimburse_cost_center?.value === 138
                ? m.DIVISION_ID === 123
                : m.DIVISION_ID === data.reimburse_cost_center?.value &&
                  (m.STRUCTURE_ID === 107 || m.STRUCTURE_ID === 108) &&
                  m.EMPLOYEE_IS_DELETED === 0
        )
        .map((query: any) => {
            return {
                value: query.EMPLOYEE_ID,
                label: query.EMPLOYEE_FIRST_NAME,
            };
        });

    const selectRelation = relations?.map((query: any) => {
        return {
            value: query.RELATION_ORGANIZATION_ID,
            label: query.RELATION_ORGANIZATION_NAME,
        };
    });

    const getRelationSelect = (value: any) => {
        if (value) {
            const selected = selectRelation.filter(
                (option: any) => option.value === value
            );
            return selected[0].label;
        }
    };

    const selectCoa = coa?.map((query: any) => {
        return {
            value: query.COA_ID,
            label: query.COA_CODE + " - " + query.COA_TITLE,
        };
    });

    const getCoaSelect = (value: any) => {
        if (value) {
            const selected = selectCoa.filter(
                (option: any) => option.value === value
            );
            return selected[0].label;
        }
    };

    const handleSelectChange = (e: any, id: number) => {
        const selectedValue = e.target.value;

        if (selectedValue === "approve") {
            handleApproveModal(e, id);
        } else if (selectedValue === "revised") {
            handleRevisedModal(e, id);
        } else if (selectedValue === "execute") {
            handleExecuteModal(e, id);
        }
    };

    // console.log("Data Reimburse", data);
    // console.log(DataRow);
    // console.log("Reimburse", reimburse.data);
    // console.log("Data By Id", dataById);
    // console.log("Auth", auth.user);
    // console.log(searchReimburse);

    return (
        <AuthenticatedLayout user={auth.user} header={"Reimburse"}>
            <Head title="Reimburse" />

            {isSuccess && (
                <ToastMessage
                    message={isSuccess}
                    isShow={true}
                    type={"success"}
                />
            )}

            {/* Modal Add Start */}
            <ModalToAdd
                classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 min-w-full`}
                show={modal.add}
                onClose={() =>
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                        search_ca_report: false,
                        approve: false,
                        report: false,
                        execute: false,
                    })
                }
                title={"Add Reimburse"}
                url={`/reimburse`}
                data={data}
                onSuccess={handleSuccess}
                buttonAddOns={null}
                body={
                    <>
                        <ModalToDocument
                            classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 min-w-[100%] md:min-w-[70%] lg:min-w-[35%]`}
                            show={modalFiles.add_files}
                            closeable={true}
                            onClose={() => handleOnCloseModalFiles()}
                            title="Add Files"
                            url=""
                            data=""
                            method=""
                            onSuccess=""
                            headers={null}
                            submitButtonName=""
                            body={
                                <>
                                    <div className="grid grid-cols-12">
                                        {data.ReimburseDetail[
                                            modalFiles.index
                                        ]?.reimburse_detail_document.map(
                                            (val: any, i: number) => (
                                                <>
                                                    <div
                                                        key={i}
                                                        className={`w-full col-span-11 mt-3`}
                                                    >
                                                        <InputLabel
                                                            htmlFor="files"
                                                            value="File"
                                                            className="mb-2"
                                                        />
                                                        {val.name ? (
                                                            <p>{val.name}</p>
                                                        ) : (
                                                            <Input
                                                                name="reimburse_detail_document"
                                                                type="file"
                                                                className="w-full"
                                                                onChange={(e) =>
                                                                    handleChangeAddFiles(
                                                                        e,
                                                                        i
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                    </div>
                                                    <button
                                                        className="text-center self-center bg-red-600 hover:bg-red-500 text-white mx-2 mt-12 py-1 rounded-lg"
                                                        onClick={(e) =>
                                                            handleRemoveFilesRow(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                    >
                                                        X
                                                    </button>
                                                </>
                                            )
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        className="text-sm cursor-pointer hover:underline mt-5"
                                        onClick={(e) => handleAddRowFiles(e)}
                                    >
                                        + Add Row
                                    </button>
                                </>
                            }
                        />
                        <div className="grid md:grid-cols-2 my-10">
                            <div className="w-full p-2 mb-1">
                                <InputLabel
                                    htmlFor="namaPengguna"
                                    value="Applicant"
                                    className="mb-4"
                                />
                                <TextInput
                                    id="namaPengguna"
                                    type="text"
                                    name="namaPengguna"
                                    value={
                                        auth.user.employee?.EMPLOYEE_FIRST_NAME
                                    }
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2 mb-1">
                                <InputLabel
                                    htmlFor="reimburse_division"
                                    value="Division"
                                    className="mb-4"
                                />
                                <TextInput
                                    id="reimburse_division"
                                    type="text"
                                    name="reimburse_division"
                                    value={
                                        auth.user.employee?.division
                                            ?.COMPANY_DIVISION_ALIAS
                                    }
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2 mb-1">
                                <InputLabel htmlFor="namaPemohon" className="">
                                    Cost Center
                                    <span className="text-red-600">*</span>
                                </InputLabel>
                                <Select
                                    classNames={{
                                        menuButton: () =>
                                            `flex text-sm text-gray-500 mt-4 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400 ring-1 ring-gray-300`,
                                        menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                        listItem: ({ isSelected }: any) =>
                                            `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                isSelected
                                                    ? `text-white bg-red-600`
                                                    : `text-gray-500 hover:bg-red-100 hover:text-black`
                                            }`,
                                    }}
                                    options={selectDivision}
                                    isSearchable={true}
                                    placeholder={"Choose Cost Center"}
                                    value={data.reimburse_cost_center}
                                    onChange={(val: any) =>
                                        setData("reimburse_cost_center", val)
                                    }
                                    primaryColor={"bg-red-500"}
                                />
                            </div>
                            <div className="w-full p-2 mb-1">
                                <InputLabel htmlFor="namaPemohon" className="">
                                    Used By
                                    <span className="text-red-600">*</span>
                                </InputLabel>
                                <Select
                                    classNames={{
                                        menuButton: () =>
                                            `flex text-sm text-gray-500 mt-4 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400 ring-1 ring-gray-300`,
                                        menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                        listItem: ({ isSelected }: any) =>
                                            `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                isSelected
                                                    ? `text-white bg-red-600`
                                                    : `text-gray-500 hover:bg-red-100 hover:text-black`
                                            }`,
                                    }}
                                    options={selectEmployee}
                                    isSearchable={true}
                                    placeholder={"Choose Used By"}
                                    value={data.reimburse_used_by}
                                    onChange={(val: any) =>
                                        setData("reimburse_used_by", val)
                                    }
                                    primaryColor={"bg-red-500"}
                                />
                            </div>
                            <div className="w-full p-2 mb-1">
                                <InputLabel htmlFor="namaPemohon" className="">
                                    Branch
                                    <span className="text-red-600">*</span>
                                </InputLabel>
                                <Select
                                    classNames={{
                                        menuButton: () =>
                                            `flex text-sm text-gray-500 mt-4 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400 ring-1 ring-gray-300`,
                                        menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                        listItem: ({ isSelected }: any) =>
                                            `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                isSelected
                                                    ? `text-white bg-red-600`
                                                    : `text-gray-500 hover:bg-red-100 hover:text-black`
                                            }`,
                                    }}
                                    options={selectBranch}
                                    isSearchable={true}
                                    placeholder={"Choose Branch"}
                                    value={data.reimburse_branch}
                                    onChange={(val: any) =>
                                        setData("reimburse_branch", val)
                                    }
                                    primaryColor={"bg-red-500"}
                                />
                            </div>
                            <div className="w-full p-2 mb-1">
                                <InputLabel
                                    htmlFor="namaPemberiApproval"
                                    className=""
                                >
                                    Request for Approval
                                    <span className="text-red-600">*</span>
                                </InputLabel>
                                <Select
                                    classNames={{
                                        menuButton: () =>
                                            `flex text-sm text-gray-500 mt-4 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400 ring-1 ring-gray-300`,
                                        menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                        listItem: ({ isSelected }: any) =>
                                            `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                isSelected
                                                    ? `text-white bg-red-600`
                                                    : `text-gray-500 hover:bg-red-100 hover:text-black`
                                            }`,
                                    }}
                                    options={selectApproval}
                                    isSearchable={true}
                                    placeholder={"Choose Request To"}
                                    value={data.reimburse_first_approval_by}
                                    onChange={(val: any) =>
                                        setData(
                                            "reimburse_first_approval_by",
                                            val
                                        )
                                    }
                                    primaryColor={"bg-red-500"}
                                />
                            </div>
                        </div>

                        {/* Table form start */}
                        <div className="max-w-full overflow-x-auto overflow-visible">
                            <table className="w-full divide-y divide-gray-300">
                                <thead>
                                    <tr className="text-center">
                                        <TH
                                            label="No."
                                            className="border px-2"
                                            rowSpan="2"
                                        />
                                        <TH className="border" colSpan="5">
                                            Intended Activity
                                        </TH>
                                        <TH
                                            label="Relation"
                                            className="border py-2"
                                            colSpan="3"
                                        />
                                        <TH className="border" rowSpan="2">
                                            Amount{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH
                                            label="Document"
                                            className="border px-2"
                                            rowSpan="2"
                                        />
                                        {data.ReimburseDetail.length > 1 && (
                                            <TH
                                                label="Action"
                                                className="border"
                                                rowSpan="2"
                                            />
                                        )}
                                    </tr>
                                    <tr className="text-center">
                                        <TH className="border py-2">
                                            Date{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH className="border py-2">
                                            Purpose{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH className="border py-2">
                                            Location{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH className="border py-2">
                                            Address{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH className="border py-2">
                                            Type{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH
                                            label="Name"
                                            className="border py-2"
                                        />
                                        <TH label="Person" className="border" />
                                        <TH
                                            label="Position"
                                            className="border"
                                        />
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.ReimburseDetail?.map(
                                        (val: any, i: number) => (
                                            <tr className="text-center" key={i}>
                                                <TD className="border">
                                                    {i + 1}.
                                                </TD>
                                                <TD className="border">
                                                    <DatePicker
                                                        name="reimburse_detail_date"
                                                        selected={
                                                            val.reimburse_detail_date
                                                        }
                                                        onChange={(date: any) =>
                                                            handleChangeAddDate(
                                                                date,
                                                                "reimburse_detail_date",
                                                                i
                                                            )
                                                        }
                                                        dateFormat={
                                                            "dd-MM-yyyy"
                                                        }
                                                        placeholderText="dd-mm-yyyyy"
                                                        className="border-0 rounded-md shadow-md text-sm h-9 w-[100%] focus:ring-2 focus:ring-inset focus:ring-red-600"
                                                        autoComplete="off"
                                                        required
                                                    />
                                                </TD>
                                                <TD className="border">
                                                    <TextInput
                                                        id="reimburse_detail_purpose"
                                                        type="text"
                                                        name="reimburse_detail_purpose"
                                                        value={
                                                            val.reimburse_detail_purpose
                                                        }
                                                        className="w-1/2"
                                                        onChange={(e) =>
                                                            handleChangeAdd(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                        autoComplete="off"
                                                        required
                                                    />
                                                </TD>
                                                <TD className="border">
                                                    <TextInput
                                                        id="reimburse_detail_location"
                                                        type="text"
                                                        name="reimburse_detail_location"
                                                        value={
                                                            val.reimburse_detail_location
                                                        }
                                                        className="w-1/2"
                                                        onChange={(e) =>
                                                            handleChangeAdd(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                        autoComplete="off"
                                                        required
                                                    />
                                                </TD>
                                                <TD className="border">
                                                    <TextInput
                                                        id="reimburse_detail_address"
                                                        type="text"
                                                        name="reimburse_detail_address"
                                                        value={
                                                            val.reimburse_detail_address
                                                        }
                                                        className="w-1/2"
                                                        onChange={(e) =>
                                                            handleChangeAdd(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                        autoComplete="off"
                                                        required
                                                    />
                                                </TD>
                                                <TD className="border">
                                                    <select
                                                        id="reimburse_detail_type"
                                                        name="reimburse_detail_type"
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                        required
                                                        onChange={(e) =>
                                                            handleChangeAdd(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                    >
                                                        <option value="">
                                                            -- Choose Type --
                                                        </option>
                                                        {purposes.map(
                                                            (purpose: any) => (
                                                                <option
                                                                    key={
                                                                        purpose.CASH_ADVANCE_PURPOSE_ID
                                                                    }
                                                                    value={
                                                                        purpose.CASH_ADVANCE_PURPOSE_ID
                                                                    }
                                                                >
                                                                    {
                                                                        purpose.CASH_ADVANCE_PURPOSE
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </TD>
                                                <TD className="border">
                                                    <Select
                                                        classNames={{
                                                            menuButton: () =>
                                                                `flex w-full text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400 ring-1 ring-gray-300`,
                                                            menu: "absolute w-full text-left z-20 bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                            listItem: ({
                                                                isSelected,
                                                            }: any) =>
                                                                `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                                    isSelected
                                                                        ? `text-white bg-red-600`
                                                                        : `text-gray-500 hover:bg-red-100 hover:text-black`
                                                                }`,
                                                        }}
                                                        options={selectRelation}
                                                        isSearchable={true}
                                                        placeholder={
                                                            "Choose Business Relation"
                                                        }
                                                        value={
                                                            val.reimburse_detail_relation_organization_id
                                                        }
                                                        onChange={(val: any) =>
                                                            handleChangeAddCustom(
                                                                val,
                                                                "reimburse_detail_relation_organization_id",
                                                                i
                                                            )
                                                        }
                                                        primaryColor="bg-red-500"
                                                    />
                                                </TD>
                                                <TD className="border">
                                                    <TextInput
                                                        id="reimburse_detail_relation_name"
                                                        type="text"
                                                        name="reimburse_detail_relation_name"
                                                        value={
                                                            val.reimburse_detail_relation_name
                                                        }
                                                        className="w-1/2"
                                                        onChange={(e) =>
                                                            handleChangeAdd(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                        autoComplete="off"
                                                    />
                                                </TD>
                                                <TD className="border">
                                                    <TextInput
                                                        id="reimburse_detail_relation_position"
                                                        type="text"
                                                        name="reimburse_detail_relation_position"
                                                        value={
                                                            val.reimburse_detail_relation_position
                                                        }
                                                        className="w-1/2"
                                                        onChange={(e) =>
                                                            handleChangeAdd(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                        autoComplete="off"
                                                    />
                                                </TD>
                                                <TD className="border">
                                                    <CurrencyInput
                                                        id="reimburse_detail_amount"
                                                        name="reimburse_detail_amount"
                                                        value={
                                                            val.reimburse_detail_amount
                                                        }
                                                        decimalScale={2}
                                                        decimalsLimit={2}
                                                        onValueChange={(
                                                            val: any
                                                        ) =>
                                                            handleChangeAddCustom(
                                                                val,
                                                                "reimburse_detail_amount",
                                                                i
                                                            )
                                                        }
                                                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right`}
                                                        placeholder="0.00"
                                                        autoComplete="off"
                                                        required
                                                    />
                                                </TD>
                                                <TD className="border">
                                                    <button
                                                        type="button"
                                                        className="w-full bg-black hover:bg-slate-800 text-sm py-2 px-3 text-white"
                                                        onClick={() => {
                                                            setModalFiles({
                                                                add_files: true,
                                                                add_files_execute:
                                                                    false,
                                                                show_files:
                                                                    false,
                                                                show_files_revised:
                                                                    false,
                                                                show_files_proof_of_document:
                                                                    false,
                                                                index: i,
                                                                index_show: "",
                                                                index_show_revised:
                                                                    "",
                                                            });
                                                        }}
                                                    >
                                                        {val
                                                            .reimburse_detail_document
                                                            ?.length > 0
                                                            ? val
                                                                  ?.reimburse_detail_document
                                                                  .length +
                                                              " Files"
                                                            : "Add Files"}
                                                    </button>
                                                </TD>
                                                {data.ReimburseDetail.length >
                                                    1 && (
                                                    <TD className="border">
                                                        <Button
                                                            className="my-1.5 px-3 py-1"
                                                            onClick={() =>
                                                                handleRemoveRow(
                                                                    i
                                                                )
                                                            }
                                                            type="button"
                                                        >
                                                            X
                                                        </Button>
                                                    </TD>
                                                )}
                                            </tr>
                                        )
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr className="text-center text-sm">
                                        <TD></TD>
                                        <TD>
                                            <Button
                                                className="mt-5 px-2 py-1 text-black bg-none shadow-none hover:underline"
                                                onClick={(e) => handleAddRow(e)}
                                                type="button"
                                            >
                                                + Add Row
                                            </Button>
                                        </TD>
                                        <TD
                                            className="text-right pr-5 font-bold"
                                            colSpan={7}
                                        >
                                            TOTAL AMOUNT
                                        </TD>
                                        <TD className="font-bold">
                                            {formatCurrency.format(totalAmount)}
                                        </TD>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        {/* Table form end */}

                        <div className="w-full p-2 mt-10">
                            <InputLabel
                                htmlFor="reimburse_request_note"
                                value="Note"
                                className="mb-2"
                            />
                            <Textarea
                                id="reimburse_request_note"
                                name="reimburse_request_note"
                                className="resize-none border-0 focus:ring-2 focus:ring-inset focus:ring-red-600"
                                rows={5}
                                value={data.reimburse_request_note}
                                onChange={(e) =>
                                    setData(
                                        "reimburse_request_note",
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                    </>
                }
            />
            {/* Modal Add End */}

            {/* Modal Detail Start */}
            <ModalToAction
                classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 min-w-full`}
                show={modal.view}
                closeable={true}
                onClose={() =>
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                        search_ca_report: false,
                        approve: false,
                        report: false,
                        execute: false,
                    })
                }
                title="Reimburse Detail"
                url=""
                data=""
                method=""
                onSuccess=""
                headers={null}
                submitButtonName=""
                body={
                    <>
                        <ModalToDocument
                            classPanel={
                                "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 min-w-[100%] md:min-w-[70%] lg:min-w-[35%]"
                            }
                            show={modalFiles.show_files}
                            closeable={true}
                            onClose={() => handleOnCloseModalFiles()}
                            title="Show Files"
                            url=""
                            data=""
                            method=""
                            onSuccess=""
                            headers={null}
                            submitButtonName=""
                            // panelWidth=""
                            body={
                                <>
                                    <div className="grid grid-cols-12 my-3">
                                        {dataById.reimburse_detail[
                                            modalFiles.index_show
                                        ]?.m_reimburse_document.map(
                                            (file: any, i: number) => (
                                                <>
                                                    <div
                                                        className={`w-full col-span-11 mb-4`}
                                                        key={i}
                                                    >
                                                        <InputLabel
                                                            htmlFor="files"
                                                            value="File"
                                                            className="mb-2"
                                                        />
                                                        <a
                                                            href={`/reimburseDocReader/${
                                                                dataById
                                                                    .reimburse_detail[
                                                                    modalFiles
                                                                        .index_show
                                                                ]
                                                                    .REIMBURSE_DETAIL_ID
                                                            }/${
                                                                file?.document
                                                                    .DOCUMENT_ID
                                                            }`}
                                                            target="_blank"
                                                        >
                                                            {
                                                                file?.document
                                                                    .DOCUMENT_ORIGINAL_NAME
                                                            }
                                                        </a>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        title="Download File"
                                                        onClick={() =>
                                                            handleFileDownload(
                                                                dataById
                                                                    .reimburse_detail[
                                                                    modalFiles
                                                                        .index_show
                                                                ]
                                                                    .REIMBURSE_DETAIL_ID,
                                                                file?.document
                                                                    .DOCUMENT_ID
                                                            )
                                                        }
                                                    >
                                                        <ArrowDownTrayIcon className="w-5 mt-7 m-auto cursor-pointer hover:text-slate-700" />
                                                    </button>
                                                </>
                                            )
                                        )}
                                    </div>
                                </>
                            }
                        />
                        <ModalToDocument
                            classPanel={
                                "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 min-w-[100%] md:min-w-[70%] lg:min-w-[35%]"
                            }
                            show={modalFiles.show_files_proof_of_document}
                            closeable={true}
                            onClose={() =>
                                setModalFiles({
                                    add_files: false,
                                    show_files: false,
                                    add_files_report: false,
                                    show_files_report: false,
                                    show_files_proof_of_document: false,
                                    index: "",
                                    index_show: "",
                                    index_show_report: "",
                                })
                            }
                            title="Show Files Proof Of Document"
                            url=""
                            data=""
                            method=""
                            onSuccess=""
                            headers={null}
                            submitButtonName=""
                            // panelWidth=""
                            body={
                                <>
                                    <div className="grid grid-cols-12 my-3">
                                        {dataById.m_reimburse_proof_of_document?.map(
                                            (file: any, i: number) => (
                                                <>
                                                    <div
                                                        className={`w-full col-span-11 mb-4`}
                                                        key={i}
                                                    >
                                                        <InputLabel
                                                            htmlFor="files"
                                                            value="File"
                                                            className="mb-2"
                                                        />
                                                        <a
                                                            href={`/reimburseDocReader/${dataById.REIMBURSE_ID}/${file?.document.DOCUMENT_ID}`}
                                                            target="_blank"
                                                        >
                                                            {
                                                                file.document
                                                                    ?.DOCUMENT_ORIGINAL_NAME
                                                            }
                                                        </a>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        title="Download File"
                                                        onClick={() =>
                                                            handleFileProofOfDocumentDownload(
                                                                dataById.REIMBURSE_ID,
                                                                file?.document
                                                                    .DOCUMENT_ID
                                                            )
                                                        }
                                                    >
                                                        <ArrowDownTrayIcon className="w-5 mt-4 m-auto cursor-pointer hover:text-slate-700" />
                                                    </button>
                                                </>
                                            )
                                        )}
                                    </div>
                                </>
                            }
                        />
                        <div className="grid md:grid-cols-2 my-10">
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="reimburseNumber"
                                    value="Reimburse Number"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="reimburseNumber"
                                    type="text"
                                    name="reimburseNumber"
                                    value={dataById.REIMBURSE_NUMBER}
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="requestedDate"
                                    value="Request Date"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="requestedDate"
                                    type="text"
                                    name="requestedDate"
                                    value={dateFormat(
                                        dataById.REIMBURSE_REQUETED_DATE,
                                        "dd-mm-yyyy"
                                    )}
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="namaPengguna"
                                    value="Applicant"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="namaPengguna"
                                    type="text"
                                    name="namaPengguna"
                                    value={
                                        dataById.employee?.EMPLOYEE_FIRST_NAME
                                    }
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="divisi"
                                    value="Division"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="divisi"
                                    type="text"
                                    name="divisi"
                                    value={
                                        dataById.division
                                            ?.COMPANY_DIVISION_ALIAS
                                    }
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="cost_center"
                                    value="Cost Center"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="cost_center"
                                    type="text"
                                    name="cost_center"
                                    value={
                                        dataById.cost_center
                                            ?.COMPANY_DIVISION_ALIAS
                                    }
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="namaPemohon"
                                    value="Used By"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="namaPemohon"
                                    type="text"
                                    name="namaPemohon"
                                    value={
                                        dataById.employee_used_by
                                            ?.EMPLOYEE_FIRST_NAME
                                    }
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="branch"
                                    value="Branch"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="branch"
                                    type="text"
                                    name="branch"
                                    value={
                                        dataById.office?.COMPANY_OFFICE_ALIAS
                                    }
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="namaPemberiApproval"
                                    value="Request for Approval"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="namaPemberiApproval"
                                    type="text"
                                    name="namaPemberiApproval"
                                    value={
                                        dataById.employee_approval
                                            ?.EMPLOYEE_FIRST_NAME
                                    }
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                        </div>

                        {/* Table form start */}
                        <div className="max-w-full overflow-x-auto overflow-visible">
                            <table className="w-full divide-y divide-gray-300">
                                <thead className="bg-gray-100">
                                    <tr className="text-center text-gray-700">
                                        <TH
                                            label="No."
                                            className="border px-2 w-10"
                                            rowSpan="2"
                                        />
                                        <TH
                                            label="Intended Activity"
                                            className="border"
                                            colSpan="5"
                                        />
                                        <TH
                                            label="Relation"
                                            className="border py-2"
                                            colSpan="3"
                                        />
                                        <TH
                                            label="Amount"
                                            className="border"
                                            rowSpan="2"
                                        />
                                        <TH
                                            label="Document"
                                            className="border"
                                            rowSpan="2"
                                        />
                                    </tr>
                                    <tr className="text-center text-gray-700">
                                        <TH
                                            label="Date"
                                            className="border py-2"
                                        />
                                        <TH
                                            label="Purpose"
                                            className="border py-2"
                                        />
                                        <TH
                                            label="Location"
                                            className="border py-2"
                                        />
                                        <TH
                                            label="Address"
                                            className="border py-2"
                                        />
                                        <TH
                                            label="Type"
                                            className="border py-2"
                                        />
                                        <TH
                                            label="Name"
                                            className="border py-2"
                                        />
                                        <TH
                                            label="Person"
                                            className="border py-2"
                                        />
                                        <TH
                                            label="Position"
                                            className="border py-2"
                                        />
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataById.reimburse_detail.map(
                                        (rd: any, i: number) => (
                                            <tr
                                                className="text-center text-gray-700 text-sm"
                                                key={i}
                                            >
                                                <TD className="border py-2">
                                                    {i + 1}.
                                                </TD>
                                                <TD className="border py-2">
                                                    {dateFormat(
                                                        rd.REIMBURSE_DETAIL_DATE,
                                                        "dd-mm-yyyy"
                                                    )}
                                                </TD>
                                                <TD className="border py-2">
                                                    {
                                                        rd.REIMBURSE_DETAIL_PURPOSE
                                                    }
                                                </TD>
                                                <TD className="border py-2">
                                                    {
                                                        rd.REIMBURSE_DETAIL_LOCATION
                                                    }
                                                </TD>
                                                <TD className="border py-2">
                                                    {
                                                        rd.REIMBURSE_DETAIL_ADDRESS
                                                    }
                                                </TD>
                                                <TD className="border py-2">
                                                    {
                                                        rd.type
                                                            ?.CASH_ADVANCE_PURPOSE
                                                    }
                                                </TD>
                                                <TD className="border py-2">
                                                    {rd.relation_organization
                                                        ? rd
                                                              .relation_organization
                                                              .RELATION_ORGANIZATION_ALIAS
                                                        : "-"}
                                                </TD>
                                                <TD className="border py-2">
                                                    {rd.REIMBURSE_DETAIL_RELATION_NAME
                                                        ? rd.REIMBURSE_DETAIL_RELATION_NAME
                                                        : "-"}
                                                </TD>
                                                <TD className="border py-2">
                                                    {rd.REIMBURSE_DETAIL_RELATION_POSITION
                                                        ? rd.REIMBURSE_DETAIL_RELATION_POSITION
                                                        : "-"}
                                                </TD>
                                                <TD className="border py-2">
                                                    {formatCurrency.format(
                                                        rd.REIMBURSE_DETAIL_AMOUNT
                                                    )}
                                                </TD>
                                                <TD className="border py-2">
                                                    {rd?.m_reimburse_document
                                                        ?.length > 0 ? (
                                                        <button
                                                            type="button"
                                                            className="bg-black hover:bg-slate-800 text-sm text-white py-2 px-3"
                                                            onClick={() => {
                                                                setModalFiles({
                                                                    add_files:
                                                                        false,
                                                                    add_file_execute:
                                                                        false,
                                                                    show_files:
                                                                        true,
                                                                    show_files_revised:
                                                                        "",
                                                                    show_files_proof_of_document:
                                                                        false,
                                                                    index: "",
                                                                    index_show:
                                                                        i,
                                                                    index_show_revised:
                                                                        "",
                                                                });
                                                            }}
                                                        >
                                                            {rd
                                                                ?.m_reimburse_document
                                                                ?.length +
                                                                " Files"}
                                                        </button>
                                                    ) : (
                                                        "-"
                                                    )}
                                                </TD>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr className="text-center text-black text-sm">
                                        <TD
                                            className="border text-right pr-5 py-2 font-bold"
                                            colSpan={9}
                                        >
                                            TOTAL AMOUNT
                                        </TD>
                                        <TD className="border py-2 font-bold">
                                            {formatCurrency.format(
                                                dataById.REIMBURSE_TOTAL_AMOUNT
                                            )}
                                        </TD>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        {/* Table form end */}

                        <div className="grid md:grid-cols-2 my-10">
                            <div className="w-full p-2">
                                <InputLabel htmlFor="type" className="mb-2">
                                    Information
                                    {/* <span className="text-red-600">*</span> */}
                                </InputLabel>
                                {dataById.notes?.REIMBURSE_NOTES_NAME ? (
                                    <TextInput
                                        value={
                                            dataById.notes?.REIMBURSE_NOTES_NAME
                                        }
                                        className="bg-gray-100"
                                        readOnly
                                    />
                                ) : (
                                    "-"
                                )}
                            </div>

                            <div className="w-full p-2">
                                <InputLabel htmlFor="type" className="mb-2">
                                    Proof of Document
                                    {/* <span className="text-red-600">*</span> */}
                                </InputLabel>
                                {dataById.m_reimburse_proof_of_document
                                    ?.length > 0 ? (
                                    <button
                                        type="button"
                                        className="bg-black hover:bg-slate-800 text-sm text-white py-2 px-3"
                                        onClick={() => {
                                            setModalFiles({
                                                add_files: false,
                                                add_files_execute: false,
                                                show_files: false,
                                                show_files_revised: false,
                                                show_files_proof_of_document:
                                                    true,
                                                index: "",
                                                index_show: "",
                                                index_show_revised: "",
                                            });
                                        }}
                                    >
                                        {dataById.m_reimburse_proof_of_document
                                            ?.length + " Files"}
                                    </button>
                                ) : (
                                    "-"
                                )}
                            </div>
                        </div>

                        <div className="w-full p-2 mt-5">
                            <InputLabel
                                htmlFor="reimburse_request_note"
                                value="Note"
                                className="mb-2"
                            />
                            <Textarea
                                id="reimburse_request_note"
                                name="reimburse_request_note"
                                className="resize-none border-0 focus:ring-2 focus:ring-inset focus:ring-red-600"
                                rows={5}
                                value={dataById.REIMBURSE_REQUEST_NOTE || ""}
                                readOnly
                            />
                        </div>

                        <div className="mt-10">
                            <p>Status</p>
                            <ul role="list" className="mt-5">
                                <li>
                                    <div className="relative pb-8">
                                        <span
                                            aria-hidden="true"
                                            className="absolute left-4 top-4 -ml-px h-12 w-0.5 bg-red-300"
                                        />
                                        <div className="relative flex space-x-5">
                                            <div>
                                                <span className="bg-red-600 flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white"></span>
                                            </div>
                                            <div className="flex min-w-0 justify-between space-x-8 pt-1.5">
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Created
                                                    </p>
                                                </div>
                                                <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                                    <time>
                                                        {dateFormat(
                                                            dataById.REIMBURSE_CREATED_AT,
                                                            "dd-mm-yyyy"
                                                        )}
                                                    </time>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                {dataById.REIMBURSE_FIRST_APPROVAL_STATUS ===
                                    2 && (
                                    <li>
                                        <div className="relative pb-8">
                                            <span
                                                aria-hidden="true"
                                                className="absolute left-4 top-4 -ml-px h-12 w-0.5 bg-red-300"
                                            />
                                            <div className="relative flex space-x-5">
                                                <div>
                                                    <span className="bg-red-600 flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white"></span>
                                                </div>
                                                <div className="flex min-w-0 justify-between space-x-6 pt-1.5">
                                                    <div>
                                                        <p className="text-sm text-gray-500">
                                                            Approve 1
                                                        </p>
                                                    </div>
                                                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                                        <time>
                                                            {dateFormat(
                                                                dataById.REIMBURSE_FIRST_APPROVAL_CHANGE_STATUS_DATE,
                                                                "dd-mm-yyyy"
                                                            )}
                                                        </time>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                )}
                                {dataById.REIMBURSE_SECOND_APPROVAL_STATUS !==
                                    null && (
                                    <li>
                                        <div className="relative pb-8">
                                            <span
                                                aria-hidden="true"
                                                className="absolute left-4 top-4 -ml-px h-12 w-0.5 bg-red-300"
                                            />
                                            <div className="relative flex space-x-5">
                                                <div>
                                                    <span className="bg-red-600 flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white"></span>
                                                </div>
                                                <div className="flex min-w-0 justify-between space-x-6 pt-1.5">
                                                    <div>
                                                        <p className="text-sm text-gray-500">
                                                            Approve 2
                                                        </p>
                                                    </div>
                                                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                                        <time>
                                                            {dateFormat(
                                                                dataById.REIMBURSE_SECOND_APPROVAL_CHANGE_STATUS_DATE,
                                                                "dd-mm-yyyy"
                                                            )}
                                                        </time>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                )}
                                {dataById.REIMBURSE_THIRD_APPROVAL_STATUS !==
                                    null && (
                                    <li>
                                        <div className="relative pb-8">
                                            <span
                                                aria-hidden="true"
                                                className="absolute left-4 top-4 -ml-px h-12 w-0.5 bg-red-300"
                                            />
                                            <div className="relative flex space-x-5">
                                                <div>
                                                    <span className="bg-red-600 flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white"></span>
                                                </div>
                                                <div className="flex min-w-0 justify-between space-x-6 pt-1.5">
                                                    <div>
                                                        <p className="text-sm text-gray-500">
                                                            Approve 3
                                                        </p>
                                                    </div>
                                                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                                        <time>
                                                            {dateFormat(
                                                                dataById.REIMBURSE_THIRD_APPROVAL_CHANGE_STATUS_DATE,
                                                                "dd-mm-yyyy"
                                                            )}
                                                        </time>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                )}
                                {dataById.REIMBURSE_SECOND_APPROVAL_STATUS ===
                                    6 && (
                                    <li>
                                        <div className="relative pb-8">
                                            <div className="relative flex space-x-5">
                                                <div>
                                                    <span className="bg-red-600 flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white"></span>
                                                </div>
                                                <div className="flex min-w-0 justify-between space-x-5 pt-1.5">
                                                    <div>
                                                        <p className="text-sm text-gray-500">
                                                            Complited
                                                        </p>
                                                    </div>
                                                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                                        <time>
                                                            {dateFormat(
                                                                dataById.REIMBURSE_SECOND_APPROVAL_CHANGE_STATUS_DATE,
                                                                "dd-mm-yyyy"
                                                            )}
                                                        </time>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </>
                }
            />
            {/* Modal Detail End */}

            {/* Modal Approve Start */}
            <ModalToAction
                classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 min-w-full`}
                show={modal.approve}
                closeable={true}
                onClose={() =>
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                        search_ca_report: false,
                        approve: false,
                        report: false,
                        execute: false,
                    })
                }
                title="Reimburse Approve"
                url={`/reimburseApprove`}
                data={dataById}
                method="patch"
                onSuccess={handleSuccess}
                headers={null}
                submitButtonName={""}
                body={
                    <>
                        <ModalToDocument
                            classPanel={
                                "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 min-w-[100%] md:min-w-[70%] lg:min-w-[35%]"
                            }
                            show={modalFiles.show_files}
                            closeable={true}
                            onClose={() => handleOnCloseModalFiles()}
                            title="Show Files"
                            url=""
                            data=""
                            method=""
                            onSuccess=""
                            headers={null}
                            submitButtonName=""
                            body={
                                <>
                                    <div className="grid grid-cols-12 my-3">
                                        {dataById.reimburse_detail[
                                            modalFiles.index_show
                                        ]?.m_reimburse_document.map(
                                            (file: any, i: number) => (
                                                <>
                                                    <div
                                                        className={`w-full col-span-11 mb-4`}
                                                        key={i}
                                                    >
                                                        <InputLabel
                                                            htmlFor="files"
                                                            value="File"
                                                            className="mb-2"
                                                        />
                                                        <a
                                                            href={`/reimburseDocReader/${
                                                                dataById
                                                                    .reimburse_detail[
                                                                    modalFiles
                                                                        .index_show
                                                                ]
                                                                    .REIMBURSE_DETAIL_ID
                                                            }/${
                                                                file?.document
                                                                    .DOCUMENT_ID
                                                            }`}
                                                            target="_blank"
                                                        >
                                                            {
                                                                file?.document
                                                                    .DOCUMENT_ORIGINAL_NAME
                                                            }
                                                        </a>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        title="Download File"
                                                        onClick={() =>
                                                            handleFileDownload(
                                                                dataById
                                                                    .reimburse_detail[
                                                                    modalFiles
                                                                        .index_show
                                                                ]
                                                                    .REIMBURSE_DETAIL_ID,
                                                                file?.document
                                                                    .DOCUMENT_ID
                                                            )
                                                        }
                                                    >
                                                        <ArrowDownTrayIcon className="w-5 mt-7 m-auto cursor-pointer hover:text-slate-700" />
                                                    </button>
                                                </>
                                            )
                                        )}
                                    </div>
                                </>
                            }
                        />
                        <div className="grid md:grid-cols-2 my-10">
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="reimburseNumber"
                                    value="Reimburse Number"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="reimburseNumber"
                                    type="text"
                                    name="reimburseNumber"
                                    value={dataById.REIMBURSE_NUMBER}
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="requestedDate"
                                    value="Request Date"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="requestedDate"
                                    type="text"
                                    name="requestedDate"
                                    value={dateFormat(
                                        dataById.REIMBURSE_REQUETED_DATE,
                                        "dd-mm-yyyy"
                                    )}
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="namaPengguna"
                                    value="Applicant"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="namaPengguna"
                                    type="text"
                                    name="namaPengguna"
                                    value={
                                        dataById.employee?.EMPLOYEE_FIRST_NAME
                                    }
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="divisi"
                                    value="Division"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="divisi"
                                    type="text"
                                    name="divisi"
                                    value={
                                        dataById.division
                                            ?.COMPANY_DIVISION_ALIAS
                                    }
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="cost_center"
                                    value="Cost Center"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="cost_center"
                                    type="text"
                                    name="cost_center"
                                    value={
                                        dataById.cost_center
                                            ?.COMPANY_DIVISION_ALIAS
                                    }
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="namaPemohon"
                                    value="Used By"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="namaPemohon"
                                    type="text"
                                    name="namaPemohon"
                                    value={
                                        dataById.employee_used_by
                                            ?.EMPLOYEE_FIRST_NAME
                                    }
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="branch"
                                    value="Branch"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="branch"
                                    type="text"
                                    name="branch"
                                    value={
                                        dataById.office?.COMPANY_OFFICE_ALIAS
                                    }
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="namaPemberiApproval"
                                    value="Request for Approval"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="namaPemberiApproval"
                                    type="text"
                                    name="namaPemberiApproval"
                                    value={
                                        dataById.employee_approval
                                            ?.EMPLOYEE_FIRST_NAME
                                    }
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                        </div>

                        {/* Table form start */}
                        <div className="max-w-full overflow-x-auto overflow-visible">
                            <table className="w-full divide-y divide-gray-300">
                                <thead className="bg-gray-100">
                                    <tr className="text-center">
                                        <TH
                                            label="No."
                                            className="border px-3 py-2"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Intended Activity"
                                            className="border px-3 py-2"
                                            colSpan={5}
                                        />
                                        <TH
                                            label="Relation"
                                            className="border px-3 py-2"
                                            colSpan={3}
                                        />
                                        <TH
                                            label="Amount"
                                            className="border px-3 py-2"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Document"
                                            className="border px-3 py-2"
                                            rowSpan={2}
                                        />
                                        <TH
                                            className="border px-3 py-2"
                                            rowSpan="2"
                                        >
                                            Approval
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH
                                            className="border px-3 py-2"
                                            rowSpan="2"
                                        >
                                            Cost Classification
                                        </TH>
                                        <TH
                                            className="border px-3 py-2"
                                            rowSpan="2"
                                        >
                                            Amount Approve
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH
                                            label="Remarks"
                                            className="border px-3 py-2"
                                            rowSpan="2"
                                        />
                                    </tr>
                                    <tr className="text-center text-gray-700">
                                        <TH
                                            label="Date"
                                            className="border px-3 py-2"
                                        />
                                        <TH
                                            label="Purpose"
                                            className="border px-3 py-2"
                                        />
                                        <TH
                                            label="Location"
                                            className="border px-3 py-2"
                                        />
                                        <TH
                                            label="Address"
                                            className="border px-3 py-2"
                                        />
                                        <TH
                                            label="Type"
                                            className="border px-3 py-2"
                                        />
                                        <TH
                                            label="Name"
                                            className="border px-3 py-2"
                                        />
                                        <TH
                                            label="Person"
                                            className="border px-3 py-2"
                                        />
                                        <TH
                                            label="Position"
                                            className="border px-3 py-2"
                                        />
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataById.reimburse_detail.map(
                                        (rd: any, i: number) => (
                                            <tr
                                                className="text-center text-gray-700 text-sm leading-7"
                                                key={i}
                                            >
                                                <TD className="border w-10">
                                                    {i + 1}.
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {dateFormat(
                                                        rd.REIMBURSE_DETAIL_DATE,
                                                        "dd-mm-yyyy"
                                                    )}
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {
                                                        rd.REIMBURSE_DETAIL_PURPOSE
                                                    }
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {
                                                        rd.REIMBURSE_DETAIL_LOCATION
                                                    }
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {
                                                        rd.REIMBURSE_DETAIL_ADDRESS
                                                    }
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {
                                                        rd.type
                                                            ?.CASH_ADVANCE_PURPOSE
                                                    }
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {rd.relation_organization
                                                        ? rd
                                                              .relation_organization
                                                              .RELATION_ORGANIZATION_ALIAS
                                                        : "-"}
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {rd.REIMBURSE_DETAIL_RELATION_NAME
                                                        ? rd.REIMBURSE_DETAIL_RELATION_NAME
                                                        : "-"}
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {rd.REIMBURSE_DETAIL_RELATION_POSITION
                                                        ? rd.REIMBURSE_DETAIL_RELATION_POSITION
                                                        : "-"}
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {formatCurrency.format(
                                                        rd.REIMBURSE_DETAIL_AMOUNT
                                                    )}
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {rd?.m_reimburse_document
                                                        ?.length > 0 ? (
                                                        <button
                                                            type="button"
                                                            className="bg-black hover:bg-slate-800 text-sm text-white py-2 px-3"
                                                            onClick={() => {
                                                                setModalFiles({
                                                                    add_files:
                                                                        false,
                                                                    add_files_execute:
                                                                        false,
                                                                    show_files:
                                                                        true,
                                                                    show_files_revised:
                                                                        false,
                                                                    show_files_proof_of_document:
                                                                        false,
                                                                    index: "",
                                                                    index_show:
                                                                        i,
                                                                    index_show_revised:
                                                                        "",
                                                                });
                                                            }}
                                                        >
                                                            {rd
                                                                ?.m_reimburse_document
                                                                ?.length +
                                                                " Files"}
                                                        </button>
                                                    ) : (
                                                        "-"
                                                    )}
                                                </TD>
                                                <TD className="border">
                                                    <select
                                                        id="REIMBURSE_DETAIL_APPROVAL"
                                                        name="REIMBURSE_DETAIL_APPROVAL"
                                                        className="block w-56 rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                        onChange={(e) =>
                                                            handleChangeApprovalReport(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                        value={
                                                            rd.REIMBURSE_DETAIL_APPROVAL ||
                                                            ""
                                                        }
                                                        aria-label="Choose Reimburse Detail Approval"
                                                        required
                                                    >
                                                        <option value="">
                                                            -- Choose Approval
                                                            --
                                                        </option>
                                                        {ReimburseApproval.map(
                                                            (approval: any) => (
                                                                <option
                                                                    key={
                                                                        approval.CASH_ADVANCE_APPROVAL_ID
                                                                    }
                                                                    value={
                                                                        approval.CASH_ADVANCE_APPROVAL_ID
                                                                    }
                                                                >
                                                                    {
                                                                        approval.CASH_ADVANCE_APPROVAL_NAME
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </TD>
                                                <TD className="border">
                                                    <Select
                                                        classNames={{
                                                            menuButton: () =>
                                                                `flex w-96 text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400 ring-1 ring-gray-300`,
                                                            menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50",
                                                            listItem: ({
                                                                isSelected,
                                                            }: any) =>
                                                                `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                                    isSelected
                                                                        ? `text-white bg-red-600`
                                                                        : `text-gray-500 hover:bg-red-100 hover:text-black`
                                                                }`,
                                                        }}
                                                        options={selectCoa}
                                                        isSearchable={true}
                                                        placeholder={
                                                            "Choose COA"
                                                        }
                                                        value={{
                                                            label: getCoaSelect(
                                                                rd.REIMBURSE_DETAIL_COST_CLASSIFICATION
                                                            ),
                                                            value: rd.REIMBURSE_DETAIL_COST_CLASSIFICATION,
                                                        }}
                                                        onChange={(val: any) =>
                                                            handleChangeApproveReportCustom(
                                                                val.value,
                                                                "REIMBURSE_DETAIL_COST_CLASSIFICATION",
                                                                i
                                                            )
                                                        }
                                                        primaryColor={
                                                            "bg-red-500"
                                                        }
                                                    />
                                                </TD>
                                                <TD className="border">
                                                    <CurrencyInput
                                                        id="REIMBURSE_DETAIL_AMOUNT_APPROVE"
                                                        name="REIMBURSE_DETAIL_AMOUNT_APPROVE"
                                                        value={
                                                            rd.REIMBURSE_DETAIL_AMOUNT_APPROVE
                                                        }
                                                        decimalScale={2}
                                                        decimalsLimit={2}
                                                        onValueChange={(
                                                            val: any
                                                        ) =>
                                                            handleChangeApproveReportCustom(
                                                                val,
                                                                "REIMBURSE_DETAIL_AMOUNT_APPROVE",
                                                                i
                                                            )
                                                        }
                                                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right ${
                                                            rd.REIMBURSE_DETAIL_APPROVAL ===
                                                                "3" ||
                                                            rd.REIMBURSE_DETAIL_APPROVAL ===
                                                                3 ||
                                                            rd.REIMBURSE_DETAIL_APPROVAL ===
                                                                "1" ||
                                                            rd.REIMBURSE_DETAIL_APPROVAL ===
                                                                1
                                                                ? "bg-gray-100"
                                                                : ""
                                                        }`}
                                                        disabled={
                                                            rd.REIMBURSE_DETAIL_APPROVAL ===
                                                                "3" ||
                                                            rd.REIMBURSE_DETAIL_APPROVAL ===
                                                                3 ||
                                                            rd.REIMBURSE_DETAIL_APPROVAL ===
                                                                "1" ||
                                                            (rd.REIMBURSE_DETAIL_APPROVAL ===
                                                                1 &&
                                                                true)
                                                        }
                                                        required
                                                        placeholder="0.00"
                                                        autoComplete="off"
                                                    />
                                                </TD>
                                                <TD className="border">
                                                    <div className="w-96">
                                                        <TextInput
                                                            id="REIMBURSE_DETAIL_REMARKS"
                                                            type="text"
                                                            name="REIMBURSE_DETAIL_REMARKS"
                                                            value={
                                                                rd.REIMBURSE_DETAIL_REMARKS ||
                                                                ""
                                                            }
                                                            className=""
                                                            autoComplete="off"
                                                            onChange={(e) =>
                                                                handleChangeApprove(
                                                                    e,
                                                                    i
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </TD>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr className="text-center text-black text-sm">
                                        <TD
                                            className="border font-bold text-right pr-5 py-2"
                                            colSpan={13}
                                        >
                                            PROPOSE AMOUNT
                                        </TD>
                                        <TD className="border font-bold text-center py-2">
                                            {formatCurrency.format(
                                                dataById.REIMBURSE_TOTAL_AMOUNT
                                            )}
                                        </TD>
                                    </tr>
                                    <tr className="text-center text-black text-sm">
                                        <TD
                                            className="border font-bold text-right pr-5 py-2"
                                            colSpan={13}
                                        >
                                            APPROVE AMOUNT
                                        </TD>
                                        <TD className="border font-bold text-center py-2">
                                            {formatCurrency.format(
                                                approveTotalAmount
                                            )}
                                        </TD>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        {/* Table form end */}

                        <div className="grid md:grid-cols-2 my-10">
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="REIMBURSE_TYPE"
                                    className="mb-2"
                                >
                                    Information
                                </InputLabel>
                                <select
                                    id="REIMBURSE_TYPE"
                                    name="REIMBURSE_TYPE"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            REIMBURSE_TYPE: e.target.value,
                                        })
                                    }
                                    value={dataById?.REIMBURSE_TYPE || ""}
                                >
                                    <option value="">
                                        -- Choose Information --
                                    </option>
                                    {ReimburseNotes.map((notes: any) => (
                                        <option
                                            key={notes.REIMBURSE_NOTES_ID}
                                            value={notes.REIMBURSE_NOTES_ID}
                                        >
                                            {notes.REIMBURSE_NOTES_NAME}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="w-full p-2 mt-5">
                            <InputLabel
                                htmlFor="reimburse_request_note"
                                value="Note"
                                className="mb-2"
                            />
                            <Textarea
                                id="reimburse_request_note"
                                name="reimburse_request_note"
                                className="resize-none border-0 focus:ring-2 focus:ring-inset focus:ring-red-600"
                                rows={5}
                                value={dataById.REIMBURSE_REQUEST_NOTE || ""}
                                readOnly
                            />
                        </div>

                        <div className="mt-7">
                            <button
                                type="submit"
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-yellow-400 px-3 py-2 text-sm font-semibold text-white hover:bg-yellow-300 sm:ml-3 sm:mt-0 sm:w-auto"
                                onClick={() => handleBtnStatus(3)}
                            >
                                Need Revision
                            </button>
                            <button
                                type="submit"
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500 sm:ml-3 sm:mt-0 sm:w-auto"
                                onClick={() => handleBtnStatus(4)}
                            >
                                Reject
                            </button>
                            <button
                                type="submit"
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-500 sm:ml-3 sm:mt-0 sm:w-auto"
                                onClick={() => handleBtnStatus(2)}
                            >
                                Approve
                            </button>
                        </div>
                    </>
                }
            />
            {/* Modal Approve End */}

            {/* Modal Revised Start */}
            <ModalToAction
                classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 min-w-full`}
                show={modal.edit}
                closeable={true}
                onClose={() =>
                    setModal({
                        add: false,
                        delete: false,
                        edit: !modal.edit,
                        view: false,
                        document: false,
                        search: false,
                        search_ca_report: false,
                        approve: false,
                        report: false,
                        execute: false,
                    })
                }
                title="Reimburse Revised"
                url={`/reimburseRevised`}
                data={dataById}
                method="post"
                onSuccess={handleSuccess}
                headers={{ "Content-type": "multipart/form-data" }}
                submitButtonName={"Save"}
                body={
                    <>
                        <ModalToDocument
                            classPanel={
                                "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 min-w-[100%] md:min-w-[70%] lg:min-w-[35%]"
                            }
                            show={modalFiles.show_files_revised}
                            closeable={true}
                            onClose={() => handleOnCloseModalFiles()}
                            title="Show Files"
                            url=""
                            data=""
                            method=""
                            onSuccess=""
                            headers={null}
                            submitButtonName=""
                            body={
                                <>
                                    <div className="grid grid-cols-12 my-3">
                                        {dataById.reimburse_detail[
                                            modalFiles.index_show_revised
                                        ]?.m_reimburse_document && (
                                            <>
                                                {dataById.reimburse_detail[
                                                    modalFiles
                                                        .index_show_revised
                                                ]?.m_reimburse_document.map(
                                                    (file: any, i: number) => (
                                                        <>
                                                            <div
                                                                key={i}
                                                                className={`w-full col-span-11 mb-4`}
                                                            >
                                                                <InputLabel
                                                                    htmlFor="files"
                                                                    value="File"
                                                                    className="mb-2"
                                                                />
                                                                <p>
                                                                    {
                                                                        file
                                                                            ?.document
                                                                            .DOCUMENT_ORIGINAL_NAME
                                                                    }
                                                                </p>
                                                            </div>
                                                            <button
                                                                className="text-center self-center bg-red-600 hover:bg-red-500 text-white mx-2 mt-4 py-1 rounded-lg"
                                                                type="button"
                                                                onClick={() =>
                                                                    handleRemoveRowRevisedShowFiles(
                                                                        i,
                                                                        file
                                                                            ?.document
                                                                            .DOCUMENT_ID,
                                                                        dataById
                                                                            .reimburse_detail[
                                                                            modalFiles
                                                                                .index_show_revised
                                                                        ]
                                                                            .REIMBURSE_DETAIL_ID
                                                                    )
                                                                }
                                                            >
                                                                X
                                                            </button>
                                                        </>
                                                    )
                                                )}
                                            </>
                                        )}

                                        {dataById.reimburse_detail[
                                            modalFiles.index_show_revised
                                        ]?.filesDocument && (
                                            <>
                                                {dataById.reimburse_detail[
                                                    modalFiles
                                                        .index_show_revised
                                                ]?.filesDocument.map(
                                                    (file: any, i: number) => (
                                                        <>
                                                            {file
                                                                .REIMBURSE_DETAIL_DOCUMENT
                                                                ?.name ? (
                                                                <div
                                                                    key={i}
                                                                    className={`w-full col-span-11 mb-4`}
                                                                >
                                                                    <InputLabel
                                                                        htmlFor="files"
                                                                        value="File"
                                                                        className="mb-2"
                                                                    />
                                                                    <p>
                                                                        {
                                                                            file
                                                                                ?.REIMBURSE_DETAIL_DOCUMENT
                                                                                .name
                                                                        }
                                                                    </p>
                                                                </div>
                                                            ) : (
                                                                <div
                                                                    className={`w-full col-span-11 mb-4`}
                                                                >
                                                                    <InputLabel
                                                                        htmlFor="files"
                                                                        value="File"
                                                                        className="mb-2"
                                                                    />
                                                                    <Input
                                                                        name="REIMBURSE_DETAIL_DOCUMENT"
                                                                        type="file"
                                                                        className="w-full"
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleChangeRevisedFiles(
                                                                                e,
                                                                                i
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            )}
                                                            <button
                                                                className="text-center self-center bg-red-600 hover:bg-red-500 text-white mx-2 mt-4 py-1 rounded-lg"
                                                                onClick={(e) =>
                                                                    handleRemoveRowRevisedFiles(
                                                                        e,
                                                                        i
                                                                    )
                                                                }
                                                            >
                                                                X
                                                            </button>
                                                        </>
                                                    )
                                                )}
                                            </>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        className="text-sm cursor-pointer hover:underline"
                                        onClick={() =>
                                            handleAddRowRevisedFiles(
                                                dataById.reimburse_detail[
                                                    modalFiles
                                                        .index_show_revised
                                                ].REIMBURSE_DETAIL_ID
                                            )
                                        }
                                    >
                                        + Add Row
                                    </button>
                                </>
                            }
                        />
                        <div className="grid md:grid-cols-2 my-10">
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="reimburseNumber"
                                    value="Reimburse Number"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="reimburseNumber"
                                    type="text"
                                    name="reimburseNumber"
                                    value={dataById.REIMBURSE_NUMBER}
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="requestedDate"
                                    value="Request Date"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="requestedDate"
                                    type="text"
                                    name="requestedDate"
                                    value={dateFormat(
                                        dataById.REIMBURSE_REQUETED_DATE,
                                        "dd-mm-yyyy"
                                    )}
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="namaPengguna"
                                    value="Applicant"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="namaPengguna"
                                    type="text"
                                    name="namaPengguna"
                                    value={
                                        dataById.employee?.EMPLOYEE_FIRST_NAME
                                    }
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="divisi"
                                    value="Division"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="divisi"
                                    type="text"
                                    name="divisi"
                                    value={
                                        dataById.division
                                            ?.COMPANY_DIVISION_ALIAS
                                    }
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="cost_center"
                                    value="Cost Center"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="cost_center"
                                    type="text"
                                    name="cost_center"
                                    value={
                                        dataById.cost_center
                                            ?.COMPANY_DIVISION_ALIAS
                                    }
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="namaPemohon"
                                    value="Used By"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="namaPemohon"
                                    type="text"
                                    name="namaPemohon"
                                    value={
                                        dataById.employee_used_by
                                            ?.EMPLOYEE_FIRST_NAME
                                    }
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="branch"
                                    value="Branch"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="branch"
                                    type="text"
                                    name="branch"
                                    value={
                                        dataById.office?.COMPANY_OFFICE_ALIAS
                                    }
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="namaPemberiApproval"
                                    value="Request for Approval"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="namaPemberiApproval"
                                    type="text"
                                    name="namaPemberiApproval"
                                    value={
                                        dataById.employee_approval
                                            ?.EMPLOYEE_FIRST_NAME
                                    }
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                        </div>

                        {/* Table form start */}
                        <div className="max-w-full overflow-x-auto overflow-visible">
                            <table className="w-full divide-y divide-gray-300">
                                <thead className="bg-gray-100">
                                    <tr className="text-center">
                                        <TH
                                            label="No."
                                            className="border px-2"
                                            rowSpan={2}
                                        />
                                        <TH className="border" colSpan="5">
                                            Intended Activity{" "}
                                            {/* <span className="text-red-600">
                                                *
                                            </span> */}
                                        </TH>
                                        <TH
                                            label="Relation"
                                            className="border py-2"
                                            colSpan={3}
                                        />
                                        <TH className="border" rowSpan="2">
                                            Amount
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH
                                            label="Document"
                                            className="border px-3 py-2"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Note"
                                            className="border px-3 py-2"
                                            rowSpan={2}
                                        />
                                        {dataById.reimburse_detail.length >
                                            1 && (
                                            <TH
                                                label="Action"
                                                className="border px-3 py-2"
                                                rowSpan={2}
                                            />
                                        )}
                                    </tr>
                                    <tr className="text-center">
                                        <TH className="border py-2">
                                            Date{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH className="border py-2">
                                            Purpose{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH className="border py-2">
                                            Location{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH className="border py-2">
                                            Address{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH className="border py-2">
                                            Type{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH
                                            label="Name"
                                            className="border py-2"
                                        />
                                        <TH label="Person" className="border" />
                                        <TH
                                            label="Position"
                                            className="border"
                                        />
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataById.reimburse_detail.map(
                                        (rd: any, i: number) => (
                                            <tr
                                                className="text-center text-sm"
                                                key={i}
                                            >
                                                <TD className="border">
                                                    {i + 1 + "."}
                                                </TD>
                                                <TD className="border">
                                                    <DatePicker
                                                        name="REIMBURSE_DETAIL_DATE"
                                                        selected={
                                                            rd.REIMBURSE_DETAIL_DATE
                                                        }
                                                        onChange={(date: any) =>
                                                            handleChangeRevisedDate(
                                                                date,
                                                                "REIMBURSE_DETAIL_DATE",
                                                                i
                                                            )
                                                        }
                                                        dateFormat={
                                                            "dd-MM-yyyy"
                                                        }
                                                        placeholderText="dd-mm-yyyyy"
                                                        className="border-0 rounded-md shadow-md text-sm h-9 w-[100%] focus:ring-2 focus:ring-inset focus:ring-red-600"
                                                        autoComplete="off"
                                                        required
                                                    />
                                                </TD>
                                                <TD className="border">
                                                    <TextInput
                                                        id="REIMBURSE_DETAIL_PURPOSE"
                                                        type="text"
                                                        name="REIMBURSE_DETAIL_PURPOSE"
                                                        value={
                                                            rd.REIMBURSE_DETAIL_PURPOSE
                                                        }
                                                        className="w-1/2"
                                                        autoComplete="off"
                                                        onChange={(e) =>
                                                            handleChangeRevised(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                        required
                                                    />
                                                </TD>
                                                <TD className="border">
                                                    <TextInput
                                                        id="REIMBURSE_DETAIL_LOCATION"
                                                        type="text"
                                                        name="REIMBURSE_DETAIL_LOCATION"
                                                        value={
                                                            rd.REIMBURSE_DETAIL_LOCATION
                                                        }
                                                        className="w-1/2"
                                                        onChange={(e) =>
                                                            handleChangeRevised(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                        autoComplete="off"
                                                        required
                                                    />
                                                </TD>
                                                <TD className="border">
                                                    <TextInput
                                                        id="REIMBURSE_DETAIL_ADDRESS"
                                                        type="text"
                                                        name="REIMBURSE_DETAIL_ADDRESS"
                                                        value={
                                                            rd.REIMBURSE_DETAIL_ADDRESS
                                                        }
                                                        className="w-1/2"
                                                        onChange={(e) =>
                                                            handleChangeRevised(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                        autoComplete="off"
                                                        required
                                                    />
                                                </TD>
                                                <TD className="border">
                                                    <select
                                                        id="REIMBURSE_DETAIL_TYPE"
                                                        name="REIMBURSE_DETAIL_TYPE"
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                        value={
                                                            rd.REIMBURSE_DETAIL_TYPE
                                                        }
                                                        required
                                                        onChange={(e) =>
                                                            handleChangeRevised(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                    >
                                                        <option value="">
                                                            -- Choose Type --
                                                        </option>
                                                        {purposes.map(
                                                            (purpose: any) => (
                                                                <option
                                                                    key={
                                                                        purpose.CASH_ADVANCE_PURPOSE_ID
                                                                    }
                                                                    value={
                                                                        purpose.CASH_ADVANCE_PURPOSE_ID
                                                                    }
                                                                >
                                                                    {
                                                                        purpose.CASH_ADVANCE_PURPOSE
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </TD>
                                                <TD className="border">
                                                    <Select
                                                        classNames={{
                                                            menuButton: () =>
                                                                `flex w-80 text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400 ring-1 ring-gray-300`,
                                                            menu: "absolute w-80 text-left z-20 bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                            listItem: ({
                                                                isSelected,
                                                            }: any) =>
                                                                `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                                    isSelected
                                                                        ? `text-white bg-red-600`
                                                                        : `text-gray-500 hover:bg-red-100 hover:text-black`
                                                                }`,
                                                        }}
                                                        options={selectRelation}
                                                        isSearchable={true}
                                                        placeholder={
                                                            "Choose Business Relation"
                                                        }
                                                        value={{
                                                            label: getRelationSelect(
                                                                rd.REIMBURSE_DETAIL_RELATION_ORGANIZATION_ID
                                                            ),
                                                            value: rd.REIMBURSE_DETAIL_RELATION_ORGANIZATION_ID,
                                                        }}
                                                        onChange={(val: any) =>
                                                            handleChangeRevisedCustom(
                                                                val.value,
                                                                "REIMBURSE_DETAIL_RELATION_ORGANIZATION_ID",
                                                                i
                                                            )
                                                        }
                                                        primaryColor={
                                                            "bg-red-500"
                                                        }
                                                    />
                                                </TD>
                                                <TD className="border">
                                                    <TextInput
                                                        id="REIMBURSE_DETAIL_RELATION_NAME"
                                                        type="text"
                                                        name="REIMBURSE_DETAIL_RELATION_NAME"
                                                        value={
                                                            rd.REIMBURSE_DETAIL_RELATION_NAME ||
                                                            ""
                                                        }
                                                        className="w-1/2"
                                                        autoComplete="off"
                                                        onChange={(e) =>
                                                            handleChangeRevised(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                    />
                                                </TD>
                                                <TD className="border">
                                                    <TextInput
                                                        id="REIMBURSE_DETAIL_RELATION_POSITION"
                                                        type="text"
                                                        name="REIMBURSE_DETAIL_RELATION_POSITION"
                                                        value={
                                                            rd.REIMBURSE_DETAIL_RELATION_POSITION ||
                                                            ""
                                                        }
                                                        className="w-1/2"
                                                        autoComplete="off"
                                                        onChange={(e) =>
                                                            handleChangeRevised(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                    />
                                                </TD>
                                                <TD className="border">
                                                    <CurrencyInput
                                                        id="REIMBURSE_DETAIL_AMOUNT"
                                                        name="REIMBURSE_DETAIL_AMOUNT"
                                                        value={
                                                            rd.REIMBURSE_DETAIL_AMOUNT
                                                        }
                                                        decimalScale={2}
                                                        decimalsLimit={2}
                                                        onValueChange={(
                                                            val: any
                                                        ) =>
                                                            handleChangeRevisedCustom(
                                                                val,
                                                                "REIMBURSE_DETAIL_AMOUNT",
                                                                i
                                                            )
                                                        }
                                                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right`}
                                                        required
                                                        placeholder="0.00"
                                                        autoComplete="off"
                                                    />
                                                </TD>
                                                <TD className="border">
                                                    <button
                                                        type="button"
                                                        className="bg-black w-full hover:bg-slate-800 text-sm text-white py-2 px-3"
                                                        onClick={() => {
                                                            setModalFiles({
                                                                add_files:
                                                                    false,
                                                                add_files_execute:
                                                                    false,
                                                                show_files:
                                                                    false,
                                                                show_files_revised:
                                                                    true,
                                                                show_files_proof_of_document:
                                                                    false,
                                                                index: "",
                                                                index_show: "",
                                                                index_show_revised:
                                                                    i,
                                                            });
                                                        }}
                                                    >
                                                        {rd.m_reimburse_document
                                                            ?.length > 0 ||
                                                        rd.filesDocument
                                                            ?.length > 0
                                                            ? (rd
                                                                  .m_reimburse_document
                                                                  ?.length ||
                                                                  0) +
                                                              (rd.filesDocument
                                                                  ?.length ||
                                                                  0) +
                                                              " Files"
                                                            : "Add Files"}
                                                    </button>
                                                </TD>
                                                <TD className="border text-left px-3">
                                                    {rd.REIMBURSE_DETAIL_NOTE}
                                                </TD>
                                                {dataById.reimburse_detail
                                                    .length > 1 && (
                                                    <TD className="border">
                                                        <Button
                                                            className="my-1.5 px-3 py-1"
                                                            onClick={() =>
                                                                handleRemoveRowRevised(
                                                                    i,
                                                                    rd.REIMBURSE_DETAIL_ID
                                                                )
                                                            }
                                                            type="button"
                                                        >
                                                            X
                                                        </Button>
                                                    </TD>
                                                )}
                                            </tr>
                                        )
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr className="text-center text-black text-sm">
                                        <TD></TD>
                                        <TD>
                                            <Button
                                                className="mt-5 px-2 py-1 text-black bg-none shadow-none hover:underline"
                                                onClick={(e) =>
                                                    handleAddRowRevised(e)
                                                }
                                                type="button"
                                            >
                                                + Add Row
                                            </Button>
                                        </TD>
                                        <TD
                                            className="text-right font-bold pr-5 py-2"
                                            colSpan={7}
                                        >
                                            TOTAL AMOUNT
                                        </TD>
                                        <TD className="py-2 font-bold">
                                            {formatCurrency.format(
                                                revisedTotalAmount
                                            )}
                                        </TD>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        {/* Table form end */}

                        <div className="w-full p-2 mt-5">
                            <InputLabel
                                htmlFor="reimburse_request_note"
                                value="Note"
                                className="mb-2"
                            />
                            <Textarea
                                id="reimburse_request_note"
                                name="reimburse_request_note"
                                className="resize-none border-0 focus:ring-2 focus:ring-inset focus:ring-red-600"
                                rows={5}
                                value={dataById.REIMBURSE_REQUEST_NOTE || ""}
                                readOnly
                            />
                        </div>
                    </>
                }
            />
            {/* Modal Revised End */}

            {/* Modal Execute Start */}
            <ModalToAction
                classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 min-w-full`}
                show={modal.execute}
                closeable={true}
                onClose={() =>
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                        search_ca_report: false,
                        approve: false,
                        report: false,
                        execute: false,
                    })
                }
                title="Reimburse Execute"
                url={`/reimburseExecute`}
                data={data}
                method="post"
                onSuccess={handleSuccess}
                headers={{ "Content-type": "multipart/form-data" }}
                submitButtonName={"Execute"}
                body={
                    <>
                        <div className="grid md:grid-cols-2 my-10">
                            <div className="w-full p-2">
                                <InputLabel htmlFor="type" className="mb-2">
                                    Propose Amount
                                </InputLabel>
                                <CurrencyInput
                                    value={dataById?.REIMBURSE_TOTAL_AMOUNT}
                                    decimalScale={2}
                                    decimalsLimit={2}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right bg-gray-100"
                                    placeholder="0.00"
                                    autoComplete="off"
                                    disabled
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel htmlFor="type" className="mb-2">
                                    Approve Amount
                                </InputLabel>
                                <CurrencyInput
                                    value={
                                        dataById?.REIMBURSE_TOTAL_AMOUNT_APPROVE
                                    }
                                    decimalScale={2}
                                    decimalsLimit={2}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right bg-gray-100"
                                    placeholder="0.00"
                                    autoComplete="off"
                                    disabled
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel htmlFor="type" className="mb-2">
                                    Information
                                </InputLabel>
                                <TextInput
                                    value={dataById.notes?.REIMBURSE_NOTES_NAME}
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel htmlFor="method" className="mb-2">
                                    Method
                                    <span className="text-red-600">*</span>
                                </InputLabel>
                                <select
                                    id="method"
                                    name="method"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            reimburse_method: e.target.value,
                                        })
                                    }
                                    required
                                >
                                    <option value="">
                                        -- Choose Method --
                                    </option>
                                    {ReimburseMethod.map((method: any) => (
                                        <option
                                            key={method.CASH_ADVANCE_METHOD_ID}
                                            value={
                                                method.CASH_ADVANCE_METHOD_ID
                                            }
                                        >
                                            {method.CASH_ADVANCE_METHOD_NAME}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-1 p-2">
                                <InputLabel
                                    htmlFor="reimburse_settlement_date"
                                    className="mb-2"
                                >
                                    Settlement Date
                                    <span className="text-red-600">*</span>
                                </InputLabel>
                                <DatePicker
                                    name="reimburse_settlement_date"
                                    selected={data.reimburse_settlement_date}
                                    onChange={(date: any) =>
                                        setData({
                                            ...data,
                                            reimburse_settlement_date:
                                                date.toLocaleDateString(
                                                    "en-CA"
                                                ),
                                        })
                                    }
                                    dateFormat={"dd-MM-yyyy"}
                                    placeholderText="dd-mm-yyyyy"
                                    className="border-0 rounded-md shadow-md text-sm h-9 w-[100%] focus:ring-2 focus:ring-inset focus:ring-red-600"
                                    autoComplete="off"
                                    required
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel htmlFor="document" className="mb-2">
                                    Proof of Document
                                    {/* <span className="text-red-600">*</span> */}
                                </InputLabel>
                                <div className="">
                                    <button
                                        type="button"
                                        className="bg-black hover:bg-slate-800 text-sm text-white py-2 px-3"
                                        onClick={() => {
                                            setModalFiles({
                                                add_files: false,
                                                add_files_execute: true,
                                                show_files: false,
                                                show_files_revised: false,
                                                show_files_proof_of_document:
                                                    false,
                                                index: "",
                                                index_show: false,
                                                index_show_revised: true,
                                            });
                                        }}
                                    >
                                        {data.proof_of_document?.length > 0
                                            ? data.proof_of_document?.length +
                                              " Files"
                                            : "Add Files"}
                                    </button>
                                </div>
                                <ModalToDocument
                                    classPanel={
                                        "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 min-w-[100%] md:min-w-[70%] lg:min-w-[35%]"
                                    }
                                    show={modalFiles.add_files_execute}
                                    closeable={true}
                                    onClose={() => handleOnCloseModalFiles()}
                                    title="Proof of Document"
                                    url=""
                                    data=""
                                    method=""
                                    onSuccess=""
                                    headers={null}
                                    submitButtonName=""
                                    body={
                                        <>
                                            {data.proof_of_document.map(
                                                (file: any, i: number) => (
                                                    <div
                                                        className="grid grid-cols-12 mt-3"
                                                        key={i}
                                                    >
                                                        {file.proof_of_document
                                                            ?.name ? (
                                                            <div className="w-full col-span-11">
                                                                <InputLabel
                                                                    htmlFor="files"
                                                                    value="File"
                                                                    className="mb-2"
                                                                />
                                                                <p>
                                                                    {
                                                                        file
                                                                            .proof_of_document
                                                                            ?.name
                                                                    }
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <div className="w-full col-span-11">
                                                                <InputLabel
                                                                    htmlFor="files"
                                                                    value="File"
                                                                    className="mb-2"
                                                                />
                                                                <Input
                                                                    name="proof_of_document"
                                                                    type="file"
                                                                    className="w-full"
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleChangeProofOfDocument(
                                                                            e,
                                                                            i
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                        <button
                                                            className="text-center self-center bg-red-600 hover:bg-red-500 text-white mx-2 mt-8 py-1 rounded-lg"
                                                            onClick={(e) =>
                                                                handleRemoveProofOfDocument(
                                                                    e,
                                                                    i
                                                                )
                                                            }
                                                        >
                                                            X
                                                        </button>
                                                    </div>
                                                )
                                            )}
                                            <button
                                                type="button"
                                                className="text-sm cursor-pointer hover:underline mt-5"
                                                onClick={(e) =>
                                                    handleAddRowProofOfDocument(
                                                        e
                                                    )
                                                }
                                            >
                                                + Add Row
                                            </button>
                                        </>
                                    }
                                />
                            </div>
                        </div>
                    </>
                }
            />
            {/* Modal Execute End */}

            {/* Content Start */}
            <Content
                buttonOnAction={
                    <>
                        <Button
                            className="text-xs sm:text-sm font-semibold px-6 py-1.5 md:col-span-2 lg:col-auto text-white bg-red-600 hover:bg-red-500"
                            onClick={handleAddModal}
                        >
                            {"Add Reimburse"}
                        </Button>
                    </>
                }
                search={
                    <>
                        <fieldset className="py-3 rounded-lg border-slate-100 border-2">
                            <legend className="ml-8 text-sm">Search</legend>
                            <div className="mt-3 px-4">
                                <InputSearch
                                    id="REIMBURSE_NUMBER"
                                    name="REIMBURSE_NUMBER"
                                    type="text"
                                    placeholder="Reimburse Number"
                                    autoComplete="off"
                                    value={
                                        searchReimburse.reimburse_search[0]
                                            .REIMBURSE_NUMBER
                                    }
                                    onChange={(val: any) => {
                                        inputDataSearch(
                                            "REIMBURSE_NUMBER",
                                            val.target.value,
                                            0
                                        );
                                        if (
                                            searchReimburse.reimburse_search[0]
                                                .REIMBURSE_NUMBER === ""
                                        ) {
                                            inputDataSearch("flag", "flag", 0);
                                        } else {
                                            inputDataSearch("flag", "", 0);
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            const reimburseNumber =
                                                searchReimburse
                                                    .reimburse_search[0]
                                                    .REIMBURSE_NUMBER;
                                            if (reimburseNumber) {
                                                inputDataSearch("flag", "", 0);
                                                setRefreshSuccess("success");
                                                setTimeout(() => {
                                                    setRefreshSuccess("");
                                                });
                                            } else {
                                                inputDataSearch(
                                                    "flag",
                                                    "flag",
                                                    0
                                                );
                                            }
                                        }
                                    }}
                                />
                                <InputSearch
                                    id="REIMBURSE_REQUESTED_BY"
                                    name="REIMBURSE_REQUESTED_BY"
                                    type="text"
                                    placeholder="Applicant"
                                    autoComplete="off"
                                    value={
                                        searchReimburse.reimburse_search[0]
                                            .REIMBURSE_REQUESTED_BY
                                    }
                                    onChange={(val: any) => {
                                        inputDataSearch(
                                            "REIMBURSE_REQUESTED_BY",
                                            val.target.value,
                                            0
                                        );
                                        if (
                                            searchReimburse.reimburse_search[0]
                                                .REIMBURSE_REQUESTED_BY === ""
                                        ) {
                                            inputDataSearch("flag", "flag", 0);
                                        } else {
                                            inputDataSearch("flag", "", 0);
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            const reimburseRequestedBy =
                                                searchReimburse
                                                    .reimburse_search[0]
                                                    .REIMBURSE_REQUESTED_BY;
                                            if (reimburseRequestedBy) {
                                                inputDataSearch("flag", "", 0);
                                                setRefreshSuccess("success");
                                                setTimeout(() => {
                                                    setRefreshSuccess("");
                                                });
                                            } else {
                                                inputDataSearch(
                                                    "flag",
                                                    "flag",
                                                    0
                                                );
                                            }
                                        }
                                    }}
                                />
                                <div className="mb-5">
                                    <Select
                                        classNames={{
                                            menuButton: () =>
                                                `flex items-center text-xs sm:text-sm text-gray-400 mt-4 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400 ring-1 ring-gray-300`,
                                            menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                            listItem: ({ isSelected }: any) =>
                                                `block transition duration-200 text-xs sm:text-sm px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                    isSelected
                                                        ? `text-white bg-red-600`
                                                        : `text-gray-500 hover:bg-red-100 hover:text-black`
                                                }`,
                                        }}
                                        options={selectDivision}
                                        isSearchable={true}
                                        placeholder={"Applicant Division"}
                                        value={
                                            searchReimburse.reimburse_search[0]
                                                .REIMBURSE_DIVISION
                                        }
                                        onChange={(val: any) => {
                                            inputDataSearch(
                                                "REIMBURSE_DIVISION",
                                                val,
                                                0
                                            );
                                            if (
                                                searchReimburse
                                                    .reimburse_search[0]
                                                    .REIMBURSE_DIVISION === ""
                                            ) {
                                                inputDataSearch(
                                                    "flag",
                                                    "flag",
                                                    0
                                                );
                                            } else {
                                                inputDataSearch("flag", "", 0);
                                            }
                                        }}
                                        primaryColor={"bg-red-500"}
                                    />
                                </div>
                                <InputSearch
                                    id="REIMBURSE_USED_BY"
                                    name="REIMBURSE_USED_BY"
                                    type="text"
                                    placeholder="Used By"
                                    autoComplete="off"
                                    value={
                                        searchReimburse.reimburse_search[0]
                                            .REIMBURSE_USED_BY
                                    }
                                    onChange={(val: any) => {
                                        inputDataSearch(
                                            "REIMBURSE_USED_BY",
                                            val.target.value,
                                            0
                                        );
                                        if (
                                            searchReimburse.reimburse_search[0]
                                                .REIMBURSE_USED_BY === ""
                                        ) {
                                            inputDataSearch("flag", "flag", 0);
                                        } else {
                                            inputDataSearch("flag", "", 0);
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            const reimburseUsedBy =
                                                searchReimburse
                                                    .reimburse_search[0]
                                                    .REIMBURSE_USED_BY;
                                            if (reimburseUsedBy) {
                                                inputDataSearch("flag", "", 0);
                                                setRefreshSuccess("success");
                                                setTimeout(() => {
                                                    setRefreshSuccess("");
                                                });
                                            } else {
                                                inputDataSearch(
                                                    "flag",
                                                    "flag",
                                                    0
                                                );
                                            }
                                        }
                                    }}
                                />
                                <div className="grid grid-cols-1 mb-5 relative">
                                    <CalendarDaysIcon className="absolute left-2 z-1 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-6" />
                                    <DatePicker
                                        name="REIMBURSE_START_DATE"
                                        selected={
                                            searchReimburse.reimburse_search[0]
                                                .REIMBURSE_START_DATE
                                        }
                                        onChange={(val: any) => {
                                            inputDataSearch(
                                                "REIMBURSE_START_DATE",
                                                val.toLocaleDateString("en-CA"),
                                                0
                                            );
                                            if (
                                                searchReimburse
                                                    .reimburse_search[0]
                                                    .REIMBURSE_START_DATE === ""
                                            ) {
                                                inputDataSearch(
                                                    "flag",
                                                    "flag",
                                                    0
                                                );
                                            } else {
                                                inputDataSearch("flag", "", 0);
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                const reimburseStartDate =
                                                    searchReimburse
                                                        .reimburse_search[0]
                                                        .REIMBURSE_START_DATE;
                                                if (reimburseStartDate) {
                                                    inputDataSearch(
                                                        "flag",
                                                        "",
                                                        0
                                                    );
                                                    setRefreshSuccess(
                                                        "success"
                                                    );
                                                    setTimeout(() => {
                                                        setRefreshSuccess("");
                                                    });
                                                } else {
                                                    inputDataSearch(
                                                        "flag",
                                                        "flag",
                                                        0
                                                    );
                                                }
                                            }
                                        }}
                                        dateFormat={"dd-MM-yyyy"}
                                        placeholderText="dd-mm-yyyyy (Start Date)"
                                        className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset text-xs sm:text-sm focus:ring-red-600 placeholder:text-xs md:placeholder:text-sm pl-10"
                                    />
                                </div>
                                <div className="grid grid-cols-1 mb-5 relative">
                                    <CalendarDaysIcon className="absolute left-2 z-1 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-6" />
                                    <DatePicker
                                        name="reimburse_end_date"
                                        selected={
                                            searchReimburse.reimburse_search[0]
                                                .REIMBURSE_END_DATE
                                        }
                                        onChange={(val: any) => {
                                            inputDataSearch(
                                                "REIMBURSE_END_DATE",
                                                val.toLocaleDateString("en-CA"),
                                                0
                                            );
                                            if (
                                                searchReimburse
                                                    .reimburse_search[0]
                                                    .REIMBURSE_END_DATE === ""
                                            ) {
                                                inputDataSearch(
                                                    "flag",
                                                    "flag",
                                                    0
                                                );
                                            } else {
                                                inputDataSearch("flag", "", 0);
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                const reimburseEndDate =
                                                    searchReimburse
                                                        .reimburse_search[0]
                                                        .REIMBURSE_END_DATE;
                                                if (reimburseEndDate) {
                                                    inputDataSearch(
                                                        "flag",
                                                        "",
                                                        0
                                                    );
                                                    setRefreshSuccess(
                                                        "success"
                                                    );
                                                    setTimeout(() => {
                                                        setRefreshSuccess("");
                                                    });
                                                } else {
                                                    inputDataSearch(
                                                        "flag",
                                                        "flag",
                                                        0
                                                    );
                                                }
                                            }
                                        }}
                                        dateFormat={"dd-MM-yyyy"}
                                        placeholderText="dd-mm-yyyy (End Date)"
                                        className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset text-xs sm:text-sm focus:ring-red-600 placeholder:text-xs md:placeholder:text-sm pl-10"
                                    />
                                </div>
                                <div className="mb-5">
                                    <Select
                                        classNames={{
                                            menuButton: () =>
                                                `flex items-center text-xs sm:text-sm text-gray-400 mt-4 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400 ring-1 ring-gray-300`,
                                            menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                            listItem: ({ isSelected }: any) =>
                                                `block transition duration-200 text-xs sm:text-sm px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                    isSelected
                                                        ? `text-white bg-red-600`
                                                        : `text-gray-500 hover:bg-red-100 hover:text-black`
                                                }`,
                                        }}
                                        options={selectDivision}
                                        isSearchable={true}
                                        placeholder={"Cost Center"}
                                        value={
                                            searchReimburse.reimburse_search[0]
                                                .REIMBURSE_COST_CENTER
                                        }
                                        onChange={(val: any) => {
                                            inputDataSearch(
                                                "REIMBURSE_COST_CENTER",
                                                val,
                                                0
                                            );
                                            if (
                                                searchReimburse
                                                    .reimburse_search[0]
                                                    .REIMBURSE_COST_CENTER ===
                                                ""
                                            ) {
                                                inputDataSearch(
                                                    "flag",
                                                    "flag",
                                                    0
                                                );
                                            } else {
                                                inputDataSearch("flag", "", 0);
                                            }
                                        }}
                                        primaryColor={"bg-red-500"}
                                    />
                                </div>
                                <div className="flex flex-col md:flex-row justify-end gap-2">
                                    <Button
                                        className="mb-4 w-full md:w-[35%] text-white text-xs sm:text-sm py-1.5 px-2 bg-red-600 hover:bg-red-500"
                                        onClick={() => {
                                            if (
                                                searchReimburse
                                                    .reimburse_search[0]
                                                    .REIMBURSE_ID === "" &&
                                                searchReimburse
                                                    .reimburse_search[0]
                                                    .REIMBURSE_NUMBER === ""
                                            ) {
                                                inputDataSearch("flag", "", 0);
                                            } else {
                                                inputDataSearch("flag", "", 0);
                                            }

                                            setRefreshSuccess("success");
                                            setTimeout(() => {
                                                setRefreshSuccess("");
                                            }, 1000);
                                        }}
                                    >
                                        Search
                                    </Button>
                                    <Button
                                        className="mb-4 w-full md:w-[35%] text-white text-xs sm:text-sm py-1.5 px-2 bg-red-600 hover:bg-red-500"
                                        onClick={clearSearchReimburse}
                                    >
                                        Clear Search
                                    </Button>
                                </div>
                            </div>
                        </fieldset>
                    </>
                }
                buttonSearch={
                    <>
                        <div className="mt-10">
                            <fieldset className="pb-10 pt-5 rounded-lg border-slate-100 border-2">
                                <legend className="ml-8 text-sm">
                                    Reimburse Status
                                </legend>
                                <ArrowPathIcon
                                    className="w-5 text-gray-600 hover:text-gray-500 cursor-pointer ml-auto mr-3 mb-8"
                                    onClick={() => handleRefresh()}
                                ></ArrowPathIcon>
                                <div className="flex flex-wrap content-between justify-center gap-6 mt-5 text-sm">
                                    <div className="flex relative">
                                        <Button
                                            className="w-36 bg-gray-500 px-2 py-1 hover:bg-gray-400"
                                            onClick={() => {
                                                inputDataSearch(
                                                    "REIMBURSE_APPROVAL_STATUS",
                                                    "request",
                                                    0
                                                );
                                                if (
                                                    searchReimburse
                                                        .reimburse_search[0]
                                                        .REIMBURSE_APPROVAL_STATUS ===
                                                    ""
                                                ) {
                                                    inputDataSearch(
                                                        "flag",
                                                        "flag",
                                                        0
                                                    );
                                                } else {
                                                    inputDataSearch(
                                                        "flag",
                                                        "",
                                                        0
                                                    );
                                                }

                                                setRefreshSuccess("success");
                                                setTimeout(() => {
                                                    setRefreshSuccess("");
                                                }, 1000);
                                            }}
                                        >
                                            Request
                                            <span className="flex absolute bg-red-600 -top-2 -right-3 px-2 rounded-full">
                                                {getCountReimburseRequestStatus}
                                            </span>
                                        </Button>
                                    </div>
                                    <div className="flex relative">
                                        <Button
                                            className="w-36 bg-green-600 px-2 py-1 hover:bg-green-500"
                                            onClick={() => {
                                                inputDataSearch(
                                                    "REIMBURSE_APPROVAL_STATUS",
                                                    "approve1",
                                                    0
                                                );
                                                if (
                                                    searchReimburse
                                                        .reimburse_search[0]
                                                        .REIMBURSE_APPROVAL_STATUS ===
                                                    ""
                                                ) {
                                                    inputDataSearch(
                                                        "flag",
                                                        "flag",
                                                        0
                                                    );
                                                } else {
                                                    inputDataSearch(
                                                        "flag",
                                                        "",
                                                        0
                                                    );
                                                }

                                                setRefreshSuccess("success");
                                                setTimeout(() => {
                                                    setRefreshSuccess("");
                                                }, 1000);
                                            }}
                                        >
                                            Approve 1
                                            <span className="flex absolute bg-red-600 -top-2 -right-3 px-2 rounded-full">
                                                {
                                                    getCountReimburseApprove1Status
                                                }
                                            </span>
                                        </Button>
                                    </div>
                                    <div className="flex relative">
                                        <Button
                                            className="w-36 bg-green-600 px-2 py-1 hover:bg-green-500"
                                            onClick={() => {
                                                inputDataSearch(
                                                    "REIMBURSE_APPROVAL_STATUS",
                                                    "approve2",
                                                    0
                                                );
                                                if (
                                                    searchReimburse
                                                        .reimburse_search[0]
                                                        .REIMBURSE_APPROVAL_STATUS ===
                                                    ""
                                                ) {
                                                    inputDataSearch(
                                                        "flag",
                                                        "flag",
                                                        0
                                                    );
                                                } else {
                                                    inputDataSearch(
                                                        "flag",
                                                        "",
                                                        0
                                                    );
                                                }

                                                setRefreshSuccess("success");
                                                setTimeout(() => {
                                                    setRefreshSuccess("");
                                                }, 1000);
                                            }}
                                        >
                                            Approve 2
                                            <span className="flex absolute bg-red-600 -top-2 -right-3 px-2 rounded-full">
                                                {
                                                    getCountReimburseApprove2Status
                                                }
                                            </span>
                                        </Button>
                                    </div>
                                    <div className="flex relative">
                                        <Button
                                            className="w-36 bg-green-600 px-2 py-1 hover:bg-green-500"
                                            onClick={() => {
                                                inputDataSearch(
                                                    "REIMBURSE_APPROVAL_STATUS",
                                                    "approve3",
                                                    0
                                                );
                                                if (
                                                    searchReimburse
                                                        .reimburse_search[0]
                                                        .REIMBURSE_APPROVAL_STATUS ===
                                                    ""
                                                ) {
                                                    inputDataSearch(
                                                        "flag",
                                                        "flag",
                                                        0
                                                    );
                                                } else {
                                                    inputDataSearch(
                                                        "flag",
                                                        "",
                                                        0
                                                    );
                                                }

                                                setRefreshSuccess("success");
                                                setTimeout(() => {
                                                    setRefreshSuccess("");
                                                }, 1000);
                                            }}
                                        >
                                            Approve 3
                                            <span className="flex absolute bg-red-600 -top-2 -right-3 px-2 rounded-full">
                                                {
                                                    getCountReimburseApprove3Status
                                                }
                                            </span>
                                        </Button>
                                    </div>
                                    <div className="flex relative">
                                        <Button
                                            className="w-36 bg-yellow-400 px-2 py-1 hover:bg-yellow-300"
                                            onClick={() => {
                                                inputDataSearch(
                                                    "REIMBURSE_APPROVAL_STATUS",
                                                    "revision",
                                                    0
                                                );
                                                if (
                                                    searchReimburse
                                                        .reimburse_search[0]
                                                        .REIMBURSE_APPROVAL_STATUS ===
                                                    ""
                                                ) {
                                                    inputDataSearch(
                                                        "flag",
                                                        "flag",
                                                        0
                                                    );
                                                } else {
                                                    inputDataSearch(
                                                        "flag",
                                                        "",
                                                        0
                                                    );
                                                }

                                                setRefreshSuccess("success");
                                                setTimeout(() => {
                                                    setRefreshSuccess("");
                                                }, 1000);
                                            }}
                                        >
                                            Need Revision
                                            <span className="flex absolute bg-red-600 -top-2 -right-3 px-2 rounded-full">
                                                {
                                                    getCountReimburseNeedRevisionStatus
                                                }
                                            </span>
                                        </Button>
                                    </div>
                                    <div className="flex relative">
                                        <Button
                                            className="w-36 bg-red-600 px-2 py-1 hover:bg-red-500"
                                            onClick={() => {
                                                inputDataSearch(
                                                    "REIMBURSE_APPROVAL_STATUS",
                                                    "reject",
                                                    0
                                                );
                                                if (
                                                    searchReimburse
                                                        .reimburse_search[0]
                                                        .REIMBURSE_APPROVAL_STATUS ===
                                                    ""
                                                ) {
                                                    inputDataSearch(
                                                        "flag",
                                                        "flag",
                                                        0
                                                    );
                                                } else {
                                                    inputDataSearch(
                                                        "flag",
                                                        "",
                                                        0
                                                    );
                                                }

                                                setRefreshSuccess("success");
                                                setTimeout(() => {
                                                    setRefreshSuccess("");
                                                }, 1000);
                                            }}
                                        >
                                            Reject
                                            <span className="flex absolute bg-red-600 -top-2 -right-3 px-2 rounded-full">
                                                {getCountReimburseRejectStatus}
                                            </span>
                                        </Button>
                                    </div>
                                    <div className="flex relative">
                                        <Button
                                            className="w-36 bg-green-500 px-2 py-1 hover:bg-green-400"
                                            onClick={() => {
                                                inputDataSearch(
                                                    "REIMBURSE_APPROVAL_STATUS",
                                                    "complited",
                                                    0
                                                );
                                                if (
                                                    searchReimburse
                                                        .reimburse_search[0]
                                                        .REIMBURSE_APPROVAL_STATUS ===
                                                    ""
                                                ) {
                                                    inputDataSearch(
                                                        "flag",
                                                        "flag",
                                                        0
                                                    );
                                                } else {
                                                    inputDataSearch(
                                                        "flag",
                                                        "",
                                                        0
                                                    );
                                                }

                                                setRefreshSuccess("success");
                                                setTimeout(() => {
                                                    setRefreshSuccess("");
                                                }, 1000);
                                            }}
                                        >
                                            Complited
                                        </Button>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    </>
                }
                dataList={
                    <>
                        <AGGrid
                            addButtonLabel={undefined}
                            addButtonModalState={undefined}
                            withParam={""}
                            searchParam={searchReimburse.reimburse_search}
                            url={"getReimburse"}
                            doubleClickEvent={handleShowModal}
                            triggeringRefreshData={refreshSuccess}
                            rowHeight={130}
                            colDefs={[
                                {
                                    headerName: "No.",
                                    valueGetter: "node.rowIndex + 1",
                                    flex: 1,
                                    cellStyle: { textAlign: "center" },
                                },
                                {
                                    headerName: "Reimburse Number",
                                    field: "REIMBURSE_NUMBER",
                                    flex: 3,
                                    cellStyle: { textAlign: "center" },
                                },
                                {
                                    headerName: "Request Date",
                                    field: "REIMBURSE_REQUESTED_DATE",
                                    flex: 2,
                                    cellStyle: { textAlign: "center" },
                                    valueFormatter: (params: any) => {
                                        return dateFormat(
                                            params.value,
                                            "dd-mm-yyyy"
                                        );
                                    },
                                },
                                {
                                    headerName: "Amount",
                                    field: "REIMBURSE_TOTAL_AMOUNT",
                                    flex: 2,
                                    cellStyle: { textAlign: "center" },
                                    valueFormatter: (params: any) => {
                                        return formatCurrency.format(
                                            params.value
                                        );
                                    },
                                },
                                {
                                    headerName: "Approval",
                                    children: [
                                        {
                                            headerName: "Approve",
                                            field: "REIMBURSE_FIRST_APPROVAL_USER",
                                            flex: 2,
                                            cellHeader: "header-center",
                                            cellRenderer: (params: any) => {
                                                const first_approval_status =
                                                    params.data
                                                        .REIMBURSE_FIRST_APPROVAL_STATUS;

                                                let badgeClass =
                                                    "bg-gray-200 text-gray-700";
                                                let title = "Request";

                                                if (
                                                    first_approval_status === 1
                                                ) {
                                                    badgeClass =
                                                        "bg-gray-200 text-gray-700";
                                                    title = "Request";
                                                } else if (
                                                    first_approval_status === 2
                                                ) {
                                                    badgeClass =
                                                        "bg-green-100 text-green-700";
                                                    title = "Approve";
                                                } else if (
                                                    first_approval_status === 3
                                                ) {
                                                    badgeClass =
                                                        "bg-yellow-300 text-white";
                                                    title = "Need Revision";
                                                } else if (
                                                    first_approval_status === 4
                                                ) {
                                                    badgeClass =
                                                        "bg-red-100 text-red-700";
                                                    title = "Reject";
                                                }

                                                const second_approval_status =
                                                    params.data
                                                        .REIMBURSE_SECOND_APPROVAL_STATUS;
                                                const second_approval_user =
                                                    params.data
                                                        .REIMBURSE_SECOND_APPROVAL_USER;

                                                let badgeClassSecond = "";
                                                let titleSecond = "";

                                                if (
                                                    second_approval_status === 2
                                                ) {
                                                    badgeClassSecond =
                                                        "bg-green-100 text-green-700";
                                                    titleSecond = "Approve";
                                                } else if (
                                                    second_approval_status === 3
                                                ) {
                                                    badgeClassSecond =
                                                        "bg-yellow-300 text-white";
                                                    titleSecond =
                                                        "Need Revision";
                                                } else if (
                                                    second_approval_status === 4
                                                ) {
                                                    badgeClassSecond =
                                                        "bg-red-100 text-red-700";
                                                    titleSecond = "Reject";
                                                } else if (
                                                    second_approval_status === 5
                                                ) {
                                                    badgeClassSecond =
                                                        "bg-green-100 text-green-700";
                                                    titleSecond = "Execute";
                                                } else if (
                                                    second_approval_status === 6
                                                ) {
                                                    badgeClassSecond =
                                                        "bg-green-100 text-green-700";
                                                    titleSecond = "Complited";
                                                }

                                                const third_approval_status =
                                                    params.data
                                                        .REIMBURSE_THIRD_APPROVAL_STATUS;
                                                const third_approval_user =
                                                    params.data
                                                        .REIMBURSE_THIRD_APPROVAL_USER;

                                                let badgeClassThird = "";
                                                let titleThird = "";

                                                if (
                                                    third_approval_status === 2
                                                ) {
                                                    badgeClassThird =
                                                        "bg-green-100 text-green-700";
                                                    titleThird = "Approve";
                                                } else if (
                                                    third_approval_status === 3
                                                ) {
                                                    badgeClassThird =
                                                        "bg-yellow-300 text-white";
                                                    titleThird =
                                                        "Need Revision";
                                                } else if (
                                                    third_approval_status === 4
                                                ) {
                                                    badgeClassThird =
                                                        "bg-red-100 text-red-700";
                                                    titleThird = "Reject";
                                                }

                                                return (
                                                    <div className="flex flex-col">
                                                        <div>
                                                            <BadgeFlat
                                                                className={
                                                                    badgeClass
                                                                }
                                                                title={title}
                                                                body={
                                                                    params.value
                                                                }
                                                            />
                                                        </div>
                                                        <div>
                                                            <BadgeFlat
                                                                className={
                                                                    badgeClassSecond
                                                                }
                                                                title={
                                                                    titleSecond
                                                                }
                                                                body={
                                                                    second_approval_user
                                                                }
                                                            />
                                                        </div>
                                                        <div>
                                                            <BadgeFlat
                                                                className={
                                                                    badgeClassThird
                                                                }
                                                                title={
                                                                    titleThird
                                                                }
                                                                body={
                                                                    third_approval_user
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            },
                                        },
                                        {
                                            headerName: "Status",
                                            flex: 2,
                                            filter: "agSetColumnFilter",
                                            filterParams: {
                                                values: ["Execute", "Pending"],
                                            },
                                            cellRenderer: (params: any) => {
                                                const paramsData = params.data;
                                                const status =
                                                    paramsData?.REIMBURSE_SECOND_APPROVAL_STATUS ===
                                                    6
                                                        ? "Execute"
                                                        : "Pending";

                                                return (
                                                    <>
                                                        <BadgeFlat
                                                            className={
                                                                status ===
                                                                "Execute"
                                                                    ? "bg-green-100 text-green-700"
                                                                    : "bg-yellow-300 text-white"
                                                            }
                                                            title={status}
                                                            body={status}
                                                        />
                                                    </>
                                                );
                                            },
                                        },
                                    ],
                                },
                                {
                                    headerName: "Action",
                                    field: "",
                                    flex: 2,
                                    autoHeight: true,
                                    cellRenderer: (params: any) => {
                                        return (
                                            <>
                                                <select
                                                    className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 cursor-pointer"
                                                    onChange={(e) =>
                                                        handleSelectChange(
                                                            e,
                                                            params.data
                                                                .REIMBURSE_ID
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        Actions
                                                    </option>
                                                    <option value="approve">
                                                        Approve
                                                    </option>
                                                    <option value="revised">
                                                        Revised
                                                    </option>
                                                    <option value="execute">
                                                        Execute
                                                    </option>
                                                </select>
                                            </>
                                        );
                                    },
                                },
                            ]}
                        />
                    </>
                }
            />
            {/* Content End */}
        </AuthenticatedLayout>
    );
}
