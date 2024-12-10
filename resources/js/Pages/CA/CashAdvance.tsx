import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
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
import Select from "react-tailwindcss-select";
import CurrencyInput from "react-currency-input-field";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import BadgeFlat from "@/Components/BadgeFlat";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import InputSearch from "@/Components/InputSearch";
import ModalToDocument from "@/Components/Modal/ModalToDocument";
import Content from "@/Components/Content";
import AGGrid from "@/Components/AgGrid";

export default function CashAdvance({ auth }: PageProps) {
    useEffect(() => {
        getCARequestStatus();
        getCAApprove1Status();
        getCAApprove2Status();
        getCAApprove3Status();
        getCAPendingReportStatus();
        getCANeedRevisionStatus();
        getCARejectStatus();
        getCAReportRejectStatus();
        getCAReportRequestStatus();
        getCAReportApprove1Status();
        getCAReportApprove2Status();
        getCAReportApprove3Status();
        getCAReportNeedRevisionStatus();
        getCAReportRejectStatus();
        getEmployeeBankAccount();
        getCompanies();
        getCADifference();
        getCAApproval();
        getCAMethod();
    }, []);

    const handleRefresh = () => {
        getCARequestStatus();
        getCAApprove1Status();
        getCAApprove2Status();
        getCAApprove3Status();
        getCAPendingReportStatus();
        getCANeedRevisionStatus();
        getCARejectStatus();
        getCAReportRejectStatus();
        getCAReportRequestStatus();
        getCAReportApprove1Status();
        getCAReportApprove2Status();
        getCAReportApprove3Status();
        getCAReportNeedRevisionStatus();
        getCAReportRejectStatus();
        getEmployeeBankAccount();
        getCompanies();
        getCADifference();
        getCAApproval();
        getCAMethod();

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
        view_report: false,
        approve_report: false,
        revised_report: false,
        execute_report: false,
    });
    // Modal Add End

    // Modal Add Files Start
    const [modalFiles, setModalFiles] = useState<any>({
        add_files: false,
        show_files: false,
        show_files_revised: false,
        add_files_report: false,
        show_files_report: false,
        show_files_revised_report: false,
        show_files_proof_of_document: false,
        add_files_execute_report: false,
        index: "",
        index_show: "",
        index_show_revised: "",
        index_show_report: "",
        index_show_revised_report: "",
    });
    // Modal Add Files End

    const handleOnCloseModalFiles = () => {
        setModalFiles({
            add_files: false,
            show_files: false,
            show_files_revised: false,
            add_files_report: false,
            show_files_report: false,
            show_files_revised_report: false,
            show_files_proof_of_document: false,
            add_files_execute_report: false,
            index: "",
            index_show: "",
            index_show_revised: "",
            index_show_report: "",
            index_show_revised_report: "",
        });
    };

    const { data, setData, errors, reset } = useForm<any>({
        cash_advance_id: "",
        cash_advance_used_by: "",
        cash_advance_requested_by: "",
        cash_advance_division: "",
        cash_advance_cost_center: "",
        cash_advance_branch: "",
        cash_advance_first_approval_by: "",
        cash_advance_request_note: "",
        cash_advance_delivery_method_transfer: "",
        cash_advance_transfer_amount: "",
        cash_advance_delivery_method_cash: "",
        cash_advance_cash_amount: "",
        cash_advance_total_amount: "",
        cash_advance_total_amount_request: "",
        cash_advance_transfer_date: "",
        cash_advance_to_bank_account: "",
        cash_advance_receive_date: "",
        cash_advance_receive_name: "",
        type: "",
        amount: "",
        method: "",
        transaction_date: "",
        proof_of_document: [],
        CashAdvanceDetail: [
            {
                cash_advance_detail_start_date: "",
                cash_advance_detail_end_date: "",
                cash_advance_detail_purpose: "",
                cash_advance_detail_relation_name: "",
                cash_advance_detail_relation_position: "",
                cash_advance_detail_relation_organization_id: "",
                cash_advance_detail_location: "",
                cash_advance_detail_amount: "",
                cash_advance_detail_document_id: [],
                cash_advance_detail_note: "",
                cash_advance_detail_cost_classification: "",
                cash_advance_detail_amount_approve: "",
                cash_advance_detail_remarks: "",
            },
        ],
    });

    const [dataCAReport, setDataCAReport] = useState<any>({
        cash_advance_id: "",
        cash_advance_used_by: "",
        cash_advance_requested_by: "",
        cash_advance_division: "",
        cash_advance_cost_center: "",
        cash_advance_branch: "",
        cash_advance_first_approval_by: "",
        cash_advance_request_note: "",
        cash_advance_delivery_method_transfer: "",
        cash_advance_transfer_amount: "",
        cash_advance_delivery_method_cash: "",
        cash_advance_cash_amount: "",
        cash_advance_total_amount: "",
        cash_advance_total_amount_request: "",
        cash_advance_transfer_date: "",
        cash_advance_to_bank_account: "",
        cash_advance_receive_date: "",
        cash_advance_receive_name: "",
        type: "",
        amount: "",
        method: "",
        transaction_date: "",
        proof_of_document: [],
        CashAdvanceDetail: [
            {
                cash_advance_detail_start_date: "",
                cash_advance_detail_end_date: "",
                cash_advance_detail_purpose: "",
                cash_advance_detail_relation_name: "",
                cash_advance_detail_relation_position: "",
                cash_advance_detail_relation_organization_id: "",
                cash_advance_detail_location: "",
                cash_advance_detail_amount: "",
                cash_advance_detail_document_id: [],
                cash_advance_detail_note: "",
                cash_advance_detail_cost_classification: "",
                cash_advance_detail_amount_approve: "",
                cash_advance_detail_remarks: "",
            },
        ],
    });

    // Handle Success Start
    const [isSuccess, setIsSuccess] = useState<string>("");

    const handleSuccess = (message: string) => {
        setIsSuccess("");
        reset();
        setData({
            cash_advance_id: "",
            cash_advance_used_by: "",
            cash_advance_requested_by: "",
            cash_advance_division: "",
            cash_advance_cost_center: "",
            cash_advance_branch: "",
            cash_advance_first_approval_by: "",
            cash_advance_request_note: "",
            cash_advance_delivery_method_transfer: "",
            cash_advance_transfer_amount: "",
            cash_advance_delivery_method_cash: "",
            cash_advance_cash_amount: "",
            cash_advance_total_amount: "",
            cash_advance_total_amount_request: "",
            cash_advance_transfer_date: "",
            cash_advance_to_bank_account: "",
            cash_advance_receive_date: "",
            cash_advance_receive_name: "",
            amount_approve: "",
            type: "",
            amount: "",
            method: "",
            transaction_date: "",
            proof_of_document: [],
            CashAdvanceDetail: [
                {
                    cash_advance_detail_start_date: "",
                    cash_advance_detail_end_date: "",
                    cash_advance_detail_purpose: "",
                    cash_advance_detail_relation_name: "",
                    cash_advance_detail_relation_position: "",
                    cash_advance_detail_relation_organization_id: "",
                    cash_advance_detail_location: "",
                    cash_advance_detail_amount: "",
                    cash_advance_detail_document_id: [],
                    cash_advance_detail_note: "",
                    cash_advance_detail_cost_classification: "",
                    cash_advance_detail_amount_approve: "",
                    cash_advance_detail_remarks: "",
                },
            ],
        });

        setIsSuccess(message[0]);

        getCANumber();
        getCARequestStatus();
        getCAApprove1Status();
        getCAApprove2Status();
        getCAApprove3Status();
        getCAPendingReportStatus();
        getCANeedRevisionStatus();
        getCARejectStatus();
        getCAReportRejectStatus();
        getCAReportRequestStatus();
        getCAReportApprove1Status();
        getCAReportApprove2Status();
        getCAReportApprove3Status();
        getCAReportNeedRevisionStatus();
        getCAReportRejectStatus();
        getEmployeeBankAccount();
        getCompanies();
        getCADifference();
        getCAApproval();
        getCAMethod();
        setTimeout(() => {
            setIsSuccess("");
        }, 5000);

        setRefreshSuccess("success");
        setTimeout(() => {
            setRefreshSuccess("");
        }, 1000);
    };
    // Handle Success End

    // Handle Add Row Start
    const [DataRow, setDataRow] = useState<any>([
        {
            cash_advance_detail_start_date: "",
            cash_advance_detail_end_date: "",
            cash_advance_detail_purpose: "",
            cash_advance_detail_relation_name: "",
            cash_advance_detail_relation_position: "",
            cash_advance_detail_relation_organization_id: "",
            cash_advance_detail_location: "",
            cash_advance_detail_amount: "",
            cash_advance_detail_document_id: [],
            cash_advance_detail_note: "",
            cash_advance_detail_cost_classification: "",
            cash_advance_detail_amount_approve: "",
            cash_advance_detail_remarks: "",
        },
    ]);

    const handleAddRow = (e: FormEvent) => {
        e.preventDefault();
        setDataRow([
            ...DataRow,
            {
                cash_advance_detail_start_date: "",
                cash_advance_detail_end_date: "",
                cash_advance_detail_purpose: "",
                cash_advance_detail_relation_name: "",
                cash_advance_detail_relation_position: "",
                cash_advance_detail_relation_organization_id: "",
                cash_advance_detail_location: "",
                cash_advance_detail_amount: "",
                cash_advance_detail_document_id: [],
                cash_advance_detail_note: "",
                cash_advance_detail_cost_classification: "",
                cash_advance_detail_amount_approve: "",
                cash_advance_detail_remarks: "",
            },
        ]);

        setData("CashAdvanceDetail", [
            ...data.CashAdvanceDetail,
            {
                cash_advance_detail_start_date: "",
                cash_advance_detail_end_date: "",
                cash_advance_detail_purpose: "",
                cash_advance_detail_relation_name: "",
                cash_advance_detail_relation_position: "",
                cash_advance_detail_relation_organization_id: "",
                cash_advance_detail_location: "",
                cash_advance_detail_amount: "",
                cash_advance_detail_document_id: [],
                cash_advance_detail_note: "",
                cash_advance_detail_cost_classification: "",
                cash_advance_detail_amount_approve: "",
                cash_advance_detail_remarks: "",
            },
        ]);
    };
    // Handle Add Row End

    // Handle Change Add Start
    const handleChangeAdd = (e: any, i: number) => {
        const { name, value } = e.target;

        const onchangeVal: any = [...data.CashAdvanceDetail];

        onchangeVal[i][name] = value;

        setDataRow(onchangeVal);

        setData("CashAdvanceDetail", onchangeVal);
    };
    // Handle Change Add End

    // Handle Change Add Custom Start
    const handleChangeAddCustom = (value: any, name: any, i: number) => {
        const onchangeVal: any = [...data.CashAdvanceDetail];

        onchangeVal[i][name] = value;

        setDataRow(onchangeVal);

        setData("CashAdvanceDetail", onchangeVal);
    };
    // Handle Change Add Custom End

    // Handle Change Add Date Start
    const handleChangeAddDate = (date: any, name: any, i: number) => {
        const onchangeVal: any = [...data.CashAdvanceDetail];

        onchangeVal[i][name] = date.toLocaleDateString("en-CA");

        setDataRow(onchangeVal);

        setData("CashAdvanceDetail", onchangeVal);
    };
    // Handle Change Add Date End

    // Handle Remove Row Start
    const handleRemoveRow = (i: number) => {
        const deleteRow = [...data.CashAdvanceDetail];

        deleteRow.splice(i, 1);

        setDataRow(deleteRow);

        setData("CashAdvanceDetail", deleteRow);
    };
    // Handle Remove Row End

    const [dataById, setDataById] = useState<any>({
        CASH_ADVANCE_REQUEST_NOTE: "",
        deletedRow: [],
        cash_advance_detail: [
            {
                CASH_ADVANCE_DETAIL_ID: "",
                CASH_ADVANCE_DETAIL_PURPOSE: "",
                CASH_ADVANCE_DETAIL_LOCATION: "",
                CASH_ADVANCE_DETAIL_AMOUNT: "",
                CASH_ADVANCE_DETAIL_NOTE: "",
                CASH_ADVANCE_DETAIL_DOCUMENT_ID: "",
                cash_advance_detail_document_id: "",
            },
        ],
    });

    // Handle Add Row Files Start
    const [DataFilesRow, setDataFilesRow] = useState<any>({
        cash_advance_detail_start_date: "",
        cash_advance_detail_end_date: "",
        cash_advance_detail_purpose: "",
        cash_advance_detail_relation_name: "",
        cash_advance_detail_relation_position: "",
        cash_advance_detail_relation_organization_id: "",
        cash_advance_detail_location: "",
        cash_advance_detail_amount: "",
        cash_advance_detail_document_id: [],
        cash_advance_detail_note: "",
        cash_advance_detail_cost_classification: "",
        cash_advance_detail_amount_approve: "",
        cash_advance_detail_remarks: "",
    });

    const handleAddRowFiles = (e: FormEvent) => {
        e.preventDefault();

        const CashAdvanceDetail: any = [...data.CashAdvanceDetail];

        CashAdvanceDetail[modalFiles.index].cash_advance_detail_document_id = [
            ...CashAdvanceDetail[modalFiles.index]
                .cash_advance_detail_document_id,
            {
                cash_advance_detail_document_id: "",
            },
        ];

        setDataFilesRow({
            ...DataFilesRow,
            cash_advance_detail_document_id: [
                ...DataFilesRow.cash_advance_detail_document_id,
                {
                    cash_advance_detail_document_id: "",
                },
            ],
        });

        setData({
            ...data,
            CashAdvanceDetail: CashAdvanceDetail,
        });
    };

    // Handle Add Row Files Start
    const handleChangeAddFiles = (e: any, i: number) => {
        const { name, files } = e.target;

        const onchangeFile: any = [
            ...DataFilesRow.cash_advance_detail_document_id,
        ];
        const onchangeFileData: any = [...data.CashAdvanceDetail];

        onchangeFile[i][name] = files[0];
        onchangeFileData[modalFiles.index][name][i] = files[0];

        setData("CashAdvanceDetail", onchangeFileData);

        setDataFilesRow({
            ...DataFilesRow,
            cash_advance_detail_document_id: onchangeFile,
        });
    };
    // Handle Add Row Files End

    // Handle Remove Files Row Start
    const handleRemoveFilesRow = (e: any, i: number) => {
        e.preventDefault();

        const deleteFilesRow = [
            ...DataFilesRow.cash_advance_detail_document_id,
        ];

        const deleteFilesData: any = [...data.CashAdvanceDetail];

        deleteFilesRow.splice(i, 1);

        deleteFilesData[
            modalFiles.index
        ].cash_advance_detail_document_id.splice(i, 1);

        setDataFilesRow({
            ...DataFilesRow,
            cash_advance_detail_document_id: deleteFilesRow,
        });

        setData({ ...data, CashAdvanceDetail: deleteFilesData });
    };
    // Handle Remove Files Row End

    // Handle Add Row Files Report Start
    const [DataFilesReportRow, setDataFilesReportRow] = useState<any>({
        cash_advance_detail_start_date: "",
        cash_advance_detail_end_date: "",
        cash_advance_detail_purpose: "",
        cash_advance_detail_relation_name: "",
        cash_advance_detail_relation_position: "",
        cash_advance_detail_relation_organization_id: "",
        cash_advance_detail_location: "",
        cash_advance_detail_amount: "",
        cash_advance_detail_document_id: [],
        cash_advance_detail_note: "",
        cash_advance_detail_cost_classification: "",
        cash_advance_detail_amount_approve: "",
        cash_advance_detail_remarks: "",
    });

    const handleAddRowFilesReport = (e: FormEvent) => {
        e.preventDefault();

        const CashAdvanceDetail: any = [...dataCAReport.CashAdvanceDetail];

        CashAdvanceDetail[modalFiles.index].cash_advance_detail_document_id = [
            ...CashAdvanceDetail[modalFiles.index]
                .cash_advance_detail_document_id,
            {
                cash_advance_detail_document_id: "",
            },
        ];

        // setDataFilesReportRow({
        //     ...DataFilesReportRow,
        //     cash_advance_detail_document_id: [
        //         ...DataFilesReportRow.cash_advance_detail_document_id,
        //         {
        //             cash_advance_detail_document_id: ""
        //         }
        //     ]
        // });

        setDataCAReport({
            ...dataCAReport,
            CashAdvanceDetail: CashAdvanceDetail,
        });
    };

    // Handle Add Row Files Report Start
    const handleChangeAddFilesReport = (e: any, i: number) => {
        const { name, files } = e.target;

        // const onchangeFile: any = [...DataFilesReportRow.cash_advance_detail_document_id];
        const onchangeFileData: any = [...dataCAReport.CashAdvanceDetail];

        // onchangeFile[i][name] = files[0];
        onchangeFileData[modalFiles.index][name][i] = files[0];

        setDataCAReport({
            ...dataCAReport,
            CashAdvanceDetail: onchangeFileData,
        });

        // setDataFilesReportRow({...DataFilesReportRow, cash_advance_detail_document_id: onchangeFile});
    };
    // Handle Add Row Files End

    // Handle Remove Files Report Row Start
    const handleRemoveFilesReportRow = (e: any, i: number) => {
        e.preventDefault();

        // const deleteFilesRow = [...DataFilesReportRow.cash_advance_detail_document_id];

        const deleteFilesData: any = [...dataCAReport.CashAdvanceDetail];

        // deleteFilesRow.splice(i, 1);

        deleteFilesData[
            modalFiles.index
        ].cash_advance_detail_document_id.splice(i, 1);

        // setDataFilesReportRow({...DataFilesReportRow, cash_advance_detail_document_id: deleteFilesRow});

        setDataCAReport({
            ...dataCAReport,
            CashAdvanceDetail: deleteFilesData,
        });
    };
    // Handle Remove Files Report Row End

    // Handle Add Row Proof of Document Start
    const handleAddRowProofOfDocument = (e: FormEvent) => {
        e.preventDefault();

        setDataCAReport({
            ...dataCAReport,
            proof_of_document: [
                ...dataCAReport.proof_of_document,
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

        const onchangeFileData: any = [...dataCAReport.proof_of_document];

        onchangeFileData[i][name] = files[0];

        setDataCAReport({
            ...dataCAReport,
            proof_of_document: onchangeFileData,
        });
    };
    // Handle Change Row Proof of Document End

    // Handle Remove Row Proof of Document Row Start
    const handleRemoveProofOfDocument = (e: any, i: number) => {
        e.preventDefault();

        const deleteFilesData: any = [...dataCAReport.proof_of_document];

        deleteFilesData.splice(i, 1);

        setDataCAReport({
            ...dataCAReport,
            proof_of_document: deleteFilesData,
        });
    };
    // Handle Remove Row Proof of Document Row End

    // Handle Add Row Revised Start
    const handleAddRowRevised = (e: any) => {
        setDataById({
            ...dataById,
            cash_advance_detail: [
                ...dataById.cash_advance_detail,
                {
                    CASH_ADVANCE_DETAIL_AMOUNT: "",
                    CASH_ADVANCE_DETAIL_DOCUMENT_ID: "",
                    CASH_ADVANCE_DETAIL_END_DATE: "",
                    CASH_ADVANCE_DETAIL_ID: "",
                    CASH_ADVANCE_DETAIL_LOCATION: "",
                    CASH_ADVANCE_DETAIL_NOTE: "",
                    CASH_ADVANCE_DETAIL_PURPOSE: "",
                    CASH_ADVANCE_DETAIL_RELATION_NAME: "",
                    CASH_ADVANCE_DETAIL_RELATION_ORGANIZATION_ID: "",
                    CASH_ADVANCE_DETAIL_RELATION_POSITION: "",
                    CASH_ADVANCE_DETAIL_START_DATE: "",
                    CASH_ADVANCE_DETAIL_STATUS: "",
                    CASH_ADVANCE_ID: "",
                },
            ],
        });
    };
    // Handle Add Row Revised End

    // Handle Change Approve Start
    const handleChangeApprove = (e: any, i: number) => {
        const { name, value } = e.target;

        const onchangeVal: any = [...dataById.cash_advance_detail];

        onchangeVal[i][name] = value;

        setDataById({ ...dataById, cash_advance_detail: onchangeVal });
    };
    // Handle Change Approve End

    // Handle Change Revised Start
    const handleChangeRevised = (e: any, i: number) => {
        const { name, value } = e.target;

        const onchangeVal: any = [...dataById.cash_advance_detail];

        onchangeVal[i][name] = value;

        setDataById({ ...dataById, cash_advance_detail: onchangeVal });
    };
    // Handle Change Revised End

    // Handle Change Revised Custom Start
    const handleChangeRevisedCustom = (value: any, name: any, i: number) => {
        const onchangeVal: any = [...dataById.cash_advance_detail];

        onchangeVal[i][name] = value;

        setDataById({ ...dataById, cash_advance_detail: onchangeVal });
    };
    // Handle Change Revised Custom End

    // Handle Change Revised Custom Start
    const handleChangeRevisedDate = (value: any, name: any, i: number) => {
        const onchangeVal: any = [...dataById.cash_advance_detail];

        onchangeVal[i][name] = value.toLocaleDateString("en-CA");

        setDataById({ ...dataById, cash_advance_detail: onchangeVal });
    };
    // Handle Change Revised Custom End

    // Handle Remove Row Revised Start
    const handleRemoveRowRevised = (
        i: number,
        cash_advance_detail_id: number
    ) => {
        const deleteRow = [...dataById.cash_advance_detail];

        deleteRow.splice(i, 1);

        setDataById({
            ...dataById,
            cash_advance_detail: deleteRow,
            deletedRow: [
                ...(dataById.deletedRow || []),
                {
                    CASH_ADVANCE_DETAIL_ID: cash_advance_detail_id,
                },
            ],
        });
    };
    // Handle Remove Row Revised End

    // Handle Add Row Revised Files Start
    const handleAddRowRevisedFiles = (cash_advance_detail_id: number) => {
        const addFiles = [...dataById.cash_advance_detail];

        addFiles[modalFiles.index_show_revised].filesDocument = [
            ...(addFiles[modalFiles.index_show_revised].filesDocument || []),
            {
                CASH_ADVANCE_DETAIL_DOCUMENT: "",
                CASH_ADVANCE_DETAIL_ID: cash_advance_detail_id,
            },
        ];

        setDataById({
            ...dataById,
            cash_advance_detail: addFiles,
        });
    };
    // Handle Add Row Revised Files End

    // Handle Change Revised Files Start
    const handleChangeRevisedFiles = (e: any, i: number) => {
        const { name, files } = e.target;

        const onchangeFileData: any = [...dataById.cash_advance_detail];

        onchangeFileData[modalFiles.index_show_revised].filesDocument[i][name] =
            files[0];

        setDataById({ ...dataById, cash_advance_detail: onchangeFileData });
    };
    // Handle Change Revised Files End

    // Handle Remove Row Revised Files Start
    const handleRemoveRowRevisedFiles = (e: any, i: number) => {
        const deleteRow = [...dataById.cash_advance_detail];

        deleteRow[modalFiles.index_show_revised].filesDocument.splice(i, 1);

        setDataById({ ...dataById, cash_advance_detail: deleteRow });
    };
    // Handle Remove Row Revised Files End

    // Handle Remove Row Revised Show Files Start
    const handleRemoveRowRevisedShowFiles = (
        i: number,
        document_id: number,
        cash_advance_detail_id: number
    ) => {
        const deleteRow = [...dataById.cash_advance_detail];

        deleteRow[modalFiles.index_show_revised].m_cash_advance_document.splice(
            i,
            1
        );

        setDataById({
            ...dataById,
            cash_advance_detail: deleteRow,
            deletedDocument: [
                ...(dataById.deletedDocument || []),
                {
                    DOCUMENT_ID: document_id,
                    CASH_ADVANCE_DETAIL_ID: cash_advance_detail_id,
                },
            ],
        });
    };
    // Handle Remove Row Revised Show Files End

    // Handle Add Row Report CA Start
    const [DataReportRow, setDataReportRow] = useState<any>([
        {
            cash_advance_detail_start_date: "",
            cash_advance_detail_end_date: "",
            cash_advance_detail_purpose: "",
            cash_advance_detail_relation_name: "",
            cash_advance_detail_relation_position: "",
            cash_advance_detail_relation_organization_id: "",
            cash_advance_detail_location: "",
            cash_advance_detail_amount: "",
            cash_advance_detail_document_id: [],
            cash_advance_detail_note: "",
            cash_advance_detail_cost_classification: "",
            cash_advance_detail_amount_approve: "",
            cash_advance_detail_remarks: "",
        },
    ]);

    const handleAddReportRow = (e: FormEvent) => {
        e.preventDefault();

        setDataReportRow([
            ...DataReportRow,
            {
                cash_advance_detail_start_date: "",
                cash_advance_detail_end_date: "",
                cash_advance_detail_purpose: "",
                cash_advance_detail_relation_name: "",
                cash_advance_detail_relation_position: "",
                cash_advance_detail_relation_organization_id: "",
                cash_advance_detail_location: "",
                cash_advance_detail_amount: "",
                cash_advance_detail_document_id: [],
                cash_advance_detail_note: "",
                cash_advance_detail_cost_classification: "",
                cash_advance_detail_amount_approve: "",
                cash_advance_detail_remarks: "",
            },
        ]);

        setData("CashAdvanceDetail", [
            ...data.CashAdvanceDetail,
            {
                cash_advance_detail_start_date: "",
                cash_advance_detail_end_date: "",
                cash_advance_detail_purpose: "",
                cash_advance_detail_relation_name: "",
                cash_advance_detail_relation_position: "",
                cash_advance_detail_relation_organization_id: "",
                cash_advance_detail_location: "",
                cash_advance_detail_amount: "",
                cash_advance_detail_document_id: [],
                cash_advance_detail_note: "",
                cash_advance_detail_cost_classification: "",
                cash_advance_detail_amount_approve: "",
                cash_advance_detail_remarks: "",
            },
        ]);

        setDataCAReport({
            ...dataCAReport,
            CashAdvanceDetail: [
                ...dataCAReport.CashAdvanceDetail,
                {
                    cash_advance_detail_start_date: "",
                    cash_advance_detail_end_date: "",
                    cash_advance_detail_purpose: "",
                    cash_advance_detail_relation_name: "",
                    cash_advance_detail_relation_position: "",
                    cash_advance_detail_relation_organization_id: "",
                    cash_advance_detail_location: "",
                    cash_advance_detail_amount: "",
                    cash_advance_detail_document_id: [],
                    cash_advance_detail_note: "",
                    cash_advance_detail_cost_classification: "",
                    cash_advance_detail_amount_approve: "",
                    cash_advance_detail_remarks: "",
                },
            ],
        });
    };
    // Handle Add Row Report CA End

    // Handle Change Add Report CA Start
    const handleChangeAddReport = (e: any, i: number) => {
        const { name, value } = e.target;

        const onchangeVal: any = [...dataCAReport.CashAdvanceDetail];

        onchangeVal[i][name] = value;

        setDataReportRow(onchangeVal);

        setDataCAReport({ ...dataCAReport, CashAdvanceDetail: onchangeVal });
    };
    // Handle Change Add Report CA End

    // Handle Change Add Report Custom CA Start
    const handleChangeAddReportCustom = (value: any, name: any, i: number) => {
        const onchangeVal: any = [...dataCAReport.CashAdvanceDetail];

        onchangeVal[i][name] = value;

        setDataReportRow(onchangeVal);

        setDataCAReport({ ...dataCAReport, CashAdvanceDetail: onchangeVal });
    };
    // Handle Change Add Report Custom CA End

    // Handle Change Add Report Date CA Start
    const handleChangeAddReportDate = (date: any, name: any, i: number) => {
        const onchangeVal: any = [...dataCAReport.CashAdvanceDetail];

        onchangeVal[i][name] = date.toLocaleDateString("en-CA");

        setDataReportRow(onchangeVal);

        setDataCAReport({ ...dataCAReport, CashAdvanceDetail: onchangeVal });
    };
    // Handle Change Add Report Date CA End

    // Handle Remove Row Report CA Start
    const handleRemoveReportRow = (i: number) => {
        const deleteRow = [...dataCAReport.CashAdvanceDetail];

        deleteRow.splice(i, 1);

        setDataReportRow(deleteRow);

        setDataCAReport({ ...dataCAReport, CashAdvanceDetail: deleteRow });
    };
    // Handle Remove Row Report CA End

    // Handle Remove Row Revised Start
    const handleAddRowRevisedReport = (e: any) => {
        setDataReportById({
            ...dataReportById,
            cash_advance_detail_report: [
                ...dataReportById.cash_advance_detail_report,
                {
                    REPORT_CASH_ADVANCE_DETAIL_AMOUNT: "",
                    REPORT_CASH_ADVANCE_DETAIL_AMOUNT_APPROVE: "",
                    REPORT_CASH_ADVANCE_DETAIL_APPROVAL: "",
                    REPORT_CASH_ADVANCE_DETAIL_COST_CLASSIFICATION: "",
                    REPORT_CASH_ADVANCE_DETAIL_DOCUMENT_ID: "",
                    REPORT_CASH_ADVANCE_DETAIL_END_DATE: "",
                    REPORT_CASH_ADVANCE_DETAIL_ID: "",
                    REPORT_CASH_ADVANCE_DETAIL_LOCATION: "",
                    REPORT_CASH_ADVANCE_DETAIL_PURPOSE: "",
                    REPORT_CASH_ADVANCE_DETAIL_RELATION_NAME: "",
                    REPORT_CASH_ADVANCE_DETAIL_RELATION_ORGANIZATION_ID: "",
                    REPORT_CASH_ADVANCE_DETAIL_RELATION_POSITION: "",
                    REPORT_CASH_ADVANCE_DETAIL_REMARKS: "",
                    REPORT_CASH_ADVANCE_DETAIL_START_DATE: "",
                    REPORT_CASH_ADVANCE_ID: "",
                },
            ],
        });
    };
    // Handle Remove Row Revised End

    // Handle Change Approve Report Start
    const handleChangeApproveReport = (e: any, i: number) => {
        const { name, value } = e.target;

        const onchangeVal: any = [...dataReportById.cash_advance_detail_report];

        onchangeVal[i][name] = value;

        setDataReportById({
            ...dataReportById,
            cash_advance_detail_report: onchangeVal,
        });
    };
    // Handle Change Approve Report End

    // Handle Change Approve Custom Report Start
    const handleChangeApproveReportCustom = (
        value: any,
        name: any,
        i: number
    ) => {
        const onchangeVal: any = [...dataReportById.cash_advance_detail_report];

        onchangeVal[i][name] = value;

        setDataReportById({
            ...dataReportById,
            cash_advance_detail_report: onchangeVal,
        });
    };
    // Handle Change Approve Custom Report End

    // Handle Change Approval Report Start
    const handleChangeApprovalReport = (e: any, i: number) => {
        const { name, value } = e.target;

        const onchangeVal = [...dataReportById.cash_advance_detail_report];

        onchangeVal[i][name] = value;

        const ReimburseDetailAmountApprove = [...onchangeVal];

        ReimburseDetailAmountApprove[i][
            "REPORT_CASH_ADVANCE_DETAIL_AMOUNT_APPROVE"
        ] = onchangeVal[i]["REPORT_CASH_ADVANCE_DETAIL_AMOUNT"];

        if (parseInt(value, 10) === 1) {
            setDataReportById({
                ...dataReportById,
                cash_advance_detail_report: ReimburseDetailAmountApprove,
            });
        } else {
            onchangeVal[i]["REPORT_CASH_ADVANCE_DETAIL_AMOUNT_APPROVE"] = 0;
            setDataReportById({
                ...dataReportById,
                cash_advance_detail_report: onchangeVal,
            });
        }

        setDataReportById({
            ...dataReportById,
            cash_advance_detail_report: onchangeVal,
        });
    };
    // Handle Change Approval Report End

    // Handle Change Revised Report Start
    const handleChangeRevisedReport = (e: any, i: number) => {
        const { name, value } = e.target;

        const onchangeVal: any = [...dataReportById.cash_advance_detail_report];

        onchangeVal[i][name] = value;

        setDataReportById({
            ...dataReportById,
            cash_advance_detail_report: onchangeVal,
        });
    };
    // Handle Change Revised Report End

    // Handle Change Revised Report Custom Start
    const handleChangeRevisedReportCustom = (
        value: any,
        name: any,
        i: number
    ) => {
        const onchangeVal: any = [...dataReportById.cash_advance_detail_report];

        onchangeVal[i][name] = value;

        setDataReportById({
            ...dataReportById,
            cash_advance_detail_report: onchangeVal,
        });
    };
    // Handle Change Revised Report Custom End

    // Handle Change Revised Report Date Start
    const handleChangeRevisedReportDate = (date: any, name: any, i: number) => {
        const onchangeVal: any = [...dataReportById.cash_advance_detail_report];

        onchangeVal[i][name] = date.toLocaleDateString("en-CA");

        setDataReportById({
            ...dataReportById,
            cash_advance_detail_report: onchangeVal,
        });
    };
    // Handle Change Revised Report Date End

    // Handle Remove Row Revised Start
    const handleRemoveRowRevisedReport = (
        i: number,
        report_cash_advance_detail_id: number
    ) => {
        const deleteRow = [...dataReportById.cash_advance_detail_report];

        deleteRow.splice(i, 1);

        setDataReportById({
            ...dataReportById,
            cash_advance_detail_report: deleteRow,
            deletedRow: [
                ...(dataReportById.deletedRow || []),
                {
                    REPORT_CASH_ADVANCE_DETAIL_ID:
                        report_cash_advance_detail_id,
                },
            ],
        });
    };
    // Handle Remove Row Revised End

    // Handle Add Row Revised Files Report Start
    const handleAddRowRevisedFilesReport = (
        report_cash_advance_detail_id: number
    ) => {
        const addFiles = [...dataReportById.cash_advance_detail_report];

        addFiles[modalFiles.index_show_revised_report].filesDocument = [
            ...(addFiles[modalFiles.index_show_revised_report].filesDocument ||
                []),
            {
                REPORT_CASH_ADVANCE_DETAIL_DOCUMENT: "",
                REPORT_CASH_ADVANCE_DETAIL_ID: report_cash_advance_detail_id,
            },
        ];

        setDataReportById({
            ...dataReportById,
            cash_advance_detail_report: addFiles,
        });
    };
    // Handle Add Row Revised Files Report End

    // Handle Change Revised Files Report Start
    const handleChangeRevisedFilesReport = (e: any, i: number) => {
        const { name, files } = e.target;

        const onchangeFileData: any = [
            ...dataReportById.cash_advance_detail_report,
        ];

        onchangeFileData[modalFiles.index_show_revised_report].filesDocument[i][
            name
        ] = files[0];

        setDataReportById({
            ...dataReportById,
            cash_advance_detail_report: onchangeFileData,
        });
    };
    // Handle Change Revised Files Report End

    // Handle Remove Row Revised Files Report Start
    const handleRemoveRowRevisedFilesReport = (e: any, i: number) => {
        const deleteRow = [...dataReportById.cash_advance_detail_report];

        deleteRow[modalFiles.index_show_revised_report].filesDocument.splice(
            i,
            1
        );

        setDataReportById({
            ...dataReportById,
            cash_advance_detail_report: deleteRow,
        });
    };
    // Handle Remove Row Revised Files Report End

    // Handle Remove Row Revised Show Files Report Start
    const handleRemoveRowRevisedShowFilesReport = (
        i: number,
        document_id: number,
        report_cash_advance_detail_id: number
    ) => {
        const deleteRow = [...dataReportById.cash_advance_detail_report];

        deleteRow[
            modalFiles.index_show_revised_report
        ].m_cash_advance_report_document.splice(i, 1);

        setDataReportById({
            ...dataReportById,
            cash_advance_detail_report: deleteRow,
            deletedDocument: [
                ...(dataReportById.deletedDocument || []),
                {
                    DOCUMENT_ID: document_id,
                    REPORT_CASH_ADVANCE_DETAIL_ID:
                        report_cash_advance_detail_id,
                },
            ],
        });
    };
    // Handle Remove Row Revised Show Files Report End

    const [cashAdvance, setCA] = useState<any>([]);
    const [CANumber, setCANumber] = useState<any>([]);

    const getCANumber = async () => {
        await axios
            .get(`/getCANumber`)
            .then(function (response) {
                setCANumber(response.data);
                // console.log("xxx", response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    // Search Start
    // For refresh AG Grid data
    const [refreshSuccess, setRefreshSuccess] = useState<string>("");

    // Search Start
    const [searchCashAdvance, setSearchCashAdvance] = useState<any>({
        cash_advance_search: [
            {
                CASH_ADVANCE_ID: "",
                CASH_ADVANCE_NUMBER: "",
                CASH_ADVANCE_REQUESTED_BY: "",
                CASH_ADVANCE_DIVISION: "",
                CASH_ADVANCE_USED_BY: "",
                CASH_ADVANCE_START_DATE: "",
                CASH_ADVANCE_END_DATE: "",
                CASH_ADVANCE_COST_CENTER: "",
                CASH_ADVANCE_APPROVAL_STATUS: "",
                CASH_ADVANCE_TYPE: "",
                flag: "flag",
            },
        ],
    });

    // console.log("Search", searchCashAdvance);
    // Search End

    // OnChange Input Search Start
    const inputDataSearch = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...searchCashAdvance.cash_advance_search];
        changeVal[i][name] = value;
        setSearchCashAdvance({
            ...searchCashAdvance,
            cash_advance_search: changeVal,
        });
    };
    // OnChange Input Search End

    // Clear Search Start
    const clearSearchCashAdvance = () => {
        inputDataSearch("CASH_ADVANCE_ID", "", 0);
        inputDataSearch("CASH_ADVANCE_NUMBER", "", 0);
        inputDataSearch("CASH_ADVANCE_REQUESTED_BY", "", 0);
        inputDataSearch("CASH_ADVANCE_DIVISION", "", 0);
        inputDataSearch("CASH_ADVANCE_USED_BY", "", 0);
        inputDataSearch("CASH_ADVANCE_START_DATE", "", 0);
        inputDataSearch("CASH_ADVANCE_END_DATE", "", 0);
        inputDataSearch("CASH_ADVANCE_COST_CENTER", "", 0);
        inputDataSearch("CASH_ADVANCE_TYPE", "", 0);
        inputDataSearch("CASH_ADVANCE_APPROVAL_STATUS", "", 0);
        inputDataSearch("flag", "flag", 0);

        setRefreshSuccess("success");
        setTimeout(() => {
            setRefreshSuccess("");
        }, 1000);
    };

    // Data Start
    const {
        cash_advance_purpose,
        relations,
        coa,
        employees,
        office,
        division,
    }: any = usePage().props;
    // Data End

    const [getCountCARequestStatus, setCountCARequestStatus] = useState<any>(
        []
    );
    const getCARequestStatus = async () => {
        await axios
            .get(`/getCountCARequestStatus`)
            .then((res) => {
                setCountCARequestStatus(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [getCountCAApprove1Status, setCountCAApprove1Status] = useState<any>(
        []
    );
    const getCAApprove1Status = async () => {
        await axios
            .get(`/getCountCAApprove1Status`)
            .then((res) => {
                setCountCAApprove1Status(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [getCountCAApprove2Status, setCountCAApprove2Status] = useState<any>(
        []
    );
    const getCAApprove2Status = async () => {
        await axios
            .get(`/getCountCAApprove2Status`)
            .then((res) => {
                setCountCAApprove2Status(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [getCountCAApprove3Status, setCountCAApprove3Status] = useState<any>(
        []
    );
    const getCAApprove3Status = async () => {
        await axios
            .get(`/getCountCAApprove3Status`)
            .then((res) => {
                setCountCAApprove3Status(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [getCountCAPendingReportStatus, setCountCAPendingReportStatus] =
        useState<any>([]);
    const getCAPendingReportStatus = async () => {
        await axios
            .get(`/getCountCAPendingReportStatus`)
            .then((res) => {
                setCountCAPendingReportStatus(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [getCountCANeedRevisionStatus, setCountCANeedRevisionStatus] =
        useState<any>([]);
    const getCANeedRevisionStatus = async () => {
        await axios
            .get(`/getCountCANeedRevisionStatus`)
            .then((res) => {
                setCountCANeedRevisionStatus(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [getCountCARejectStatus, setCountCARejectStatus] = useState<any>([]);
    const getCARejectStatus = async () => {
        await axios
            .get(`/getCountCARejectStatus`)
            .then((res) => {
                setCountCARejectStatus(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [getCountCAReportRequestStatus, setCountCAReportRequestStatus] =
        useState<any>([]);
    const getCAReportRequestStatus = async () => {
        await axios
            .get(`/getCountCAReportRequestStatus`)
            .then((res) => {
                setCountCAReportRequestStatus(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [getCountCAReportApprove1Status, setCountCAReportApprove1Status] =
        useState<any>([]);
    const getCAReportApprove1Status = async () => {
        await axios
            .get(`/getCountCAReportApprove1Status`)
            .then((res) => {
                setCountCAReportApprove1Status(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [getCountCAReportApprove2Status, setCountCAReportApprove2Status] =
        useState<any>([]);
    const getCAReportApprove2Status = async () => {
        await axios
            .get(`/getCountCAReportApprove2Status`)
            .then((res) => {
                setCountCAReportApprove2Status(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [getCountCAReportApprove3Status, setCountCAReportApprove3Status] =
        useState<any>([]);
    const getCAReportApprove3Status = async () => {
        await axios
            .get(`/getCountCAReportApprove3Status`)
            .then((res) => {
                setCountCAReportApprove3Status(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [
        getCountCAReportNeedRevisionStatus,
        setCountCAReportNeedRevisionStatus,
    ] = useState<any>([]);
    const getCAReportNeedRevisionStatus = async () => {
        await axios
            .get(`/getCountCAReportNeedRevisionStatus`)
            .then((res) => {
                setCountCAReportNeedRevisionStatus(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [getCountCAReportRejectStatus, setCountCAReportRejectStatus] =
        useState<any>([]);
    const getCAReportRejectStatus = async () => {
        await axios
            .get(`/getCountCAReportRejectStatus`)
            .then((res) => {
                setCountCAReportRejectStatus(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [getCashAdvanceDifference, setCashAdvanceDifferents] = useState<any>(
        []
    );
    const getCADifference = async () => {
        await axios
            .get(`/getCashAdvanceDifference`)
            .then((res) => {
                setCashAdvanceDifferents(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [getCashAdvanceApproval, setCashAdvanceApproval] = useState<any>([]);
    const getCAApproval = async () => {
        await axios
            .get(`/getCashAdvanceApproval`)
            .then((res) => {
                setCashAdvanceApproval(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [getCashAdvanceMethod, setCashAdvanceMethod] = useState<any>([]);
    const getCAMethod = async () => {
        await axios
            .get(`/getCashAdvanceMethod`)
            .then((res) => {
                setCashAdvanceMethod(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [employeeBankAccount, setEmployeeBankAccount] = useState<any>([]);
    const getEmployeeBankAccount = async () => {
        await axios
            .get(`/getEmployeeBankAccount`)
            .then((res) => {
                setEmployeeBankAccount(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [companies, setCompanies] = useState<any>([]);
    const getCompanies = async () => {
        await axios
            .get(`/getCompanies`)
            .then((res) => {
                setCompanies(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // Handle Add Start
    const handleAddModal = async (
        e: FormEvent,
        transfer_method: number,
        cash_method: number
    ) => {
        e.preventDefault();

        setData({
            ...data,
            cash_advance_division:
                auth.user.employee?.division?.COMPANY_DIVISION_ID,
            cash_advance_requested_by: auth.user.employee?.EMPLOYEE_ID,
            cash_advance_delivery_method_transfer: transfer_method,
            cash_advance_delivery_method_cash: cash_method,
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
            view_report: false,
            approve_report: false,
            revised_report: false,
            execute_report: false,
        });
    };
    // Handle Add End

    // Handle Approve Start
    const handleApproveModal = async (e: FormEvent, id: number) => {
        e.preventDefault();

        await axios
            .get(`/getCAById/${id}`)
            .then((res) => {
                setDataById(res.data);
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
            view_report: false,
            approve_report: false,
            revised_report: false,
            execute_report: false,
        });
    };
    // Handle Approve End

    // Handle Revised Start
    const handleRevisedModal = async (e: FormEvent, id: number) => {
        e.preventDefault();

        await axios
            .get(`/getCAById/${id}`)
            .then((res) => {
                setDataById(res.data);
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
            view_report: false,
            approve_report: false,
            revised_report: false,
            execute_report: false,
        });
    };
    // Handle Revised End

    // Handle Execute Start
    const handleExecuteModal = async (e: FormEvent, id: number) => {
        e.preventDefault();

        await axios
            .get(`/getCAById/${id}`)
            .then((res) => {
                setDataById(res.data);
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
            approve: false,
            report: false,
            execute: !modal.execute,
            view_report: false,
            approve_report: false,
            revised_report: false,
            execute_report: false,
        });
    };
    // Handle Execute End

    // Handle Add Cash Advance Report Start
    const handleAddCAReportModal = async (
        e: FormEvent,
        id: number,
        division: number,
        cost_center: number,
        branch: number,
        used_by: number,
        requested_by: number,
        first_approval_by: number,
        total_amount: number
    ) => {
        e.preventDefault();

        setDataCAReport({
            ...dataCAReport,
            cash_advance_id: id,
            cash_advance_division: division,
            cash_advance_cost_center: cost_center,
            cash_advance_branch: branch,
            cash_advance_used_by: used_by,
            cash_advance_requested_by: requested_by,
            cash_advance_first_approval_by: first_approval_by,
            cash_advance_total_amount_request: total_amount,
        });

        await axios
            .get(`/getCAById/${id}`)
            .then((res) => {
                setDataById(res.data);
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
            approve: false,
            report: !modal.report,
            execute: false,
            view_report: false,
            approve_report: false,
            revised_report: false,
            execute_report: false,
        });
    };
    // Handle Add Cash Advance Report End

    // Handle Show Start
    const handleShowModal = async (data: any) => {
        await axios
            .get(`/getCAById/${data.CASH_ADVANCE_ID}`)
            .then((res) => {
                setDataById(res.data);
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
            view_report: false,
            approve_report: false,
            revised_report: false,
            execute_report: false,
        });
    };
    // Handle Show End

    const [dataReportById, setDataReportById] = useState<any>();

    // Handle Show Report Start
    const handleShowReportModal = async (e: FormEvent, id: number) => {
        e.preventDefault();

        await axios
            .get(`/getCAReportById/${id}`)
            .then((res) => {
                setDataReportById(res.data);
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
            approve: false,
            report: false,
            execute: false,
            view_report: !modal.view_report,
            approve_report: false,
            revised_report: false,
            execute_report: false,
        });
    };
    // Handle Show Report End

    // Handle Approve Report Start
    const handleApproveReportModal = async (e: FormEvent, id: number) => {
        e.preventDefault();

        await axios
            .get(`/getCAReportById/${id}`)
            .then((res) => {
                setDataReportById(res.data);
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
            approve: false,
            report: false,
            execute: false,
            view_report: false,
            approve_report: !modal.approve_report,
            revised_report: false,
            execute_report: false,
        });
    };
    // Handle Approve Report End

    // Handle Revised Report Start
    const handleRevisedReportModal = async (e: FormEvent, id: number) => {
        e.preventDefault();

        await axios
            .get(`/getCAReportById/${id}`)
            .then((res) => {
                setDataReportById(res.data);
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
            approve: false,
            report: false,
            execute: false,
            view_report: false,
            approve_report: false,
            revised_report: !modal.revised_report,
            execute_report: false,
        });
    };
    // Handle Revised Report End

    // Handle Execute Report Start
    const handleExecuteReportModal = async (e: FormEvent, id: number) => {
        e.preventDefault();

        setDataCAReport({ ...dataCAReport, cash_advance_id: id });

        await axios
            .get(`/getCAReportById/${id}`)
            .then((res) => {
                setDataReportById(res.data);
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
            approve: false,
            report: false,
            execute: false,
            view_report: false,
            approve_report: false,
            revised_report: false,
            execute_report: !modal.execute_report,
        });
    };
    // Handle Execute Report End

    const handleBtnStatus = async (status: number) => {
        setDataById({
            ...dataById,
            CASH_ADVANCE_FIRST_APPROVAL_STATUS: status,
        });

        if (auth.user.employee?.division?.COMPANY_DIVISION_ID === 132) {
            setDataById({
                ...dataById,
                CASH_ADVANCE_SECOND_APPROVAL_BY:
                    auth.user.employee?.EMPLOYEE_ID,
                CASH_ADVANCE_SECOND_APPROVAL_USER:
                    auth.user.employee?.EMPLOYEE_FIRST_NAME,
                CASH_ADVANCE_SECOND_APPROVAL_STATUS: status,
            });
        }

        if (auth.user.employee?.division?.COMPANY_DIVISION_ID === 122) {
            setDataById({
                ...dataById,
                CASH_ADVANCE_THIRD_APPROVAL_BY: auth.user.employee?.EMPLOYEE_ID,
                CASH_ADVANCE_THIRD_APPROVAL_USER:
                    auth.user.employee?.EMPLOYEE_FIRST_NAME,
                CASH_ADVANCE_THIRD_APPROVAL_STATUS: status,
            });
        }
    };

    const handleBtnReportStatus = async (status: number) => {
        setDataReportById({
            ...dataReportById,
            REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS: status,
        });

        if (auth.user.employee?.division?.COMPANY_DIVISION_ID === 132) {
            setDataReportById({
                ...dataReportById,
                REPORT_CASH_ADVANCE_SECOND_APPROVAL_BY:
                    auth.user.employee?.EMPLOYEE_ID,
                REPORT_CASH_ADVANCE_SECOND_APPROVAL_USER:
                    auth.user.employee?.EMPLOYEE_FIRST_NAME,
                REPORT_CASH_ADVANCE_SECOND_APPROVAL_STATUS: status,
            });
        }

        if (auth.user.employee?.division?.COMPANY_DIVISION_ID === 122) {
            setDataReportById({
                ...dataReportById,
                REPORT_CASH_ADVANCE_THIRD_APPROVAL_BY:
                    auth.user.employee?.EMPLOYEE_ID,
                REPORT_CASH_ADVANCE_THIRD_APPROVAL_USER:
                    auth.user.employee?.EMPLOYEE_FIRST_NAME,
                REPORT_CASH_ADVANCE_THIRD_APPROVAL_STATUS: status,
            });
        }
    };

    const handleFileDownload = async (
        cash_advance_detail_id: number,
        document_id: number
    ) => {
        await axios({
            url: `/cashAdvanceDownload/${cash_advance_detail_id}/${document_id}`,
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

    const handleFileReportDownload = async (
        cash_advance_detail_report_id: number,
        document_id: number
    ) => {
        await axios({
            url: `/cashAdvanceReportDownload/${cash_advance_detail_report_id}/${document_id}`,
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
        report_cash_advance_id: number,
        document_id: number
    ) => {
        await axios({
            url: `/cashAdvanceReportProofOfDocumentDownload/${report_cash_advance_id}/${document_id}`,
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

    // Function Format Currency
    const formatCurrency = new Intl.NumberFormat("default", {
        style: "currency",
        currency: "IDR",
    });
    // End Function Format Currency

    let total_amount = 0;

    DataRow.forEach((item: any) => {
        total_amount += Number(item.cash_advance_detail_amount);

        if (isNaN(total_amount)) {
            total_amount = 0;
        }
    });

    useEffect(() => {
        if (total_amount !== 0) {
            setData("cash_advance_transfer_amount", total_amount);
        }
    }, [total_amount]);

    useEffect(() => {
        setData({
            ...data,
            cash_advance_transfer_amount: 0,
            cash_advance_cash_amount: 0,
        });
    }, []);

    let total_amount_report = 0;

    DataReportRow.forEach((item: any) => {
        total_amount_report += Number(item.cash_advance_detail_amount);

        if (isNaN(total_amount_report)) {
            total_amount_report = 0;
        }
    });

    let revised_total_amount = 0;

    dataById.cash_advance_detail.forEach((item: any) => {
        revised_total_amount += Number(item.CASH_ADVANCE_DETAIL_AMOUNT);
        if (isNaN(revised_total_amount)) {
            revised_total_amount = 0;
        }
    });

    useEffect(() => {
        if (revised_total_amount !== 0) {
            setDataById({
                ...dataById,
                CASH_ADVANCE_TRANSFER_AMOUNT: revised_total_amount,
            });
        }
    }, []);

    let revised_total_amount_report = 0;

    dataReportById?.cash_advance_detail_report.forEach((item: any) => {
        revised_total_amount_report += Number(
            item.REPORT_CASH_ADVANCE_DETAIL_AMOUNT
        );
        if (isNaN(revised_total_amount_report)) {
            revised_total_amount_report = 0;
        }
    });

    let total_amount_approve = 0;

    dataReportById?.cash_advance_detail_report.forEach((item: any) => {
        total_amount_approve += Number(
            item.REPORT_CASH_ADVANCE_DETAIL_AMOUNT_APPROVE
        );
        if (isNaN(total_amount_approve)) {
            total_amount_approve = 0;
        }
    });

    useEffect(() => {
        const difference =
            total_amount_approve -
            dataReportById?.REPORT_CASH_ADVANCE_TOTAL_AMOUNT_REQUEST;

        if (dataReportById?.REPORT_CASH_ADVANCE_TOTAL_AMOUNT_REQUEST) {
            // console.log(difference);
            if (difference < 0) {
                setDataReportById({
                    ...dataReportById,
                    REPORT_CASH_ADVANCE_TYPE: 1,
                });
            } else if (difference > 0) {
                setDataReportById({
                    ...dataReportById,
                    REPORT_CASH_ADVANCE_TYPE: 2,
                });
            } else {
                setDataReportById({
                    ...dataReportById,
                    REPORT_CASH_ADVANCE_TYPE: 3,
                });
            }
        }
    }, [
        total_amount_approve,
        dataReportById?.REPORT_CASH_ADVANCE_TOTAL_AMOUNT_REQUEST,
    ]);

    const [checkedTransfer, setCheckedTransfer] = useState(true);
    const handleCheckedTransfer = (e: any) => {
        if (e.target.checked) {
            setData({
                ...data,
                cash_advance_delivery_method_transfer: 1,
            });
        } else {
            setData({
                ...data,
                cash_advance_delivery_method_transfer: 0,
                cash_advance_transfer_amount: 0,
            });
        }
        setCheckedTransfer(!checkedTransfer);
    };

    const [checkedCash, setCheckedCash] = useState(false);
    const handleCheckedCash = (e: any) => {
        if (e.target.checked) {
            setData({
                ...data,
                cash_advance_delivery_method_cash: 1,
            });
        } else {
            setData({
                ...data,
                cash_advance_delivery_method_cash: 0,
                cash_advance_cash_amount: 0,
            });
        }

        setCheckedCash(!checkedCash);
    };

    const [checkedTransferEdit, setCheckedTransferEdit] = useState(false);
    const handleCheckedTransferEdit = (e: any) => {
        if (e.target.checked) {
            setDataById({
                ...dataById,
                CASH_ADVANCE_DELIVERY_METHOD_TRANSFER: 1,
            });
            // console.log("Checked Transfer Kena", checkedTransferEdit);
        } else {
            setDataById({
                ...dataById,
                CASH_ADVANCE_DELIVERY_METHOD_TRANSFER: 0,
                CASH_ADVANCE_TRANSFER_AMOUNT: 0,
            });
            // console.log("Checked Transfer Gakena", checkedTransferEdit);
        }

        setCheckedTransferEdit(!checkedTransferEdit);
    };

    const [checkedCashEdit, setCheckedCashEdit] = useState(false);
    const handleCheckedCashEdit = (e: any) => {
        if (e.target.checked) {
            setDataById({
                ...dataById,
                CASH_ADVANCE_DELIVERY_METHOD_CASH: 1,
            });
            // console.log("Checked Cash Kena", checkedCashEdit);
        } else {
            setDataById({
                ...dataById,
                CASH_ADVANCE_DELIVERY_METHOD_CASH: 0,
                CASH_ADVANCE_CASH_AMOUNT: 0,
            });
            // console.log("Checked Cash Gakena", checkedCashEdit);
        }

        setCheckedCashEdit(!checkedCashEdit);
    };

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
                m.DIVISION_ID === data.cash_advance_cost_center.value &&
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
            data.cash_advance_cost_center?.value === 138
                ? m.DIVISION_ID === 123
                : m.DIVISION_ID === data.cash_advance_cost_center?.value &&
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

    const calculateBusinessDays = (startDate: any, endDate: any) => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            // console.error(
            //     "Invalid date in calculateBusinessDays:",
            //     startDate,
            //     endDate
            // );
            return 0;
        }

        let count = 0;
        const current = new Date(start);
        while (current <= end) {
            const day = current.getDay();
            if (day !== 0 && day !== 6) {
                // Skip Sundays (0) and Saturdays (6)
                count++;
            }
            current.setDate(current.getDate() + 1);
        }
        return count > 0 ? count - 1 : 0;
    };

    const calculateDate = (requestedDate: any) => {
        if (!requestedDate) {
            // console.error("Requested date is missing in params.data");
            return { textAlign: "center" };
        }

        const days = calculateBusinessDays(requestedDate, new Date());
        if (days > 3) {
            return {
                backgroundColor: "red",
                textAlign: "center",
            };
        } else if (days > 1) {
            return {
                backgroundColor: "yellow",
                textAlign: "center",
            };
        } else {
            return { textAlign: "center" };
        }
    };

    const handleSelectChange = (
        e: any,
        id: number,
        id_report: number,
        division: number,
        cost_center: number,
        branch: number,
        used_by: number,
        requested_by: number,
        approval: number,
        total_amount: number
    ) => {
        const selectedValue = e.target.value;

        if (selectedValue === "approve") {
            handleApproveModal(e, id);
        } else if (selectedValue === "revised") {
            handleRevisedModal(e, id);
        } else if (selectedValue === "execute") {
            handleExecuteModal(e, id);
        } else if (selectedValue === "createReport") {
            handleAddCAReportModal(
                e,
                id,
                division,
                cost_center,
                branch,
                used_by,
                requested_by,
                approval,
                total_amount
            );
        } else if (selectedValue === "detailReport") {
            handleShowReportModal(e, id_report);
        } else if (selectedValue === "approveReport") {
            handleApproveReportModal(e, id_report);
        } else if (selectedValue === "revisedReport") {
            handleRevisedReportModal(e, id_report);
        } else if (selectedValue === "executeReport") {
            handleExecuteReportModal(e, id_report);
        }
    };

    // console.log("Data Cash Advance", data);
    // console.log("Cash Advance", cashAdvance.data);
    // console.log("Data CA By Id", dataById);
    // console.log("Data CA Report", dataCAReport);
    // console.log("Data CA Report By Id", dataReportById);
    // console.log("Auth", auth.user);

    return (
        <AuthenticatedLayout user={auth.user} header={"Cash Advance"}>
            <Head title="Cash Advance" />

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
                        view_report: false,
                        approve_report: false,
                        revised_report: false,
                        execute_report: false,
                    })
                }
                title={"Add Cash Advance"}
                url={route("cashAdvance.store")}
                data={data}
                onSuccess={handleSuccess}
                buttonAddOns={null}
                body={
                    <>
                        <ModalToDocument
                            classPanel={
                                "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 sm:min-w-full lg:min-w-[35%]"
                            }
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
                            // panelWidth=""
                            body={
                                <>
                                    {data.CashAdvanceDetail[
                                        modalFiles.index
                                    ]?.cash_advance_detail_document_id.map(
                                        (val: any, i: number) => (
                                            <div
                                                className="grid grid-cols-12 my-2"
                                                key={i}
                                            >
                                                <div
                                                    className={`w-full col-span-11`}
                                                >
                                                    <InputLabel
                                                        htmlFor="files"
                                                        value="File"
                                                        className="mb-2"
                                                    />

                                                    {data.CashAdvanceDetail[
                                                        modalFiles.index
                                                    ]
                                                        .cash_advance_detail_document_id[
                                                        i
                                                    ]?.name ? (
                                                        <p>
                                                            {
                                                                data
                                                                    .CashAdvanceDetail[
                                                                    modalFiles
                                                                        .index
                                                                ]
                                                                    .cash_advance_detail_document_id[
                                                                    i
                                                                ]?.name
                                                            }
                                                        </p>
                                                    ) : (
                                                        <Input
                                                            name="cash_advance_detail_document_id"
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
                                                    className="text-center self-center bg-red-600 hover:bg-red-500 text-white mx-2 mt-8 py-1 rounded-lg"
                                                    onClick={(e) =>
                                                        handleRemoveFilesRow(
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
                                        className="text-sm cursor-pointer hover:underline mt-3"
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
                                    htmlFor="cash_advance_division"
                                    value="Division"
                                    className="mb-4"
                                />
                                <TextInput
                                    id="cash_advance_division"
                                    type="text"
                                    name="cash_advance_division"
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
                                    value={data.cash_advance_cost_center}
                                    onChange={(val: any) =>
                                        setData("cash_advance_cost_center", val)
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
                                    value={data.cash_advance_used_by}
                                    onChange={(val: any) =>
                                        setData("cash_advance_used_by", val)
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
                                    value={data.cash_advance_branch}
                                    onChange={(val: any) =>
                                        setData("cash_advance_branch", val)
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
                                    value={data.cash_advance_first_approval_by}
                                    onChange={(val: any) =>
                                        setData(
                                            "cash_advance_first_approval_by",
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
                                <thead className="">
                                    <tr className="bg-gray-2 text-center dark:bg-meta-4">
                                        <TH
                                            label="No."
                                            className="border px-3 py-2"
                                            rowSpan="2"
                                        />
                                        <TH
                                            label="Intended Activity"
                                            className="border px-3 py-2"
                                            colSpan="2"
                                        />
                                        <TH
                                            className="border px-3 py-2"
                                            rowSpan="2"
                                        >
                                            Purpose{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH
                                            label="Relation"
                                            className="border px-3 py-2"
                                            colSpan="3"
                                        />
                                        <TH
                                            className="border px-3 py-2"
                                            rowSpan="2"
                                        >
                                            Location{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH
                                            className="border px-3 py-2"
                                            rowSpan="2"
                                        >
                                            Amount{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH
                                            label="Document"
                                            className="border px-3 py-2"
                                            rowSpan="2"
                                        />
                                        {data.CashAdvanceDetail?.length > 1 && (
                                            <TH
                                                label="Action"
                                                className="border px-3 py-2"
                                                rowSpan="2"
                                            />
                                        )}
                                    </tr>
                                    <tr className="text-center">
                                        <TH
                                            className="border px-3 py-2"
                                            rowSpan="2"
                                        >
                                            Start Date{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH
                                            className="border px-3 py-2"
                                            rowSpan="2"
                                        >
                                            End Date{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
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
                                <tbody id="form_table">
                                    {data.CashAdvanceDetail?.map(
                                        (val: any, i: number) => (
                                            <tr className="text-center" key={i}>
                                                <TD className="border">
                                                    {i + 1}.
                                                </TD>
                                                <TD className="border">
                                                    <DatePicker
                                                        name="cash_advance_detail_start_date"
                                                        selected={
                                                            val.cash_advance_detail_start_date
                                                        }
                                                        onChange={(date: any) =>
                                                            handleChangeAddDate(
                                                                date,
                                                                "cash_advance_detail_start_date",
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
                                                    <DatePicker
                                                        name="cash_advance_detail_end_date"
                                                        selected={
                                                            val.cash_advance_detail_end_date
                                                        }
                                                        onChange={(date: any) =>
                                                            handleChangeAddDate(
                                                                date,
                                                                "cash_advance_detail_end_date",
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
                                                    <select
                                                        id="cash_advance_detail_purpose"
                                                        name="cash_advance_detail_purpose"
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                        required
                                                        onChange={(e) =>
                                                            handleChangeAdd(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                        value={
                                                            val.cash_advance_detail_purpose
                                                        }
                                                    >
                                                        <option value="">
                                                            -- Choose Purpose --
                                                        </option>
                                                        {cash_advance_purpose.map(
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
                                                        value={
                                                            val.cash_advance_detail_relation_organization_id
                                                        }
                                                        onChange={(val: any) =>
                                                            handleChangeAddCustom(
                                                                val,
                                                                "cash_advance_detail_relation_organization_id",
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
                                                        id="cash_advance_detail_relation_name"
                                                        type="text"
                                                        name="cash_advance_detail_relation_name"
                                                        value={
                                                            val.cash_advance_detail_relation_name
                                                        }
                                                        className="w-1/2"
                                                        autoComplete="off"
                                                        onChange={(e) =>
                                                            handleChangeAdd(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                    />
                                                </TD>
                                                <TD className="border">
                                                    <TextInput
                                                        id="cash_advance_detail_relation_position"
                                                        type="text"
                                                        name="cash_advance_detail_relation_position"
                                                        value={
                                                            val.cash_advance_detail_relation_position
                                                        }
                                                        className="w-1/2"
                                                        autoComplete="off"
                                                        onChange={(e) =>
                                                            handleChangeAdd(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                    />
                                                </TD>
                                                <TD className="border">
                                                    <TextInput
                                                        id="cash_advance_detail_location"
                                                        type="text"
                                                        name="cash_advance_detail_location"
                                                        value={
                                                            val.cash_advance_detail_location
                                                        }
                                                        className="w-1/2"
                                                        autoComplete="off"
                                                        onChange={(e) =>
                                                            handleChangeAdd(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                        required
                                                    />
                                                </TD>
                                                <TD className="border">
                                                    <CurrencyInput
                                                        id="cash_advance_detail_amount"
                                                        name="cash_advance_detail_amount"
                                                        value={
                                                            val.cash_advance_detail_amount
                                                        }
                                                        decimalScale={2}
                                                        decimalsLimit={2}
                                                        onValueChange={(
                                                            val: any
                                                        ) =>
                                                            handleChangeAddCustom(
                                                                val,
                                                                "cash_advance_detail_amount",
                                                                i
                                                            )
                                                        }
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                        required
                                                        placeholder="0.00"
                                                        autoComplete="off"
                                                    />
                                                </TD>
                                                <TD className="border">
                                                    <div className="">
                                                        <button
                                                            type="button"
                                                            className="bg-black hover:bg-slate-800 text-sm text-white py-2 px-3"
                                                            onClick={() => {
                                                                setModalFiles({
                                                                    add_files:
                                                                        true,
                                                                    show_files:
                                                                        false,
                                                                    add_files_report:
                                                                        false,
                                                                    show_files_report:
                                                                        false,
                                                                    index: i,
                                                                });
                                                            }}
                                                        >
                                                            {data
                                                                .CashAdvanceDetail[
                                                                i
                                                            ]
                                                                ?.cash_advance_detail_document_id
                                                                .length > 0
                                                                ? data
                                                                      .CashAdvanceDetail[
                                                                      i
                                                                  ]
                                                                      ?.cash_advance_detail_document_id
                                                                      ?.length +
                                                                  " Files"
                                                                : "Add Files"}
                                                        </button>
                                                    </div>
                                                </TD>
                                                {data.CashAdvanceDetail
                                                    ?.length > 1 && (
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
                                            colSpan={6}
                                        >
                                            TOTAL AMOUNT
                                        </TD>
                                        <TD className="font-bold">
                                            {formatCurrency.format(
                                                total_amount
                                            )}
                                        </TD>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        {/* Table form end */}

                        <div className="mt-10">
                            <fieldset className="bg-white pb-10 pt-5 rounded-lg border-2">
                                <legend className="ml-12 px-3 font-medium">
                                    Delivery Method
                                </legend>
                                <div className="mt-4 mx-5 space-y-5">
                                    <div className="relative flex items-start">
                                        <div className="flex h-9 items-center">
                                            <input
                                                id="transfer"
                                                name="transfer"
                                                type="checkbox"
                                                aria-describedby="transfer-description"
                                                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                                                defaultChecked={true}
                                                onChange={(e) =>
                                                    handleCheckedTransfer(e)
                                                }
                                            />
                                        </div>
                                        <div className="block md:flex w-full gap-4">
                                            <div className="ml-3 text-sm leading-9">
                                                <label
                                                    htmlFor="transfer"
                                                    className="font-medium text-gray-900"
                                                >
                                                    Transfer
                                                </label>
                                            </div>
                                            <CurrencyInput
                                                id="cash_advance_transfer_amount"
                                                name="cash_advance_transfer_amount"
                                                value={
                                                    data.cash_advance_transfer_amount
                                                }
                                                defaultValue={0}
                                                decimalScale={2}
                                                decimalsLimit={2}
                                                onValueChange={(val: any) =>
                                                    setData(
                                                        "cash_advance_transfer_amount",
                                                        val
                                                    )
                                                }
                                                className={`block w-full md:w-1/4 ml-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right ${
                                                    checkedTransfer === false &&
                                                    "bg-gray-100"
                                                }`}
                                                placeholder="0.00"
                                                autoComplete="off"
                                                disabled={!checkedTransfer}
                                            />
                                            <select
                                                id="cash_advance_to_bank_account"
                                                name="cash_advance_to_bank_account"
                                                className="block w-full md:w-2/6 ml-3 mt-5 md:mt-0 rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                onChange={(e) =>
                                                    setData(
                                                        "cash_advance_to_bank_account",
                                                        e.target.value
                                                    )
                                                }
                                                required={
                                                    data.cash_advance_delivery_method_transfer ===
                                                        1 && true
                                                }
                                            >
                                                <option value="">
                                                    -- Choose Bank Account --
                                                </option>
                                                {employeeBankAccount
                                                    .filter(
                                                        (m: any) =>
                                                            m.EMPLOYEE_ID ===
                                                            data
                                                                .cash_advance_used_by
                                                                .value
                                                    )
                                                    .map((account: any) => (
                                                        <option
                                                            key={
                                                                account.EMPLOYEE_BANK_ACCOUNT_ID
                                                            }
                                                            value={
                                                                account.EMPLOYEE_BANK_ACCOUNT_ID
                                                            }
                                                        >
                                                            {`${account?.employee.EMPLOYEE_FIRST_NAME} - ${account.EMPLOYEE_BANK_ACCOUNT_NAME} - ${account.EMPLOYEE_BANK_ACCOUNT_NUMBER}`}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="relative flex items-start">
                                        <div className="flex h-9 items-center">
                                            <input
                                                id="cash"
                                                name="cash"
                                                type="checkbox"
                                                aria-describedby="cash-description"
                                                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                                                onChange={(e) =>
                                                    handleCheckedCash(e)
                                                }
                                            />
                                        </div>
                                        <div className="block md:flex w-full">
                                            <div className="ml-3 text-sm leading-9">
                                                <label
                                                    htmlFor="cash"
                                                    className="font-medium text-gray-900"
                                                >
                                                    Cash
                                                </label>
                                            </div>
                                            <CurrencyInput
                                                id="cash_advance_cash_amount"
                                                name="cash_advance_cash_amount"
                                                value={
                                                    data.cash_advance_cash_amount
                                                }
                                                decimalScale={2}
                                                decimalsLimit={2}
                                                onValueChange={(val: any) =>
                                                    setData(
                                                        "cash_advance_cash_amount",
                                                        val
                                                    )
                                                }
                                                className={`block w-full md:w-1/4 ml-3 md:ml-12 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right ${
                                                    checkedCash === false &&
                                                    "bg-gray-100"
                                                }`}
                                                placeholder="0.00"
                                                autoComplete="off"
                                                disabled={!checkedCash}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                        </div>

                        <div className="w-full p-2 mt-5">
                            <InputLabel
                                htmlFor="cash_advance_request_note"
                                value="Note"
                                className="mb-2"
                            />
                            <Textarea
                                id="cash_advance_request_note"
                                name="cash_advance_request_note"
                                className="resize-none border-0 focus:ring-2 focus:ring-inset focus:ring-red-600"
                                rows={5}
                                value={data.cash_advance_request_note}
                                onChange={(e) =>
                                    setData(
                                        "cash_advance_request_note",
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
                        view_report: false,
                        approve_report: false,
                        revised_report: false,
                        execute_report: false,
                    })
                }
                title="Detail Cash Advance"
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
                            url={`/cashAdvanceDownload/${
                                dataById.cash_advance_detail[modalFiles.index]
                                    ?.CASH_ADVANCE_DETAIL_ID
                            }`}
                            data=""
                            method=""
                            onSuccess=""
                            headers={null}
                            submitButtonName=""
                            // panelWidth=""
                            body={
                                <>
                                    <div className="grid grid-cols-12 my-3">
                                        {dataById.cash_advance_detail[
                                            modalFiles.index_show
                                        ]?.m_cash_advance_document.map(
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
                                                            href={`/cashAdvanceDocReader/${
                                                                dataById
                                                                    .cash_advance_detail[
                                                                    modalFiles
                                                                        .index_show
                                                                ]
                                                                    .CASH_ADVANCE_DETAIL_ID
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
                                                                    .cash_advance_detail[
                                                                    modalFiles
                                                                        .index_show
                                                                ]
                                                                    .CASH_ADVANCE_DETAIL_ID,
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
                                    htmlFor="cashAdvanceNumber"
                                    value="CA Number"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="cashAdvanceNumber"
                                    type="text"
                                    name="cashAdvanceNumber"
                                    value={dataById.CASH_ADVANCE_NUMBER}
                                    className="bg-gray-100"
                                    autoComplete="cashAdvanceNumber"
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            CASH_ADVANCE_NUMBER: e.target.value,
                                        })
                                    }
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="tanggalPengajuan"
                                    value="Request Date"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="tanggalPengajuan"
                                    type="text"
                                    name="tanggalPengajuan"
                                    value={dateFormat(
                                        dataById.CASH_ADVANCE_REQUESTED_DATE,
                                        "dd-mm-yyyy"
                                    )}
                                    className="bg-gray-100"
                                    autoComplete="tanggalPengajuan"
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
                                    autoComplete="namaPengguna"
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            DIVISION: e.target.value,
                                        })
                                    }
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
                                        dataById?.division
                                            ?.COMPANY_DIVISION_ALIAS
                                    }
                                    className="bg-gray-100"
                                    autoComplete="divisi"
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            CASH_ADVANCE_DIVISION:
                                                e.target.value,
                                        })
                                    }
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
                                    autoComplete="namaPemberiApproval"
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            DIVISION: e.target.value,
                                        })
                                    }
                                    readOnly
                                />
                            </div>
                        </div>

                        {/* Table form start */}
                        <div className="max-w-full overflow-x-auto overflow-visible">
                            <table className="w-full divide-y divide-gray-300">
                                <thead className="bg-gray-100">
                                    <tr className="text-center text-gray-700 dark:bg-meta-4 leading-7">
                                        <TH
                                            label="No."
                                            className="border px-3 py-2"
                                            rowSpan="2"
                                        />
                                        <TH
                                            label="Intended Activity"
                                            className="border px-3 py-2"
                                            colSpan="2"
                                        />
                                        <TH
                                            label="Purpose"
                                            className="border px-3 py-2"
                                            rowSpan="2"
                                        />
                                        <TH
                                            label="Relation"
                                            className="border px-3 py-2"
                                            colSpan="3"
                                        />
                                        <TH
                                            label="Location"
                                            className="border px-3 py-2"
                                            rowSpan="2"
                                        />
                                        <TH
                                            label="Amount"
                                            className="border px-3 py-2"
                                            rowSpan="2"
                                        />
                                        <TH
                                            label="Document"
                                            className="border px-3 py-2"
                                            rowSpan="2"
                                        />
                                    </tr>
                                    <tr className="text-center text-gray-700 leading-7">
                                        <TH
                                            label="Start Date"
                                            className="border px-3 py-2"
                                        />
                                        <TH
                                            label="End Date"
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
                                <tbody id="form_table">
                                    {dataById.cash_advance_detail.map(
                                        (cad: any, i: number) => (
                                            <tr
                                                className="text-center text-gray-700 text-sm leading-7"
                                                key={i}
                                            >
                                                <TD className="border">
                                                    {i + 1}.
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {dateFormat(
                                                        cad.CASH_ADVANCE_DETAIL_START_DATE,
                                                        "dd-mm-yyyy"
                                                    )}
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {dateFormat(
                                                        cad.CASH_ADVANCE_DETAIL_END_DATE,
                                                        "dd-mm-yyyy"
                                                    )}
                                                </TD>
                                                <TD className="border px-3">
                                                    {
                                                        cad.purpose
                                                            ?.CASH_ADVANCE_PURPOSE
                                                    }
                                                </TD>
                                                <TD className="border px-3">
                                                    {cad.relation_organization
                                                        ? cad
                                                              .relation_organization
                                                              ?.RELATION_ORGANIZATION_NAME
                                                        : "-"}
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {cad.CASH_ADVANCE_DETAIL_RELATION_NAME
                                                        ? cad.CASH_ADVANCE_DETAIL_RELATION_NAME
                                                        : "-"}
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {cad.CASH_ADVANCE_DETAIL_RELATION_POSITION
                                                        ? cad.CASH_ADVANCE_DETAIL_RELATION_POSITION
                                                        : "-"}
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {
                                                        cad.CASH_ADVANCE_DETAIL_LOCATION
                                                    }
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {formatCurrency.format(
                                                        cad.CASH_ADVANCE_DETAIL_AMOUNT
                                                    )}
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {cad
                                                        ?.m_cash_advance_document
                                                        ?.length > 0 ? (
                                                        <button
                                                            type="button"
                                                            className="bg-black hover:bg-slate-800 text-sm text-white py-2 px-3"
                                                            onClick={() => {
                                                                setModalFiles({
                                                                    add_files:
                                                                        false,
                                                                    show_files:
                                                                        true,
                                                                    add_files_report:
                                                                        false,
                                                                    show_files_report:
                                                                        false,
                                                                    index: "",
                                                                    index_show:
                                                                        i,
                                                                    index_show_report:
                                                                        "",
                                                                });
                                                            }}
                                                        >
                                                            {
                                                                cad
                                                                    ?.m_cash_advance_document
                                                                    ?.length
                                                            }{" "}
                                                            Files
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
                                    <tr className="text-center text-black text-sm leading-7">
                                        <TD
                                            className="border text-right pr-5 py-2 font-bold"
                                            colSpan={8}
                                        >
                                            TOTAL AMOUNT
                                        </TD>
                                        <TD className="border py-2 font-bold">
                                            {formatCurrency.format(
                                                dataById.CASH_ADVANCE_TOTAL_AMOUNT
                                            )}
                                        </TD>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        {/* Table form end */}

                        <div className="mt-10">
                            <fieldset className="bg-white pb-10 pt-5 rounded-lg border-2">
                                <legend className="ml-12 px-3 font-medium">
                                    Delivery Method
                                </legend>
                                <div className="mt-4 mx-5 space-y-5">
                                    <div className="relative flex items-start">
                                        <div className="flex h-9 items-center">
                                            <input
                                                id="transfer"
                                                name="transfer"
                                                type="checkbox"
                                                aria-describedby="transfer-description"
                                                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                                                checked={
                                                    dataById.CASH_ADVANCE_DELIVERY_METHOD_TRANSFER ===
                                                        1 && true
                                                }
                                                readOnly
                                            />
                                        </div>
                                        <div className="block md:flex w-full gap-4">
                                            <div className="ml-3 text-sm leading-9">
                                                <label
                                                    htmlFor="transfer"
                                                    className="font-medium text-gray-900"
                                                >
                                                    Transfer
                                                </label>
                                            </div>
                                            <CurrencyInput
                                                id="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                name="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                value={
                                                    dataById.CASH_ADVANCE_TRANSFER_AMOUNT
                                                }
                                                decimalScale={2}
                                                decimalsLimit={2}
                                                className="block w-full md:w-1/4 ml-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                disabled
                                                placeholder="0.00"
                                            />
                                            <TextInput
                                                id="account_number"
                                                type="text"
                                                name="account_number"
                                                value={
                                                    dataById.bank_account
                                                        ? `${dataById.bank_account?.employee.EMPLOYEE_FIRST_NAME} - ${dataById.bank_account?.EMPLOYEE_BANK_ACCOUNT_NAME} - ${dataById.bank_account?.EMPLOYEE_BANK_ACCOUNT_NUMBER}`
                                                        : "-"
                                                }
                                                className="w-full md:w-1/4 ml-3 mt-5 md:mt-0"
                                                required
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="relative flex items-start">
                                        <div className="flex h-9 items-center">
                                            <input
                                                id="cash"
                                                name="cash"
                                                type="checkbox"
                                                aria-describedby="cash-description"
                                                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                                                checked={
                                                    dataById.CASH_ADVANCE_DELIVERY_METHOD_CASH ===
                                                        1 && true
                                                }
                                                readOnly
                                            />
                                        </div>
                                        <div className="block md:flex w-full">
                                            <div className="ml-3 text-sm leading-9">
                                                <label
                                                    htmlFor="cash"
                                                    className="font-medium text-gray-900"
                                                >
                                                    Cash
                                                </label>
                                            </div>
                                            <CurrencyInput
                                                id="CASH_ADVANCE_CASH_AMOUNT"
                                                name="CASH_ADVANCE_CASH_AMOUNT"
                                                value={
                                                    dataById.CASH_ADVANCE_CASH_AMOUNT
                                                }
                                                decimalScale={2}
                                                decimalsLimit={2}
                                                className="block w-full md:w-1/4 ml-3 md:ml-12 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                disabled
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                        </div>

                        <div className="w-full p-2 mt-5">
                            <InputLabel
                                htmlFor="cash_advance_request_note"
                                value="Note"
                                className="mb-2"
                            />
                            <Textarea
                                id="cash_advance_request_note"
                                name="cash_advance_request_note"
                                className="resize-none border-0 focus:ring-2 focus:ring-inset focus:ring-red-600"
                                rows={5}
                                value={dataById.CASH_ADVANCE_REQUEST_NOTE || ""}
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
                                                            dataById.CASH_ADVANCE_CREATED_AT,
                                                            "dd-mm-yyyy"
                                                        )}
                                                    </time>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                {dataById.CASH_ADVANCE_FIRST_APPROVAL_STATUS ===
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
                                                                dataById.CASH_ADVANCE_FIRST_APPROVAL_CHANGE_STATUS_DATE,
                                                                "dd-mm-yyyy"
                                                            )}
                                                        </time>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                )}
                                {dataById.CASH_ADVANCE_SECOND_APPROVAL_STATUS !==
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
                                                                dataById.CASH_ADVANCE_SECOND_APPROVAL_CHANGE_STATUS_DATE,
                                                                "dd-mm-yyyy"
                                                            )}
                                                        </time>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                )}
                                {dataById.CASH_ADVANCE_THIRD_APPROVAL_STATUS !==
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
                                                                dataById.CASH_ADVANCE_THIRD_APPROVAL_CHANGE_STATUS_DATE,
                                                                "dd-mm-yyyy"
                                                            )}
                                                        </time>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                )}
                                {dataById.CASH_ADVANCE_SECOND_APPROVAL_STATUS ===
                                    5 && (
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
                                                                dataById.CASH_ADVANCE_SECOND_APPROVAL_CHANGE_STATUS_DATE,
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
                        view_report: false,
                        approve_report: false,
                        revised_report: false,
                        execute_report: false,
                    })
                }
                title="Approve Cash Advance"
                url={`/cashAdvanceApprove`}
                data={dataById}
                method="patch"
                onSuccess={handleSuccess}
                headers={null}
                submitButtonName={""}
                body={
                    <>
                        <ModalToDocument
                            classPanel={
                                "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 sm:min-w-full lg:min-w-[35%]"
                            }
                            show={modalFiles.show_files}
                            closeable={true}
                            onClose={() => handleOnCloseModalFiles()}
                            title="Show Files"
                            url={`/cashAdvanceDownload/${
                                dataById.cash_advance_detail[modalFiles.index]
                                    ?.CASH_ADVANCE_DETAIL_ID
                            }`}
                            data=""
                            method=""
                            onSuccess=""
                            headers={null}
                            submitButtonName=""
                            // panelWidth=""
                            body={
                                <>
                                    <div className="grid grid-cols-12 my-3">
                                        {dataById.cash_advance_detail[
                                            modalFiles.index_show
                                        ]?.m_cash_advance_document.map(
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
                                                            href={`/cashAdvanceDocReader/${
                                                                dataById
                                                                    .cash_advance_detail[
                                                                    modalFiles
                                                                        .index_show
                                                                ]
                                                                    .CASH_ADVANCE_DETAIL_ID
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
                                                                    .cash_advance_detail[
                                                                    modalFiles
                                                                        .index_show
                                                                ]
                                                                    .CASH_ADVANCE_DETAIL_ID,
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
                                    htmlFor="cashAdvanceNumber"
                                    value="CA Number"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="cashAdvanceNumber"
                                    type="text"
                                    name="cashAdvanceNumber"
                                    value={dataById.CASH_ADVANCE_NUMBER}
                                    className="bg-gray-100"
                                    autoComplete="cashAdvanceNumber"
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            CASH_ADVANCE_NUMBER: e.target.value,
                                        })
                                    }
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="tanggalPengajuan"
                                    value="Request Date"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="tanggalPengajuan"
                                    type="text"
                                    name="tanggalPengajuan"
                                    value={dateFormat(
                                        dataById.CASH_ADVANCE_REQUESTED_DATE,
                                        "dd-mm-yyyy"
                                    )}
                                    className="bg-gray-100"
                                    autoComplete="tanggalPengajuan"
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
                                    autoComplete="namaPengguna"
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            DIVISION: e.target.value,
                                        })
                                    }
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
                                        dataById?.division
                                            ?.COMPANY_DIVISION_ALIAS
                                    }
                                    className="bg-gray-100"
                                    autoComplete="divisi"
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            CASH_ADVANCE_DIVISION:
                                                e.target.value,
                                        })
                                    }
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
                                    autoComplete="namaPemberiApproval"
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            DIVISION: e.target.value,
                                        })
                                    }
                                    readOnly
                                />
                            </div>
                        </div>

                        {/* Table form start */}
                        <div className="max-w-full overflow-x-auto overflow-visible">
                            <table className="w-full divide-y divide-gray-300">
                                <thead className="bg-gray-100 leading-8">
                                    <tr className="text-center dark:bg-meta-4">
                                        <TH
                                            label="No."
                                            className="border px-3 py-2"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Intended Activity"
                                            className="border px-3 py-2"
                                            colSpan={2}
                                        />
                                        <TH
                                            label="Purpose"
                                            className="border px-3 py-2"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Relation"
                                            className="border px-3 py-2"
                                            colSpan={3}
                                        />
                                        <TH
                                            label="Location"
                                            className="border px-3 py-2"
                                            rowSpan={2}
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
                                            label="Note"
                                            className="border px-3 py-2"
                                            rowSpan={2}
                                        />
                                    </tr>
                                    <tr className="text-center">
                                        <TH
                                            label="Start Date"
                                            className="border px-3 py-2"
                                        />
                                        <TH
                                            label="End Date"
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
                                <tbody id="form_table">
                                    {dataById.cash_advance_detail.map(
                                        (cad: any, i: number) => (
                                            <tr
                                                className="text-center text-sm"
                                                key={i}
                                            >
                                                <TD className="border">
                                                    {i + 1 + "."}
                                                </TD>
                                                <TD className="border px-3">
                                                    {dateFormat(
                                                        cad.CASH_ADVANCE_DETAIL_START_DATE,
                                                        "dd-mm-yyyy"
                                                    )}
                                                </TD>
                                                <TD className="border px-3">
                                                    {dateFormat(
                                                        cad.CASH_ADVANCE_DETAIL_END_DATE,
                                                        "dd-mm-yyyy"
                                                    )}
                                                </TD>
                                                <TD className="border px-3">
                                                    {
                                                        cad.purpose
                                                            ?.CASH_ADVANCE_PURPOSE
                                                    }
                                                </TD>
                                                <TD className="border px-3">
                                                    {cad.relation_organization
                                                        ? cad
                                                              .relation_organization
                                                              ?.RELATION_ORGANIZATION_NAME
                                                        : "-"}
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {cad.CASH_ADVANCE_DETAIL_RELATION_NAME
                                                        ? cad.CASH_ADVANCE_DETAIL_RELATION_NAME
                                                        : "-"}
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {cad.CASH_ADVANCE_DETAIL_RELATION_POSITION
                                                        ? cad.CASH_ADVANCE_DETAIL_RELATION_POSITION
                                                        : "-"}
                                                </TD>
                                                <TD className="border px-3">
                                                    {
                                                        cad.CASH_ADVANCE_DETAIL_LOCATION
                                                    }
                                                </TD>
                                                <TD className="border px-3">
                                                    {formatCurrency.format(
                                                        cad.CASH_ADVANCE_DETAIL_AMOUNT
                                                    )}
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {cad
                                                        ?.m_cash_advance_document
                                                        ?.length > 0 ? (
                                                        <button
                                                            type="button"
                                                            className="bg-black hover:bg-slate-800 text-sm text-white py-2 px-3"
                                                            onClick={() => {
                                                                setModalFiles({
                                                                    add_files:
                                                                        false,
                                                                    show_files:
                                                                        true,
                                                                    add_files_report:
                                                                        false,
                                                                    show_files_report:
                                                                        false,
                                                                    index: "",
                                                                    index_show:
                                                                        i,
                                                                    index_show_report:
                                                                        "",
                                                                });
                                                            }}
                                                        >
                                                            {
                                                                cad
                                                                    ?.m_cash_advance_document
                                                                    ?.length
                                                            }{" "}
                                                            Files
                                                        </button>
                                                    ) : (
                                                        "-"
                                                    )}
                                                </TD>
                                                <TD className="border">
                                                    <div className="w-96 md:w-full">
                                                        <TextInput
                                                            id="CASH_ADVANCE_DETAIL_NOTE"
                                                            type="text"
                                                            name="CASH_ADVANCE_DETAIL_NOTE"
                                                            value={
                                                                cad.CASH_ADVANCE_DETAIL_NOTE ||
                                                                ""
                                                            }
                                                            className="w-1/2"
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
                                    <tr className="text-center text-black text-sm leading-7">
                                        <TD
                                            className="border text-right pr-5 py-2 font-bold"
                                            colSpan={8}
                                        >
                                            TOTAL AMOUNT
                                        </TD>
                                        <TD className="border text-center py-2 font-bold">
                                            {formatCurrency.format(
                                                dataById.CASH_ADVANCE_TOTAL_AMOUNT
                                            )}
                                        </TD>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        {/* Table form end */}

                        <div className="mt-10">
                            <fieldset className="bg-white pb-10 pt-5 rounded-lg border-2">
                                <legend className="ml-12 px-3 font-medium">
                                    Delivery Method
                                </legend>
                                <div className="mt-4 mx-5 space-y-5">
                                    <div className="relative flex items-start">
                                        <div className="flex h-9 items-center">
                                            <input
                                                id="transfer"
                                                name="transfer"
                                                type="checkbox"
                                                aria-describedby="transfer-description"
                                                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                                                defaultChecked={
                                                    dataById.CASH_ADVANCE_DELIVERY_METHOD_TRANSFER ===
                                                        1 && true
                                                }
                                                onChange={(e) =>
                                                    handleCheckedTransferEdit(e)
                                                }
                                            />
                                        </div>
                                        <div className="block md:flex w-full gap-4">
                                            <div className="ml-3 text-sm leading-9">
                                                <label
                                                    htmlFor="transfer"
                                                    className="font-medium text-gray-900"
                                                >
                                                    Transfer
                                                </label>
                                            </div>
                                            <CurrencyInput
                                                id="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                name="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                value={
                                                    dataById.CASH_ADVANCE_TRANSFER_AMOUNT
                                                }
                                                decimalScale={2}
                                                decimalsLimit={2}
                                                className={`block w-full md:w-1/4 ml-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right ${
                                                    dataById.CASH_ADVANCE_DELIVERY_METHOD_TRANSFER ===
                                                        0 && "bg-gray-100"
                                                }`}
                                                onValueChange={(val: any) =>
                                                    setDataById({
                                                        ...dataById,
                                                        CASH_ADVANCE_TRANSFER_AMOUNT:
                                                            val,
                                                    })
                                                }
                                                placeholder="0.00"
                                                autoComplete="off"
                                                disabled={
                                                    dataById.CASH_ADVANCE_DELIVERY_METHOD_TRANSFER ===
                                                        0 && true
                                                }
                                            />
                                            <select
                                                name=""
                                                id=""
                                                className="block w-full md:w-2/6 ml-3 mt-5 md:mt-0 rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                value={
                                                    dataById.CASH_ADVANCE_TO_BANK_ACCOUNT
                                                }
                                                onChange={(e) =>
                                                    setDataById({
                                                        ...dataById,
                                                        CASH_ADVANCE_TO_BANK_ACCOUNT:
                                                            e.target.value,
                                                    })
                                                }
                                                required={
                                                    dataById.CASH_ADVANCE_DELIVERY_METHOD_TRANSFER ===
                                                        1 && true
                                                }
                                            >
                                                <option value="">
                                                    -- Choose Bank Account --
                                                </option>
                                                {employeeBankAccount
                                                    .filter(
                                                        (m: any) =>
                                                            m.EMPLOYEE_ID ===
                                                            dataById
                                                                .employee_used_by
                                                                ?.EMPLOYEE_ID
                                                    )
                                                    .map((account: any) => (
                                                        <option
                                                            key={
                                                                account.EMPLOYEE_BANK_ACCOUNT_ID
                                                            }
                                                            value={
                                                                account.EMPLOYEE_BANK_ACCOUNT_ID
                                                            }
                                                        >
                                                            {account?.employee
                                                                .EMPLOYEE_FIRST_NAME +
                                                                " - " +
                                                                account.EMPLOYEE_BANK_ACCOUNT_NAME +
                                                                " - " +
                                                                account.EMPLOYEE_BANK_ACCOUNT_NUMBER}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="relative flex items-start">
                                        <div className="flex h-9 items-center">
                                            <input
                                                id="cash"
                                                name="cash"
                                                type="checkbox"
                                                aria-describedby="cash-description"
                                                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                                                defaultChecked={
                                                    dataById.CASH_ADVANCE_DELIVERY_METHOD_CASH ===
                                                        1 && true
                                                }
                                                onChange={(e) =>
                                                    handleCheckedCashEdit(e)
                                                }
                                            />
                                        </div>
                                        <div className="block md:flex w-full">
                                            <div className="ml-3 text-sm leading-9">
                                                <label
                                                    htmlFor="cash"
                                                    className="font-medium text-gray-900"
                                                >
                                                    Cash
                                                </label>
                                            </div>
                                            <CurrencyInput
                                                id="CASH_ADVANCE_CASH_AMOUNT"
                                                name="CASH_ADVANCE_CASH_AMOUNT"
                                                value={
                                                    dataById.CASH_ADVANCE_CASH_AMOUNT
                                                }
                                                decimalScale={2}
                                                decimalsLimit={2}
                                                className={`block w-full md:w-1/4 ml-3 md:ml-12 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right ${
                                                    dataById.CASH_ADVANCE_DELIVERY_METHOD_CASH ===
                                                        0 && "bg-gray-100"
                                                }`}
                                                onValueChange={(val: any) =>
                                                    setDataById({
                                                        ...dataById,
                                                        CASH_ADVANCE_CASH_AMOUNT:
                                                            val,
                                                    })
                                                }
                                                placeholder="0.00"
                                                autoComplete="off"
                                                disabled={
                                                    dataById.CASH_ADVANCE_DELIVERY_METHOD_CASH ===
                                                        0 && true
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                        </div>

                        <div className="w-full p-2 mt-5">
                            <InputLabel
                                htmlFor="cash_advance_request_note"
                                value="Note"
                                className="mb-2"
                            />
                            <Textarea
                                id="cash_advance_request_note"
                                name="cash_advance_request_note"
                                className="resize-none border-0 focus:ring-2 focus:ring-inset focus:ring-red-600"
                                rows={5}
                                value={dataById.CASH_ADVANCE_REQUEST_NOTE || ""}
                                readOnly
                            />
                        </div>

                        {/* <div className="p-2 my-5">
                            <table className="w-2/6 table-auto">
                                <thead>
                                    <tr>
                                        <TableTH
                                            label="STATUS"
                                            className="uppercase"
                                        />
                                    </tr>
                                    <tr>
                                        <TableTH
                                            label="Date & Time"
                                            className=""
                                        />
                                        <TableTH label="Name" className="" />
                                        <TableTH label="Status" className="" />
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <TableTD
                                            value={dateFormat(
                                                dataById.created_at,
                                                "dd-mm-yyyy HH:MM:ss"
                                            )}
                                            className="w-48 border-none"
                                        />
                                        <TableTD
                                            value={dataById.employee_used_by?.EMPLOYEE_FIRST_NAME}
                                            className="border-none"
                                        />
                                        <TableTD
                                            value="Created"
                                            className="border-none"
                                        />
                                    </tr>
                                </tbody>
                            </table>
                        </div> */}
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
                        view_report: false,
                        approve_report: false,
                        revised_report: false,
                        execute_report: false,
                    })
                }
                title="Revised Cash Advance"
                url={`/cashAdvanceRevised/${dataById.CASH_ADVANCE_ID}`}
                data={dataById}
                method="post"
                onSuccess={handleSuccess}
                headers={{ "Content-type": "multipart/form-data" }}
                submitButtonName={"Save"}
                body={
                    <>
                        <ModalToDocument
                            classPanel={
                                "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 sm:min-w-full lg:min-w-[35%]"
                            }
                            show={modalFiles.show_files_revised}
                            closeable={true}
                            onClose={() => handleOnCloseModalFiles()}
                            title="Show Files"
                            url={`/cashAdvanceDownload/${
                                dataById.cash_advance_detail[modalFiles.index]
                                    ?.CASH_ADVANCE_DETAIL_ID
                            }`}
                            data=""
                            method=""
                            onSuccess=""
                            headers={null}
                            submitButtonName=""
                            body={
                                <>
                                    <div className="grid grid-cols-12">
                                        {dataById.cash_advance_detail[
                                            modalFiles.index_show_revised
                                        ]?.m_cash_advance_document && (
                                            <>
                                                {dataById.cash_advance_detail[
                                                    modalFiles
                                                        .index_show_revised
                                                ]?.m_cash_advance_document.map(
                                                    (file: any, i: number) => (
                                                        <>
                                                            <div
                                                                className={`w-full col-span-11 my-2`}
                                                                key={i}
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
                                                                            .cash_advance_detail[
                                                                            modalFiles
                                                                                .index_show_revised
                                                                        ]
                                                                            .CASH_ADVANCE_DETAIL_ID
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

                                        {dataById.cash_advance_detail[
                                            modalFiles.index_show_revised
                                        ]?.filesDocument && (
                                            <>
                                                {dataById.cash_advance_detail[
                                                    modalFiles
                                                        .index_show_revised
                                                ]?.filesDocument.map(
                                                    (file: any, i: number) => (
                                                        <>
                                                            {file
                                                                .CASH_ADVANCE_DETAIL_DOCUMENT
                                                                ?.name ? (
                                                                <div
                                                                    className={`w-full col-span-11 my-2`}
                                                                    key={i}
                                                                >
                                                                    <InputLabel
                                                                        htmlFor="files"
                                                                        value="File"
                                                                        className="mb-2"
                                                                    />
                                                                    <p>
                                                                        {
                                                                            file
                                                                                ?.CASH_ADVANCE_DETAIL_DOCUMENT
                                                                                .name
                                                                        }
                                                                    </p>
                                                                </div>
                                                            ) : (
                                                                <div
                                                                    className={`w-full col-span-11 my-2`}
                                                                >
                                                                    <InputLabel
                                                                        htmlFor="files"
                                                                        value="File"
                                                                        className="mb-2"
                                                                    />
                                                                    <Input
                                                                        name="CASH_ADVANCE_DETAIL_DOCUMENT"
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
                                                                className="text-center self-center bg-red-600 hover:bg-red-500 text-white mx-2 mt-7 py-1 rounded-lg"
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
                                        className="text-sm cursor-pointer hover:underline mt-3"
                                        onClick={() =>
                                            handleAddRowRevisedFiles(
                                                dataById.cash_advance_detail[
                                                    modalFiles
                                                        .index_show_revised
                                                ].CASH_ADVANCE_DETAIL_ID
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
                                    htmlFor="cashAdvanceNumber"
                                    value="CA Number"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="cashAdvanceNumber"
                                    type="text"
                                    name="cashAdvanceNumber"
                                    value={dataById.CASH_ADVANCE_NUMBER}
                                    className="bg-gray-100"
                                    autoComplete="cashAdvanceNumber"
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            CASH_ADVANCE_NUMBER: e.target.value,
                                        })
                                    }
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="tanggalPengajuan"
                                    value="Request Date"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="tanggalPengajuan"
                                    type="text"
                                    name="tanggalPengajuan"
                                    value={dateFormat(
                                        dataById.CASH_ADVANCE_REQUESTED_DATE,
                                        "dd-mm-yyyy"
                                    )}
                                    className="bg-gray-100"
                                    autoComplete="tanggalPengajuan"
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
                                    autoComplete="namaPengguna"
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            DIVISION: e.target.value,
                                        })
                                    }
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
                                        dataById?.division
                                            ?.COMPANY_DIVISION_ALIAS
                                    }
                                    className="bg-gray-100"
                                    autoComplete="divisi"
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            CASH_ADVANCE_DIVISION:
                                                e.target.value,
                                        })
                                    }
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
                                    autoComplete="namaPemberiApproval"
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            DIVISION: e.target.value,
                                        })
                                    }
                                    readOnly
                                />
                            </div>
                        </div>

                        {/* Table form start */}
                        <div className="max-w-full overflow-x-auto overflow-visible">
                            <table className="w-full divide-y divide-gray-300">
                                <thead className="bg-gray-100">
                                    <tr className="text-center dark:bg-meta-4 leading-7">
                                        <TH
                                            label="No."
                                            className="border px-3 py-2"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Intended Activity"
                                            className="border py-2"
                                            colSpan={2}
                                        />
                                        <TH
                                            label="Purpose"
                                            className="border py-2"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Relation"
                                            className="border py-2"
                                            colSpan={3}
                                        />
                                        <TH
                                            label="Location"
                                            className="border py-2"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Amount"
                                            className="border py-2"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Document"
                                            className="border py-2"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Note"
                                            className="border px-3 py-2"
                                            rowSpan={2}
                                        />
                                        {dataById.cash_advance_detail.length >
                                            1 && (
                                            <TH
                                                label="Action"
                                                className="border px-3 py-2"
                                                rowSpan={2}
                                            />
                                        )}
                                    </tr>
                                    <tr className="text-center">
                                        <TH
                                            label="Start Date"
                                            className="border py-2"
                                        />
                                        <TH
                                            label="End Date"
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
                                    {dataById.cash_advance_detail.map(
                                        (cad: any, i: number) => (
                                            <tr
                                                className="text-center text-sm"
                                                key={i}
                                            >
                                                <TD className="border">
                                                    {i + 1 + "."}
                                                </TD>
                                                <TD className="border">
                                                    <DatePicker
                                                        name="CASH_ADVANCE_DETAIL_START_DATE"
                                                        selected={
                                                            cad.CASH_ADVANCE_DETAIL_START_DATE
                                                        }
                                                        onChange={(date: any) =>
                                                            handleChangeRevisedDate(
                                                                date,
                                                                "CASH_ADVANCE_DETAIL_START_DATE",
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
                                                    <DatePicker
                                                        name="CASH_ADVANCE_DETAIL_END_DATE"
                                                        selected={
                                                            cad.CASH_ADVANCE_DETAIL_END_DATE
                                                        }
                                                        onChange={(date: any) =>
                                                            handleChangeRevisedDate(
                                                                date,
                                                                "CASH_ADVANCE_DETAIL_END_DATE",
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
                                                    <select
                                                        id="CASH_ADVANCE_DETAIL_PURPOSE"
                                                        name="CASH_ADVANCE_DETAIL_PURPOSE"
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                        value={
                                                            cad.CASH_ADVANCE_DETAIL_PURPOSE
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
                                                            -- Choose Purpose --
                                                        </option>
                                                        {cash_advance_purpose.map(
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
                                                                cad.CASH_ADVANCE_DETAIL_RELATION_ORGANIZATION_ID
                                                            ),
                                                            value: cad.CASH_ADVANCE_DETAIL_RELATION_ORGANIZATION_ID,
                                                        }}
                                                        onChange={(val: any) =>
                                                            handleChangeRevisedCustom(
                                                                val.value,
                                                                "CASH_ADVANCE_DETAIL_RELATION_ORGANIZATION_ID",
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
                                                        id="CASH_ADVANCE_DETAIL_RELATION_NAME"
                                                        type="text"
                                                        name="CASH_ADVANCE_DETAIL_RELATION_NAME"
                                                        value={
                                                            cad.CASH_ADVANCE_DETAIL_RELATION_NAME ||
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
                                                        id="CASH_ADVANCE_DETAIL_RELATION_POSITION"
                                                        type="text"
                                                        name="CASH_ADVANCE_DETAIL_RELATION_POSITION"
                                                        value={
                                                            cad.CASH_ADVANCE_DETAIL_RELATION_POSITION ||
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
                                                        id="CASH_ADVANCE_DETAIL_LOCATION"
                                                        type="text"
                                                        name="CASH_ADVANCE_DETAIL_LOCATION"
                                                        value={
                                                            cad.CASH_ADVANCE_DETAIL_LOCATION
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
                                                    <CurrencyInput
                                                        id="CASH_ADVANCE_DETAIL_AMOUNT"
                                                        name="CASH_ADVANCE_DETAIL_AMOUNT"
                                                        value={
                                                            cad.CASH_ADVANCE_DETAIL_AMOUNT
                                                        }
                                                        decimalScale={2}
                                                        decimalsLimit={2}
                                                        onValueChange={(
                                                            val: any
                                                        ) =>
                                                            handleChangeRevisedCustom(
                                                                val,
                                                                "CASH_ADVANCE_DETAIL_AMOUNT",
                                                                i
                                                            )
                                                        }
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                        required
                                                        placeholder="0.00"
                                                        autoComplete="off"
                                                    />
                                                </TD>
                                                <TD className="border px-3">
                                                    <button
                                                        type="button"
                                                        className="bg-black hover:bg-slate-800 text-sm text-white py-2 px-3"
                                                        onClick={() => {
                                                            setModalFiles({
                                                                add_files:
                                                                    false,
                                                                show_files:
                                                                    false,
                                                                show_files_revised:
                                                                    true,
                                                                add_files_report:
                                                                    false,
                                                                show_files_report:
                                                                    false,
                                                                show_files_revised_report:
                                                                    false,
                                                                show_files_proof_of_document:
                                                                    false,
                                                                add_files_execute_report:
                                                                    false,
                                                                index: "",
                                                                index_show: "",
                                                                index_show_revised:
                                                                    i,
                                                                index_show_report:
                                                                    "",
                                                                index_show_revised_report:
                                                                    "",
                                                            });
                                                        }}
                                                    >
                                                        {cad
                                                            .m_cash_advance_document
                                                            ?.length > 0 ||
                                                        cad.filesDocument
                                                            ?.length > 0
                                                            ? (cad
                                                                  .m_cash_advance_document
                                                                  ?.length ||
                                                                  0) +
                                                              (cad.filesDocument
                                                                  ?.length ||
                                                                  0) +
                                                              " Files"
                                                            : "Add Files"}
                                                    </button>
                                                </TD>
                                                <TD className="border text-left px-3">
                                                    {
                                                        cad.CASH_ADVANCE_DETAIL_NOTE
                                                    }
                                                </TD>
                                                {dataById.cash_advance_detail
                                                    .length > 1 && (
                                                    <TD className="border">
                                                        <Button
                                                            className="my-1.5 px-3 py-1"
                                                            type="button"
                                                            onClick={() =>
                                                                handleRemoveRowRevised(
                                                                    i,
                                                                    cad.CASH_ADVANCE_DETAIL_ID
                                                                )
                                                            }
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
                                    <tr className="text-center text-black text-sm leading-7">
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
                                            className="text-right pr-5 py-2 font-bold"
                                            colSpan={6}
                                        >
                                            TOTAL AMOUNT
                                        </TD>
                                        <TD className="py-2 font-bold">
                                            {formatCurrency.format(
                                                revised_total_amount
                                            )}
                                        </TD>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        {/* Table form end */}

                        <div className="mt-10">
                            <fieldset className="bg-white pb-10 pt-5 rounded-lg border-2">
                                <legend className="ml-12 px-3 font-medium">
                                    Delivery Method
                                </legend>
                                <div className="mt-4 mx-5 space-y-5">
                                    <div className="relative flex items-start">
                                        <div className="flex h-9 items-center">
                                            <input
                                                id="transfer"
                                                name="transfer"
                                                type="checkbox"
                                                aria-describedby="transfer-description"
                                                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                                                defaultChecked={
                                                    dataById.CASH_ADVANCE_DELIVERY_METHOD_TRANSFER ===
                                                        1 && true
                                                }
                                                onChange={(e) =>
                                                    handleCheckedTransferEdit(e)
                                                }
                                            />
                                        </div>
                                        <div className="block md:flex w-full gap-4">
                                            <div className="ml-3 text-sm leading-9">
                                                <label
                                                    htmlFor="transfer"
                                                    className="font-medium text-gray-900"
                                                >
                                                    Transfer
                                                </label>
                                            </div>
                                            <CurrencyInput
                                                id="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                name="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                value={
                                                    dataById.CASH_ADVANCE_TRANSFER_AMOUNT
                                                }
                                                decimalScale={2}
                                                decimalsLimit={2}
                                                className={`block w-full md:w-1/4 ml-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right ${
                                                    dataById.CASH_ADVANCE_DELIVERY_METHOD_TRANSFER ===
                                                        0 && "bg-gray-100"
                                                }`}
                                                onValueChange={(val: any) =>
                                                    setDataById({
                                                        ...dataById,
                                                        CASH_ADVANCE_TRANSFER_AMOUNT:
                                                            val,
                                                    })
                                                }
                                                placeholder="0.00"
                                                autoComplete="off"
                                                disabled={
                                                    dataById.CASH_ADVANCE_DELIVERY_METHOD_TRANSFER ===
                                                        0 && true
                                                }
                                            />
                                            <select
                                                name=""
                                                id=""
                                                className="block w-full md:w-2/6 ml-3 mt-5 md:mt-0 rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                value={
                                                    dataById.CASH_ADVANCE_TO_BANK_ACCOUNT
                                                }
                                                onChange={(e) =>
                                                    setDataById({
                                                        ...dataById,
                                                        CASH_ADVANCE_TO_BANK_ACCOUNT:
                                                            e.target.value,
                                                    })
                                                }
                                                required={
                                                    dataById.CASH_ADVANCE_DELIVERY_METHOD_TRANSFER ===
                                                        1 && true
                                                }
                                            >
                                                <option value="">
                                                    -- Choose Bank Account --
                                                </option>
                                                {employeeBankAccount
                                                    .filter(
                                                        (m: any) =>
                                                            m.EMPLOYEE_ID ===
                                                            dataById
                                                                .employee_used_by
                                                                ?.EMPLOYEE_ID
                                                    )
                                                    .map((account: any) => (
                                                        <option
                                                            key={
                                                                account.EMPLOYEE_BANK_ACCOUNT_ID
                                                            }
                                                            value={
                                                                account.EMPLOYEE_BANK_ACCOUNT_ID
                                                            }
                                                        >
                                                            {account?.employee
                                                                .EMPLOYEE_FIRST_NAME +
                                                                " - " +
                                                                account.EMPLOYEE_BANK_ACCOUNT_NAME +
                                                                " - " +
                                                                account.EMPLOYEE_BANK_ACCOUNT_NUMBER}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="relative flex items-start">
                                        <div className="flex h-9 items-center">
                                            <input
                                                id="cash"
                                                name="cash"
                                                type="checkbox"
                                                aria-describedby="cash-description"
                                                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                                                defaultChecked={
                                                    dataById.CASH_ADVANCE_DELIVERY_METHOD_CASH ===
                                                        1 && true
                                                }
                                                onChange={(e) =>
                                                    handleCheckedCashEdit(e)
                                                }
                                            />
                                        </div>
                                        <div className="block md:flex w-full">
                                            <div className="ml-3 text-sm leading-9">
                                                <label
                                                    htmlFor="cash"
                                                    className="font-medium text-gray-900"
                                                >
                                                    Cash
                                                </label>
                                            </div>
                                            <CurrencyInput
                                                id="CASH_ADVANCE_CASH_AMOUNT"
                                                name="CASH_ADVANCE_CASH_AMOUNT"
                                                value={
                                                    dataById.CASH_ADVANCE_CASH_AMOUNT
                                                }
                                                decimalScale={2}
                                                decimalsLimit={2}
                                                className={`block w-full md:w-1/4 ml-3 md:ml-12 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right ${
                                                    dataById.CASH_ADVANCE_DELIVERY_METHOD_CASH ===
                                                        0 && "bg-gray-100"
                                                }`}
                                                onValueChange={(val: any) =>
                                                    setDataById({
                                                        ...dataById,
                                                        CASH_ADVANCE_CASH_AMOUNT:
                                                            val,
                                                    })
                                                }
                                                placeholder="0.00"
                                                autoComplete="off"
                                                disabled={
                                                    dataById.CASH_ADVANCE_DELIVERY_METHOD_CASH ===
                                                        0 && true
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                        </div>

                        <div className="w-full p-2 mt-5">
                            <InputLabel
                                htmlFor="cash_advance_request_note"
                                value="Note"
                                className="mb-2"
                            />
                            <Textarea
                                id="cash_advance_request_note"
                                name="cash_advance_request_note"
                                className="resize-none border-0 focus:ring-2 focus:ring-inset focus:ring-red-600"
                                rows={5}
                                value={dataById.CASH_ADVANCE_REQUEST_NOTE || ""}
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
                        view_report: false,
                        approve_report: false,
                        revised_report: false,
                        execute_report: false,
                    })
                }
                title="Cash Advance Execute"
                url={`/cashAdvanceExecute/${dataById.CASH_ADVANCE_ID}`}
                data={dataById}
                method="patch"
                onSuccess={handleSuccess}
                headers={null}
                submitButtonName={"Execute"}
                body={
                    <>
                        <ModalToDocument
                            classPanel={
                                "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 sm:min-w-full lg:min-w-[35%]"
                            }
                            show={modalFiles.show_files}
                            closeable={true}
                            onClose={() => handleOnCloseModalFiles()}
                            title="Show Files"
                            url={`/cashAdvanceDownload/${
                                dataById.cash_advance_detail[modalFiles.index]
                                    ?.CASH_ADVANCE_DETAIL_ID
                            }`}
                            data=""
                            method=""
                            onSuccess=""
                            headers={null}
                            submitButtonName=""
                            body={
                                <>
                                    <div className="grid grid-cols-12 my-3">
                                        {dataById.cash_advance_detail[
                                            modalFiles.index_show
                                        ]?.m_cash_advance_document.map(
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
                                                            href={`/cashAdvanceDocReader/${
                                                                dataById
                                                                    .cash_advance_detail[
                                                                    modalFiles
                                                                        .index_show
                                                                ]
                                                                    .CASH_ADVANCE_DETAIL_ID
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
                                                                    .cash_advance_detail[
                                                                    modalFiles
                                                                        .index_show
                                                                ]
                                                                    .CASH_ADVANCE_DETAIL_ID,
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
                                    htmlFor="cashAdvanceNumber"
                                    value="CA Number"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="cashAdvanceNumber"
                                    type="text"
                                    name="cashAdvanceNumber"
                                    value={dataById.CASH_ADVANCE_NUMBER}
                                    className="bg-gray-100"
                                    autoComplete="cashAdvanceNumber"
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
                                    autoComplete="namaPemohon"
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
                                    autoComplete="namaPengguna"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="tanggalPengajuan"
                                    value="Request Date"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="tanggalPengajuan"
                                    type="text"
                                    name="tanggalPengajuan"
                                    value={dateFormat(
                                        dataById.REPORT_CASH_ADVANCE_REQUESTED_DATE,
                                        "dd-mm-yyyy"
                                    )}
                                    className="bg-gray-100"
                                    autoComplete="tanggalPengajuan"
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
                                        dataById?.division
                                            ?.COMPANY_DIVISION_ALIAS
                                    }
                                    className="bg-gray-100"
                                    autoComplete="divisi"
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
                                    autoComplete="namaPemberiApproval"
                                    readOnly
                                />
                            </div>
                        </div>

                        {/* Table form start */}
                        <div className="max-w-full overflow-x-auto overflow-visible">
                            <table className="w-full divide-y divide-gray-300">
                                <thead className="bg-gray-100 leading-8">
                                    <tr className="text-center dark:bg-meta-4">
                                        <TH
                                            label="No."
                                            className="border px-3 py-2"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Intended Activity"
                                            className="border px-3 py-2"
                                            colSpan={2}
                                        />
                                        <TH
                                            label="Purpose"
                                            className="border px-3 py-2"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Relation"
                                            className="border px-3 py-2"
                                            colSpan={3}
                                        />
                                        <TH
                                            label="Location"
                                            className="border px-3 py-2"
                                            rowSpan={2}
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
                                            label="Note"
                                            className="border px-3 py-2"
                                            rowSpan={2}
                                        />
                                    </tr>
                                    <tr className="text-center">
                                        <TH
                                            label="Start Date"
                                            className="border px-3 py-2"
                                        />
                                        <TH
                                            label="End Date"
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
                                <tbody id="form_table">
                                    {dataById?.cash_advance_detail.map(
                                        (cad: any, i: number) => (
                                            <tr
                                                className="text-center text-sm"
                                                key={i}
                                            >
                                                <TD className="border">
                                                    {i + 1 + "."}
                                                </TD>
                                                <TD className="border px-3">
                                                    {dateFormat(
                                                        cad.CASH_ADVANCE_DETAIL_START_DATE,
                                                        "dd-mm-yyyy"
                                                    )}
                                                </TD>
                                                <TD className="border px-3">
                                                    {dateFormat(
                                                        cad.CASH_ADVANCE_DETAIL_END_DATE,
                                                        "dd-mm-yyyy"
                                                    )}
                                                </TD>
                                                <TD className="border px-3">
                                                    {
                                                        cad.purpose
                                                            ?.CASH_ADVANCE_PURPOSE
                                                    }
                                                </TD>
                                                <TD className="border px-3">
                                                    {cad.relation_organization
                                                        ? cad
                                                              .relation_organization
                                                              ?.RELATION_ORGANIZATION_NAME
                                                        : "-"}
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {cad.CASH_ADVANCE_DETAIL_RELATION_NAME
                                                        ? cad.CASH_ADVANCE_DETAIL_RELATION_NAME
                                                        : "-"}
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {cad.CASH_ADVANCE_DETAIL_RELATION_POSITION
                                                        ? cad.CASH_ADVANCE_DETAIL_RELATION_POSITION
                                                        : "-"}
                                                </TD>
                                                <TD className="border px-3">
                                                    {
                                                        cad.CASH_ADVANCE_DETAIL_LOCATION
                                                    }
                                                </TD>
                                                <TD className="border px-3">
                                                    {formatCurrency.format(
                                                        cad.CASH_ADVANCE_DETAIL_AMOUNT
                                                    )}
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {cad
                                                        ?.m_cash_advance_document
                                                        ?.length > 0 ? (
                                                        <button
                                                            type="button"
                                                            className="bg-black hover:bg-slate-800 text-sm text-white py-2 px-3"
                                                            onClick={() => {
                                                                setModalFiles({
                                                                    add_files:
                                                                        false,
                                                                    show_files:
                                                                        true,
                                                                    add_files_report:
                                                                        false,
                                                                    show_files_report:
                                                                        false,
                                                                    index: "",
                                                                    index_show:
                                                                        i,
                                                                    index_show_report:
                                                                        "",
                                                                });
                                                            }}
                                                        >
                                                            {
                                                                cad
                                                                    ?.m_cash_advance_document
                                                                    ?.length
                                                            }{" "}
                                                            Files
                                                        </button>
                                                    ) : (
                                                        "-"
                                                    )}
                                                </TD>
                                                <TD className="border">
                                                    {
                                                        cad.CASH_ADVANCE_DETAIL_NOTE
                                                    }
                                                </TD>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr className="text-center text-black text-sm leading-7">
                                        <TD
                                            className="border text-right pr-5 py-2 font-bold"
                                            colSpan={8}
                                        >
                                            TOTAL AMOUNT
                                        </TD>
                                        <TD className="border text-center py-2 font-bold">
                                            {formatCurrency.format(
                                                dataById.CASH_ADVANCE_TOTAL_AMOUNT
                                            )}
                                        </TD>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        {/* Table form end */}

                        <div className="mt-10">
                            <fieldset className="bg-white pb-10 pt-5 rounded-lg border-2">
                                <legend className="ml-12 px-3 font-medium">
                                    Delivery Method
                                </legend>
                                <div className="mt-4 mx-5 space-y-5">
                                    <div className="relative flex items-start">
                                        <div className="flex h-9 items-center">
                                            <input
                                                id="transfer"
                                                name="transfer"
                                                type="checkbox"
                                                aria-describedby="transfer-description"
                                                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                                                onChange={(e) =>
                                                    handleCheckedTransferEdit(e)
                                                }
                                                defaultChecked={
                                                    dataById.CASH_ADVANCE_DELIVERY_METHOD_TRANSFER ===
                                                        1 && true
                                                }
                                            />
                                        </div>
                                        <div className="block md:flex w-full gap-4">
                                            <div className="ml-3 text-sm leading-9">
                                                <label
                                                    htmlFor="transfer"
                                                    className="font-medium text-gray-900"
                                                >
                                                    Transfer
                                                </label>
                                            </div>
                                            <CurrencyInput
                                                id="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                name="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                value={
                                                    dataById.CASH_ADVANCE_TRANSFER_AMOUNT
                                                }
                                                decimalScale={2}
                                                decimalsLimit={2}
                                                className={`block w-full md:w-1/4 ml-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right ${
                                                    dataById.CASH_ADVANCE_DELIVERY_METHOD_TRANSFER ===
                                                        0 && "bg-gray-100"
                                                }`}
                                                onValueChange={(val: any) =>
                                                    setDataById({
                                                        ...dataById,
                                                        CASH_ADVANCE_TRANSFER_AMOUNT:
                                                            val,
                                                    })
                                                }
                                                placeholder="0.00"
                                                autoComplete="off"
                                                disabled={
                                                    dataById.CASH_ADVANCE_DELIVERY_METHOD_TRANSFER ===
                                                        0 && true
                                                }
                                            />
                                            <select
                                                name=""
                                                id=""
                                                className="block w-full md:w-2/6 ml-3 mt-5 md:mt-0 rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                value={
                                                    dataById.CASH_ADVANCE_TO_BANK_ACCOUNT
                                                }
                                                onChange={(e) =>
                                                    setDataById({
                                                        ...dataById,
                                                        CASH_ADVANCE_TO_BANK_ACCOUNT:
                                                            e.target.value,
                                                    })
                                                }
                                                required={
                                                    dataById.CASH_ADVANCE_DELIVERY_METHOD_TRANSFER ===
                                                        1 && true
                                                }
                                            >
                                                <option value="">
                                                    -- Choose Bank Account --
                                                </option>
                                                {employeeBankAccount
                                                    .filter(
                                                        (m: any) =>
                                                            m.EMPLOYEE_ID ===
                                                            dataById
                                                                .employee_used_by
                                                                ?.EMPLOYEE_ID
                                                    )
                                                    .map((account: any) => (
                                                        <option
                                                            key={
                                                                account.EMPLOYEE_BANK_ACCOUNT_ID
                                                            }
                                                            value={
                                                                account.EMPLOYEE_BANK_ACCOUNT_ID
                                                            }
                                                        >
                                                            {account?.employee
                                                                .EMPLOYEE_FIRST_NAME +
                                                                " - " +
                                                                account.EMPLOYEE_BANK_ACCOUNT_NAME +
                                                                " - " +
                                                                account.EMPLOYEE_BANK_ACCOUNT_NUMBER}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div
                                        className="ml-7"
                                        hidden={
                                            dataById.CASH_ADVANCE_DELIVERY_METHOD_TRANSFER ===
                                                0 && true
                                        }
                                    >
                                        <div className="w-full sm:w-[30%] mb-5">
                                            <InputLabel
                                                htmlFor="cash_advance_transfer_date"
                                                className="mb-2"
                                            >
                                                Transfer Date
                                                {/* <span className="text-red-600">*</span> */}
                                            </InputLabel>
                                            <div className="grid grid-cols-1">
                                                <DatePicker
                                                    name="CASH_ADVANCE_TRANSFER_DATE"
                                                    selected={
                                                        dataById.CASH_ADVANCE_TRANSFER_DATE ||
                                                        ""
                                                    }
                                                    onChange={(date: any) =>
                                                        setDataById({
                                                            ...dataById,
                                                            CASH_ADVANCE_TRANSFER_DATE:
                                                                date.toLocaleDateString(
                                                                    "en-CA"
                                                                ),
                                                        })
                                                    }
                                                    dateFormat={"dd-MM-yyyy"}
                                                    placeholderText="dd-mm-yyyyy"
                                                    className="w-full border-0 rounded-md shadow-md text-sm h-9 focus:ring-2 focus:ring-inset focus:ring-red-600"
                                                    autoComplete="off"
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-5">
                                            <InputLabel
                                                htmlFor="CASH_ADVANCE_FROM_BANK_ACCOUNT"
                                                className="mb-2"
                                            >
                                                From Bank Account
                                                {/* <span className="text-red-600">*</span> */}
                                            </InputLabel>
                                            <select
                                                name="CASH_ADVANCE_FROM_BANK_ACCOUNT"
                                                id="CASH_ADVANCE_FROM_BANK_ACCOUNT"
                                                className="block w-full sm:w-[30%] rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                onChange={(e) =>
                                                    setDataById({
                                                        ...dataById,
                                                        CASH_ADVANCE_FROM_BANK_ACCOUNT:
                                                            e.target.value,
                                                    })
                                                }
                                            >
                                                <option value="">
                                                    -- Choose Bank Account --
                                                </option>
                                                {companies.map(
                                                    (company: any) => (
                                                        <option
                                                            value={
                                                                company.COMPANY_ID
                                                            }
                                                            key={
                                                                company.COMPANY_ID
                                                            }
                                                        >
                                                            {`${company.COMPANY_BANK_ACCOUNT_NAME} - ${company.COMPANY_BANK_ACCOUNT_NUMBER}`}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="relative flex items-start">
                                        <div className="flex h-9 items-center">
                                            <input
                                                id="cash"
                                                name="cash"
                                                type="checkbox"
                                                aria-describedby="cash-description"
                                                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                                                onChange={(e) =>
                                                    handleCheckedCashEdit(e)
                                                }
                                                defaultChecked={
                                                    dataById.CASH_ADVANCE_DELIVERY_METHOD_CASH ===
                                                        1 && true
                                                }
                                            />
                                        </div>
                                        <div className="block md:flex w-full">
                                            <div className="ml-3 text-sm leading-9">
                                                <label
                                                    htmlFor="cash"
                                                    className="font-medium text-gray-900"
                                                >
                                                    Cash
                                                </label>
                                            </div>
                                            <CurrencyInput
                                                id="CASH_ADVANCE_CASH_AMOUNT"
                                                name="CASH_ADVANCE_CASH_AMOUNT"
                                                value={
                                                    dataById.CASH_ADVANCE_CASH_AMOUNT
                                                }
                                                decimalScale={2}
                                                decimalsLimit={2}
                                                className={`block w-full md:w-1/4 ml-3 md:ml-12 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right ${
                                                    dataById.CASH_ADVANCE_DELIVERY_METHOD_CASH ===
                                                        0 && "bg-gray-100"
                                                }`}
                                                onValueChange={(val: any) =>
                                                    setDataById({
                                                        ...dataById,
                                                        CASH_ADVANCE_CASH_AMOUNT:
                                                            val,
                                                    })
                                                }
                                                placeholder="0.00"
                                                autoComplete="off"
                                                disabled={
                                                    dataById.CASH_ADVANCE_DELIVERY_METHOD_CASH ===
                                                        0 && true
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div
                                        className="ml-7"
                                        hidden={
                                            dataById.CASH_ADVANCE_DELIVERY_METHOD_CASH ===
                                                0 && true
                                        }
                                    >
                                        <div className="w-full sm:w-[30%] mb-5">
                                            <InputLabel
                                                htmlFor="CASH_ADVANCE_RECEIVE_DATE"
                                                className="mb-2"
                                            >
                                                Receive Date
                                                {/* <span className="text-red-600">*</span> */}
                                            </InputLabel>
                                            <div className="grid grid-cols-1">
                                                <DatePicker
                                                    name="CASH_ADVANCE_RECEIVE_DATE"
                                                    selected={
                                                        dataById.CASH_ADVANCE_RECEIVE_DATE
                                                    }
                                                    onChange={(date: any) =>
                                                        setDataById({
                                                            ...dataById,
                                                            CASH_ADVANCE_RECEIVE_DATE:
                                                                date.toLocaleDateString(
                                                                    "en-CA"
                                                                ),
                                                        })
                                                    }
                                                    dateFormat={"dd-MM-yyyy"}
                                                    placeholderText="dd-mm-yyyyy"
                                                    className="w-full border-0 rounded-md shadow-md text-sm h-9 focus:ring-2 focus:ring-inset focus:ring-red-600"
                                                    autoComplete="off"
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-2">
                                            <InputLabel
                                                htmlFor="receive_name"
                                                className="mb-2"
                                            >
                                                Receive Name
                                                {/* <span className="text-red-600">*</span> */}
                                            </InputLabel>
                                            <TextInput
                                                id="CASH_ADVANCE_RECEIVE_NAME"
                                                type="text"
                                                name="CASH_ADVANCE_RECEIVE_NAME"
                                                value={
                                                    dataById.CASH_ADVANCE_RECEIVE_NAME ||
                                                    ""
                                                }
                                                className="w-full md:w-[30%]"
                                                onChange={(e) =>
                                                    setDataById({
                                                        ...dataById,
                                                        CASH_ADVANCE_RECEIVE_NAME:
                                                            e.target.value,
                                                    })
                                                }
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                        </div>

                        <div className="w-full p-2 mt-5">
                            <InputLabel
                                htmlFor="cash_advance_request_note"
                                value="Note"
                                className="mb-2"
                            />
                            <Textarea
                                id="cash_advance_request_note"
                                name="cash_advance_request_note"
                                className="resize-none border-0 focus:ring-2 focus:ring-inset focus:ring-red-600"
                                rows={5}
                                value={dataById.CASH_ADVANCE_REQUEST_NOTE || ""}
                                readOnly
                            />
                        </div>
                    </>
                }
            />
            {/* Modal Execute End */}

            {/* Modal Create Report Start */}
            <ModalToAdd
                classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 min-w-full`}
                show={modal.report}
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
                        view_report: false,
                        approve_report: false,
                        revised_report: false,
                        execute_report: false,
                    })
                }
                title={"Add Cash Advance Report"}
                url={`/cashAdvanceReport`}
                data={dataCAReport}
                onSuccess={handleSuccess}
                // panelWidth={"65%"}
                buttonAddOns={null}
                body={
                    <>
                        <ModalToDocument
                            classPanel={
                                "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 sm:min-w-full lg:min-w-[35%]"
                            }
                            show={modalFiles.add_files_report}
                            closeable={true}
                            onClose={() => handleOnCloseModalFiles()}
                            title="Add Files Report"
                            url=""
                            data=""
                            method=""
                            onSuccess=""
                            headers={null}
                            submitButtonName=""
                            // panelWidth=""
                            body={
                                <>
                                    {dataCAReport.CashAdvanceDetail[
                                        modalFiles.index
                                    ]?.cash_advance_detail_document_id.map(
                                        (file: any, i: number) => (
                                            <div
                                                className="grid grid-cols-12 my-4"
                                                key={i}
                                            >
                                                <div
                                                    className={`w-full col-span-11`}
                                                >
                                                    <InputLabel
                                                        htmlFor="files"
                                                        value="File"
                                                        className="mb-2"
                                                    />
                                                    {file?.name ? (
                                                        <p>{file?.name}</p>
                                                    ) : (
                                                        <Input
                                                            name="cash_advance_detail_document_id"
                                                            type="file"
                                                            className="w-full"
                                                            onChange={(e) =>
                                                                handleChangeAddFilesReport(
                                                                    e,
                                                                    i
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </div>
                                                <button
                                                    className="text-center self-center bg-red-600 hover:bg-red-500 text-white mx-2 mt-8 py-1 rounded-lg"
                                                    onClick={(e) =>
                                                        handleRemoveFilesReportRow(
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
                                        className="mt-4 text-sm cursor-pointer hover:underline"
                                        onClick={(e) =>
                                            handleAddRowFilesReport(e)
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
                                    htmlFor="cashAdvanceNumber"
                                    value="CA Number"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="cashAdvanceNumber"
                                    type="text"
                                    name="cashAdvanceNumber"
                                    value={dataById.CASH_ADVANCE_NUMBER}
                                    className="bg-gray-100"
                                    autoComplete="cashAdvanceNumber"
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            CASH_ADVANCE_NUMBER: e.target.value,
                                        })
                                    }
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="tanggalPengajuan"
                                    value="Request Date"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="tanggalPengajuan"
                                    type="text"
                                    name="tanggalPengajuan"
                                    value={dateFormat(
                                        dataById.CASH_ADVANCE_REQUESTED_DATE,
                                        "dd-mm-yyyy"
                                    )}
                                    className="bg-gray-100"
                                    autoComplete="tanggalPengajuan"
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
                                    autoComplete="namaPengguna"
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
                                        dataById.employee?.division
                                            ?.COMPANY_DIVISION_ALIAS
                                    }
                                    className="bg-gray-100"
                                    autoComplete="divisi"
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
                                        dataById?.cost_center
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
                                        dataById?.employee_used_by
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
                                        dataById?.office?.COMPANY_OFFICE_ALIAS
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
                                        dataById?.employee_approval
                                            ?.EMPLOYEE_FIRST_NAME
                                    }
                                    className="bg-gray-100"
                                    autoComplete="namaPemberiApproval"
                                    readOnly
                                />
                            </div>
                        </div>

                        {/* Table form start */}
                        <div className="max-w-full overflow-x-auto overflow-visible">
                            <table className="w-full divide-y divide-gray-300">
                                <thead className="">
                                    <tr className="bg-gray-2 text-center dark:bg-meta-4">
                                        <TH
                                            label="No."
                                            className="border"
                                            rowSpan="2"
                                        />
                                        <TH
                                            label="Intended Activity"
                                            className="border"
                                            colSpan="2"
                                        />
                                        <TH className="border" rowSpan="2">
                                            Purpose{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH
                                            label="Relation"
                                            className="border"
                                            colSpan="3"
                                        />
                                        <TH className="border" rowSpan="2">
                                            Location{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH className="border" rowSpan="2">
                                            Amount{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH
                                            label="Document"
                                            className="border"
                                            rowSpan="2"
                                        />
                                        {DataReportRow.length > 1 && (
                                            <TH
                                                label="Action"
                                                className="border px-3 py-2"
                                                rowSpan="2"
                                            />
                                        )}
                                    </tr>
                                    <tr className="text-center">
                                        <TH className="border" rowSpan="2">
                                            Start Date{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH className="border" rowSpan="2">
                                            End Date{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH label="Name" className="border" />
                                        <TH label="Person" className="border" />
                                        <TH
                                            label="Position"
                                            className="border"
                                        />
                                    </tr>
                                </thead>
                                <tbody id="form_table">
                                    {DataReportRow.map(
                                        (val: any, i: number) => (
                                            <tr className="text-center" key={i}>
                                                <TD className="border">
                                                    {i + 1}.
                                                </TD>
                                                <TD className="border">
                                                    <DatePicker
                                                        name="cash_advance_detail_start_date"
                                                        selected={
                                                            val.cash_advance_detail_start_date
                                                        }
                                                        onChange={(date: any) =>
                                                            handleChangeAddReportDate(
                                                                date,
                                                                "cash_advance_detail_start_date",
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
                                                    <DatePicker
                                                        name="cash_advance_detail_end_date"
                                                        selected={
                                                            val.cash_advance_detail_end_date
                                                        }
                                                        onChange={(date: any) =>
                                                            handleChangeAddReportDate(
                                                                date,
                                                                "cash_advance_detail_end_date",
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
                                                        id="cash_advance_detail_purpose"
                                                        type="text"
                                                        name="cash_advance_detail_purpose"
                                                        value={
                                                            val.cash_advance_detail_purpose
                                                        }
                                                        className="w-1/2"
                                                        autoComplete="off"
                                                        onChange={(e) =>
                                                            handleChangeAddReport(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                    />
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
                                                        value={
                                                            val.cash_advance_detail_relation_organization_id
                                                        }
                                                        onChange={(val: any) =>
                                                            handleChangeAddReportCustom(
                                                                val,
                                                                "cash_advance_detail_relation_organization_id",
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
                                                        id="cash_advance_detail_relation_name"
                                                        type="text"
                                                        name="cash_advance_detail_relation_name"
                                                        value={
                                                            val.cash_advance_detail_relation_name
                                                        }
                                                        className="w-1/2"
                                                        autoComplete="off"
                                                        onChange={(e) =>
                                                            handleChangeAddReport(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                    />
                                                </TD>
                                                <TD className="border">
                                                    <TextInput
                                                        id="cash_advance_detail_relation_position"
                                                        type="text"
                                                        name="cash_advance_detail_relation_position"
                                                        value={
                                                            val.cash_advance_detail_relation_position
                                                        }
                                                        className="w-1/2"
                                                        autoComplete="off"
                                                        onChange={(e) =>
                                                            handleChangeAddReport(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                    />
                                                </TD>
                                                <TD className="border">
                                                    <TextInput
                                                        id="cash_advance_detail_location"
                                                        type="text"
                                                        name="cash_advance_detail_location"
                                                        value={
                                                            val.cash_advance_detail_location
                                                        }
                                                        className="w-1/2"
                                                        autoComplete="off"
                                                        onChange={(e) =>
                                                            handleChangeAddReport(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                    />
                                                </TD>
                                                <TD className="border">
                                                    <CurrencyInput
                                                        id="cash_advance_detail_amount"
                                                        name="cash_advance_detail_amount"
                                                        value={
                                                            val.cash_advance_detail_amount
                                                        }
                                                        decimalScale={2}
                                                        decimalsLimit={2}
                                                        onValueChange={(
                                                            val: any
                                                        ) =>
                                                            handleChangeAddReportCustom(
                                                                val,
                                                                "cash_advance_detail_amount",
                                                                i
                                                            )
                                                        }
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                        required
                                                        placeholder="0.00"
                                                        autoComplete="off"
                                                    />
                                                </TD>
                                                <TD className="border">
                                                    <div className="">
                                                        <button
                                                            type="button"
                                                            className="bg-black hover:bg-slate-800 text-sm text-white py-2 px-3"
                                                            onClick={() => {
                                                                setModalFiles({
                                                                    add_files:
                                                                        false,
                                                                    show_files:
                                                                        false,
                                                                    add_files_report:
                                                                        true,
                                                                    show_files_report:
                                                                        false,
                                                                    index: i,
                                                                });
                                                            }}
                                                        >
                                                            {dataCAReport
                                                                .CashAdvanceDetail[
                                                                i
                                                            ]
                                                                ?.cash_advance_detail_document_id
                                                                .length > 0
                                                                ? dataCAReport
                                                                      .CashAdvanceDetail[
                                                                      i
                                                                  ]
                                                                      ?.cash_advance_detail_document_id
                                                                      ?.length +
                                                                  " Files"
                                                                : "Add Files"}
                                                        </button>
                                                    </div>
                                                </TD>
                                                <TD className="border">
                                                    {DataReportRow.length >
                                                        1 && (
                                                        <Button
                                                            className="my-1.5 px-3 py-1 ml-2"
                                                            onClick={() =>
                                                                handleRemoveReportRow(
                                                                    i
                                                                )
                                                            }
                                                            type="button"
                                                        >
                                                            X
                                                        </Button>
                                                    )}
                                                </TD>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr className="text-right text-sm leading-9">
                                        <TD></TD>
                                        <TD className="text-center">
                                            <Button
                                                className="px-2 text-black bg-none shadow-none hover:underline text-sm"
                                                onClick={(e) =>
                                                    handleAddReportRow(e)
                                                }
                                                type="button"
                                            >
                                                + Add Row
                                            </Button>
                                        </TD>
                                        <TD
                                            className="text-right pr-5 font-bold"
                                            colSpan={6}
                                        >
                                            TOTAL AMOUNT
                                        </TD>
                                        <TD className="font-bold">
                                            {formatCurrency.format(
                                                total_amount_report
                                            )}
                                        </TD>
                                    </tr>
                                    <tr className="text-right text-sm leading-9">
                                        <TD
                                            className="pr-5 font-bold"
                                            colSpan={8}
                                        >
                                            ADVANCED AMOUNT
                                        </TD>
                                        <TD className="font-bold">
                                            {formatCurrency.format(
                                                dataById.CASH_ADVANCE_TOTAL_AMOUNT
                                            )}
                                        </TD>
                                    </tr>
                                    <tr className="text-right text-sm leading-9">
                                        <TD
                                            className="pr-5 font-bold"
                                            colSpan={8}
                                        >
                                            SURPLUS / DEFICIT
                                        </TD>
                                        <TD className="font-bold">
                                            {formatCurrency.format(
                                                dataById.CASH_ADVANCE_TOTAL_AMOUNT -
                                                    total_amount_report
                                            )}
                                        </TD>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        {/* Table form end */}

                        <div className="w-full p-2 mt-5">
                            <InputLabel
                                htmlFor="cash_advance_request_note"
                                value="Note"
                                className="mb-2"
                            />
                            <Textarea
                                id="cash_advance_request_note"
                                name="cash_advance_request_note"
                                className="resize-none border-0 focus:ring-2 focus:ring-inset focus:ring-red-600"
                                rows={5}
                                value={dataCAReport.cash_advance_request_note}
                                onChange={(e) =>
                                    setDataCAReport({
                                        ...dataCAReport,
                                        cash_advance_request_note:
                                            e.target.value,
                                    })
                                }
                            />
                        </div>
                    </>
                }
            />
            {/* Modal Create Report End */}

            {/* Modal Detail Report Start */}
            <ModalToAction
                classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 min-w-full`}
                show={modal.view_report}
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
                        view_report: false,
                        approve_report: false,
                        revised_report: false,
                        execute_report: false,
                    })
                }
                title="Cash Advance Detail Report"
                url=""
                data=""
                method=""
                onSuccess=""
                headers={null}
                submitButtonName=""
                // panelWidth={"65%"}
                body={
                    <>
                        <ModalToDocument
                            classPanel={
                                "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 sm:min-w-full lg:min-w-[35%]"
                            }
                            show={modalFiles.show_files_report}
                            closeable={true}
                            onClose={() => handleOnCloseModalFiles()}
                            title="Show Files"
                            url={`/cashAdvanceReportDownload/${
                                dataReportById?.cash_advance_detail_report[
                                    modalFiles.index_show_report
                                ]?.REPORT_CASH_ADVANCE_DETAIL_ID
                            }`}
                            data=""
                            method=""
                            onSuccess=""
                            headers={null}
                            submitButtonName=""
                            // panelWidth=""
                            body={
                                <>
                                    <div className="grid grid-cols-12 my-3">
                                        {dataReportById?.cash_advance_detail_report[
                                            modalFiles.index_show_report
                                        ]?.m_cash_advance_report_document.map(
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
                                                            href={`/cashAdvanceReportDocReader/${
                                                                dataReportById
                                                                    ?.cash_advance_detail_report[
                                                                    modalFiles
                                                                        .index_show_report
                                                                ]
                                                                    ?.REPORT_CASH_ADVANCE_DETAIL_ID
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
                                                            handleFileReportDownload(
                                                                dataReportById
                                                                    ?.cash_advance_detail_report[
                                                                    modalFiles
                                                                        .index_show_report
                                                                ]
                                                                    ?.REPORT_CASH_ADVANCE_DETAIL_ID,
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
                                "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 sm:min-w-full lg:min-w-[35%]"
                            }
                            show={modalFiles.show_files_proof_of_document}
                            closeable={true}
                            onClose={() => handleOnCloseModalFiles()}
                            title="Show Files Proof Of Document"
                            url={`/cashAdvanceReportProofOfDocumentDownload/${dataReportById?.REPORT_CASH_ADVANCE_ID}`}
                            data=""
                            method=""
                            onSuccess=""
                            headers={null}
                            submitButtonName=""
                            // panelWidth=""
                            body={
                                <>
                                    <div className="grid grid-cols-12 my-3">
                                        {dataReportById?.m_cash_advance_proof_of_document.map(
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
                                                            href={`/cashAdvanceReportProofOfDocumentDocReader/${dataReportById?.REPORT_CASH_ADVANCE_ID}/${file?.document.DOCUMENT_ID}`}
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
                                                            handleFileProofOfDocumentDownload(
                                                                dataReportById?.REPORT_CASH_ADVANCE_ID,
                                                                dataReportById
                                                                    ?.m_cash_advance_proof_of_document[
                                                                    i
                                                                ]?.document
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
                                    htmlFor="cashAdvanceReportNumber"
                                    value="CA Report Number"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="cashAdvanceReportNumber"
                                    type="text"
                                    name="cashAdvanceReportNumber"
                                    value={
                                        dataReportById?.REPORT_CASH_ADVANCE_NUMBER
                                    }
                                    className="bg-gray-100"
                                    autoComplete="cashAdvanceReportNumber"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="tanggalPengajuan"
                                    value="Report Request Date"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="tanggalPengajuan"
                                    type="text"
                                    name="tanggalPengajuan"
                                    value={dateFormat(
                                        dataReportById?.REPORT_CASH_ADVANCE_REQUESTED_DATE,
                                        "dd-mm-yyyy"
                                    )}
                                    className="bg-gray-100"
                                    autoComplete="tanggalPengajuan"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="cashAdvanceNumber"
                                    value="CA Number"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="cashAdvanceNumber"
                                    type="text"
                                    name="cashAdvanceNumber"
                                    value={
                                        dataReportById?.cash_advance
                                            .CASH_ADVANCE_NUMBER
                                    }
                                    className="bg-gray-100"
                                    autoComplete="cashAdvanceNumber"
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
                                        dataReportById?.employee
                                            ?.EMPLOYEE_FIRST_NAME
                                    }
                                    className="bg-gray-100"
                                    autoComplete="namaPengguna"
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
                                        dataReportById?.employee?.division
                                            ?.COMPANY_DIVISION_ALIAS
                                    }
                                    className="bg-gray-100"
                                    autoComplete="divisi"
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
                                        dataReportById?.cash_advance.cost_center
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
                                        dataReportById?.employee_used_by
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
                                        dataReportById?.cash_advance.office
                                            ?.COMPANY_OFFICE_ALIAS
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
                                        dataReportById?.employee_approval
                                            ?.EMPLOYEE_FIRST_NAME
                                    }
                                    className="bg-gray-100"
                                    autoComplete="namaPemberiApproval"
                                    readOnly
                                />
                            </div>
                        </div>

                        {/* Table form start */}
                        <div className="max-w-full overflow-x-auto overflow-visible">
                            <table className="w-full divide-y divide-gray-300">
                                <thead className="bg-gray-100">
                                    <tr className="text-center text-gray-700 dark:bg-meta-4 leading-7">
                                        <TH
                                            label="No."
                                            className="border px-3 py-2"
                                            rowSpan="2"
                                        />
                                        <TH
                                            label="Intended Activity"
                                            className="border px-3 py-2"
                                            colSpan="2"
                                        />
                                        <TH
                                            label="Purpose"
                                            className="border px-3 py-2"
                                            rowSpan="2"
                                        />
                                        <TH
                                            label="Relation"
                                            className="border px-3 py-2"
                                            colSpan="3"
                                        />
                                        <TH
                                            label="Location"
                                            className="border px-3 py-2"
                                            rowSpan="2"
                                        />
                                        <TH
                                            label="Amount"
                                            className="border px-3 py-2"
                                            rowSpan="2"
                                        />
                                        <TH
                                            label="Document"
                                            className="border px-3 py-2"
                                            rowSpan="2"
                                        />
                                    </tr>
                                    <tr className="text-center text-gray-700 leading-7">
                                        <TH
                                            label="Start Date"
                                            className="border px-3 py-2"
                                        />
                                        <TH
                                            label="End Date"
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
                                <tbody id="form_table">
                                    {dataReportById?.cash_advance_detail_report.map(
                                        (cad: any, i: number) => (
                                            <tr
                                                className="text-center text-gray-700 text-sm leading-7"
                                                key={i}
                                            >
                                                <TD className="border">
                                                    {i + 1}.
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {dateFormat(
                                                        cad.REPORT_CASH_ADVANCE_DETAIL_START_DATE,
                                                        "dd-mm-yyyy"
                                                    )}
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {dateFormat(
                                                        cad.REPORT_CASH_ADVANCE_DETAIL_END_DATE,
                                                        "dd-mm-yyyy"
                                                    )}
                                                </TD>
                                                <TD className="border px-3">
                                                    {
                                                        cad.REPORT_CASH_ADVANCE_DETAIL_PURPOSE
                                                    }
                                                </TD>
                                                <TD className="border px-3">
                                                    {cad.relation_organization
                                                        ? cad
                                                              .relation_organization
                                                              ?.RELATION_ORGANIZATION_NAME
                                                        : "-"}
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {cad.REPORT_CASH_ADVANCE_DETAIL_RELATION_NAME
                                                        ? cad.REPORT_CASH_ADVANCE_DETAIL_RELATION_NAME
                                                        : "-"}
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {cad.REPORT_CASH_ADVANCE_DETAIL_RELATION_POSITION
                                                        ? cad.REPORT_CASH_ADVANCE_DETAIL_RELATION_POSITION
                                                        : "-"}
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {
                                                        cad.REPORT_CASH_ADVANCE_DETAIL_LOCATION
                                                    }
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {formatCurrency.format(
                                                        cad.REPORT_CASH_ADVANCE_DETAIL_AMOUNT
                                                    )}
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {cad
                                                        ?.m_cash_advance_report_document
                                                        ?.length > 0 ? (
                                                        <button
                                                            type="button"
                                                            className="bg-black hover:bg-slate-800 text-sm text-white py-2 px-3"
                                                            onClick={() => {
                                                                setModalFiles({
                                                                    add_files:
                                                                        false,
                                                                    show_files:
                                                                        false,
                                                                    add_files_report:
                                                                        false,
                                                                    show_files_report:
                                                                        true,
                                                                    index: "",
                                                                    index_show:
                                                                        "",
                                                                    index_show_report:
                                                                        i,
                                                                });
                                                            }}
                                                        >
                                                            {
                                                                cad
                                                                    ?.m_cash_advance_report_document
                                                                    ?.length
                                                            }{" "}
                                                            Files
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
                                    <tr className="text-center text-black text-sm leading-7">
                                        <TD
                                            className="border text-right pr-5 py-2 font-bold"
                                            colSpan={8}
                                        >
                                            TOTAL AMOUNT
                                        </TD>
                                        <TD className="border py-2 font-bold">
                                            {formatCurrency.format(
                                                dataReportById?.REPORT_CASH_ADVANCE_TOTAL_AMOUNT
                                            )}
                                        </TD>
                                    </tr>
                                    <tr className="text-center text-black text-sm leading-7">
                                        <TD
                                            className="border text-right pr-5 py-2 font-bold"
                                            colSpan={8}
                                        >
                                            ADVANCED AMOUNT
                                        </TD>
                                        <TD className="border py-2 font-bold">
                                            {formatCurrency.format(
                                                dataReportById?.REPORT_CASH_ADVANCE_TOTAL_AMOUNT_REQUEST
                                            )}
                                        </TD>
                                    </tr>
                                    <tr className="text-center text-black text-sm leading-7">
                                        <TD
                                            className="border text-right pr-5 py-2 font-bold"
                                            colSpan={8}
                                        >
                                            SURPLUS / DEFICIT
                                        </TD>
                                        <TD className="border py-2 font-bold">
                                            {formatCurrency.format(
                                                dataReportById?.REPORT_CASH_ADVANCE_TOTAL_AMOUNT_REQUEST -
                                                    dataReportById?.REPORT_CASH_ADVANCE_TOTAL_AMOUNT
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
                                    Difference
                                    {/* <span className="text-red-600">*</span> */}
                                </InputLabel>
                                <TextInput
                                    value={
                                        dataReportById?.cash_advance_difference
                                            .CASH_ADVANCE_DIFFERENCE_NAME
                                    }
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>

                            <div className="w-full p-2">
                                <InputLabel htmlFor="type" className="mb-2">
                                    Proof of Document
                                    {/* <span className="text-red-600">*</span> */}
                                </InputLabel>
                                {dataReportById
                                    ?.m_cash_advance_proof_of_document?.length >
                                0 ? (
                                    <button
                                        type="button"
                                        className="bg-black hover:bg-slate-800 text-sm text-white py-2 px-3"
                                        onClick={() => {
                                            setModalFiles({
                                                add_files: false,
                                                show_files: false,
                                                add_files_report: false,
                                                show_files_report: false,
                                                show_files_proof_of_document:
                                                    true,
                                                index: "",
                                                index_show: "",
                                                index_show_report: "",
                                            });
                                        }}
                                    >
                                        {dataReportById
                                            ?.m_cash_advance_proof_of_document
                                            ?.length + " Files"}
                                    </button>
                                ) : (
                                    "-"
                                )}
                            </div>
                        </div>

                        <div className="w-full p-2 mt-5">
                            <InputLabel
                                htmlFor="cash_advance_request_note"
                                value="Note"
                                className="mb-2"
                            />
                            <Textarea
                                id="cash_advance_request_note"
                                name="cash_advance_request_note"
                                className="resize-none border-0 focus:ring-2 focus:ring-inset focus:ring-red-600"
                                rows={5}
                                value={
                                    dataReportById?.REPORT_CASH_ADVANCE_REQUEST_NOTE ||
                                    ""
                                }
                                onChange={(e) =>
                                    setData(
                                        "cash_advance_request_note",
                                        e.target.value
                                    )
                                }
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
                                                            dataReportById?.REPORT_CASH_ADVANCE_CREATED_AT,
                                                            "dd-mm-yyyy"
                                                        )}
                                                    </time>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                {dataReportById?.REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS ===
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
                                                                dataReportById?.REPORT_CASH_ADVANCE_FIRST_APPROVAL_CHANGE_STATUS_DATE,
                                                                "dd-mm-yyyy"
                                                            )}
                                                        </time>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                )}
                                {dataReportById?.REPORT_CASH_ADVANCE_SECOND_APPROVAL_STATUS !==
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
                                                                dataReportById?.REPORT_CASH_ADVANCE_SECOND_APPROVAL_CHANGE_STATUS_DATE,
                                                                "dd-mm-yyyy"
                                                            )}
                                                        </time>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                )}
                                {dataReportById?.REPORT_CASH_ADVANCE_THIRD_APPROVAL_STATUS !==
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
                                                                dataReportById?.REPORT_CASH_ADVANCE_THIRD_APPROVAL_CHANGE_STATUS_DATE,
                                                                "dd-mm-yyyy"
                                                            )}
                                                        </time>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                )}
                                {dataReportById?.REPORT_CASH_ADVANCE_SECOND_APPROVAL_STATUS ===
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
                                                                dataReportById?.REPORT_CASH_ADVANCE_SECOND_APPROVAL_CHANGE_STATUS_DATE,
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
            {/* Modal Detail Report End */}

            {/* Modal Approve Report Start */}
            <ModalToAction
                classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 min-w-full`}
                show={modal.approve_report}
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
                        view_report: false,
                        approve_report: false,
                        revised_report: false,
                        execute_report: false,
                    })
                }
                title="Cash Advance Approve Report"
                url={`/cashAdvanceReportApprove`}
                data={dataReportById}
                method="patch"
                onSuccess={handleSuccess}
                headers={null}
                submitButtonName={""}
                body={
                    <>
                        <ModalToDocument
                            classPanel={
                                "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 sm:min-w-full lg:min-w-[35%]"
                            }
                            show={modalFiles.show_files_report}
                            closeable={true}
                            onClose={() => handleOnCloseModalFiles()}
                            title="Show Files"
                            url={`/cashAdvanceReportDownload/${
                                dataReportById?.cash_advance_detail_report[
                                    modalFiles.index_show_report
                                ]?.REPORT_CASH_ADVANCE_DETAIL_ID
                            }`}
                            data=""
                            method=""
                            onSuccess=""
                            headers={null}
                            submitButtonName=""
                            // panelWidth=""
                            body={
                                <>
                                    <div className="grid grid-cols-12 my-3">
                                        {dataReportById?.cash_advance_detail_report[
                                            modalFiles.index_show_report
                                        ]?.m_cash_advance_report_document.map(
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
                                                            href={`/cashAdvanceReportDocReader/${
                                                                dataReportById
                                                                    ?.cash_advance_detail_report[
                                                                    modalFiles
                                                                        .index_show_report
                                                                ]
                                                                    ?.REPORT_CASH_ADVANCE_DETAIL_ID
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
                                                            handleFileReportDownload(
                                                                dataReportById
                                                                    ?.cash_advance_detail_report[
                                                                    modalFiles
                                                                        .index_show_report
                                                                ]
                                                                    ?.REPORT_CASH_ADVANCE_DETAIL_ID,
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
                                    htmlFor="cashAdvanceReportNumber"
                                    value="CA Report Number"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="cashAdvanceReportNumber"
                                    type="text"
                                    name="cashAdvanceReportNumber"
                                    value={
                                        dataReportById?.REPORT_CASH_ADVANCE_NUMBER
                                    }
                                    className="bg-gray-100"
                                    autoComplete="cashAdvanceReportNumber"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="tanggalPengajuan"
                                    value="Report Request Date"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="tanggalPengajuan"
                                    type="text"
                                    name="tanggalPengajuan"
                                    value={dateFormat(
                                        dataReportById?.REPORT_CASH_ADVANCE_REQUESTED_DATE,
                                        "dd-mm-yyyy"
                                    )}
                                    className="bg-gray-100"
                                    autoComplete="tanggalPengajuan"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="cashAdvanceNumber"
                                    value="CA Number"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="cashAdvanceNumber"
                                    type="text"
                                    name="cashAdvanceNumber"
                                    value={
                                        dataReportById?.cash_advance
                                            .CASH_ADVANCE_NUMBER
                                    }
                                    className="bg-gray-100"
                                    autoComplete="cashAdvanceNumber"
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
                                        dataReportById?.employee
                                            ?.EMPLOYEE_FIRST_NAME
                                    }
                                    className="bg-gray-100"
                                    autoComplete="namaPengguna"
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
                                        dataReportById?.employee?.division
                                            .COMPANY_DIVISION_ALIAS
                                    }
                                    className="bg-gray-100"
                                    autoComplete="divisi"
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
                                        dataReportById?.cash_advance.cost_center
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
                                        dataReportById?.employee_used_by
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
                                        dataReportById?.cash_advance.office
                                            ?.COMPANY_OFFICE_ALIAS
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
                                        dataReportById?.employee_approval
                                            ?.EMPLOYEE_FIRST_NAME
                                    }
                                    className="bg-gray-100"
                                    autoComplete="namaPemberiApproval"
                                    readOnly
                                />
                            </div>
                        </div>

                        {/* Table form start */}
                        <div className="max-w-full overflow-x-auto overflow-visible">
                            <table className="w-full divide-y divide-gray-300">
                                <thead className="bg-gray-100 leading-8">
                                    <tr className="text-center dark:bg-meta-4">
                                        <TH
                                            label="No."
                                            className="border px-3 py-2"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Intended Activity"
                                            className="border px-3 py-2"
                                            colSpan={2}
                                        />
                                        <TH
                                            label="Purpose"
                                            className="border px-3 py-2"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Relation"
                                            className="border px-3 py-2"
                                            colSpan={3}
                                        />
                                        <TH
                                            label="Location"
                                            className="border px-3 py-2"
                                            rowSpan={2}
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
                                        <TH className="border" rowSpan="2">
                                            Approval
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH className="border" rowSpan="2">
                                            Cost Classification
                                            {/* <span className="text-red-600">
                                                *
                                            </span> */}
                                        </TH>
                                        <TH className="border px-3" rowSpan="2">
                                            Amount Approve
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH
                                            label="Remarks"
                                            className="border px-3"
                                            rowSpan="2"
                                        />
                                    </tr>
                                    <tr className="text-center">
                                        <TH
                                            label="Start Date"
                                            className="border px-3 py-2"
                                        />
                                        <TH
                                            label="End Date"
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
                                <tbody id="form_table">
                                    {dataReportById?.cash_advance_detail_report.map(
                                        (cad: any, i: number) => (
                                            <tr
                                                className="text-center text-sm"
                                                key={i}
                                            >
                                                <TD className="border">
                                                    {i + 1 + "."}
                                                </TD>
                                                <TD className="border px-3">
                                                    {dateFormat(
                                                        cad.REPORT_CASH_ADVANCE_DETAIL_START_DATE,
                                                        "dd-mm-yyyy"
                                                    )}
                                                </TD>
                                                <TD className="border px-3">
                                                    {dateFormat(
                                                        cad.REPORT_CASH_ADVANCE_DETAIL_END_DATE,
                                                        "dd-mm-yyyy"
                                                    )}
                                                </TD>
                                                <TD className="border px-3">
                                                    {
                                                        cad.REPORT_CASH_ADVANCE_DETAIL_PURPOSE
                                                    }
                                                </TD>
                                                <TD className="border px-3">
                                                    {cad.relation_organization
                                                        ? cad
                                                              .relation_organization
                                                              ?.RELATION_ORGANIZATION_NAME
                                                        : "-"}
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {cad.REPORT_CASH_ADVANCE_DETAIL_RELATION_NAME
                                                        ? cad.REPORT_CASH_ADVANCE_DETAIL_RELATION_NAME
                                                        : "-"}
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {cad.REPORT_CASH_ADVANCE_DETAIL_RELATION_POSITION
                                                        ? cad.REPORT_CASH_ADVANCE_DETAIL_RELATION_POSITION
                                                        : "-"}
                                                </TD>
                                                <TD className="border px-3">
                                                    {
                                                        cad.REPORT_CASH_ADVANCE_DETAIL_LOCATION
                                                    }
                                                </TD>
                                                <TD className="border px-3">
                                                    {formatCurrency.format(
                                                        cad.REPORT_CASH_ADVANCE_DETAIL_AMOUNT
                                                    )}
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {cad
                                                        ?.m_cash_advance_report_document
                                                        ?.length > 0 ? (
                                                        <button
                                                            type="button"
                                                            className="bg-black hover:bg-slate-800 text-sm text-white py-2 px-3"
                                                            onClick={() => {
                                                                setModalFiles({
                                                                    add_files:
                                                                        false,
                                                                    show_files:
                                                                        false,
                                                                    add_files_report:
                                                                        false,
                                                                    show_files_report:
                                                                        true,
                                                                    index: "",
                                                                    index_show:
                                                                        "",
                                                                    index_show_report:
                                                                        i,
                                                                });
                                                            }}
                                                        >
                                                            {
                                                                cad
                                                                    ?.m_cash_advance_report_document
                                                                    ?.length
                                                            }{" "}
                                                            Files
                                                        </button>
                                                    ) : (
                                                        "-"
                                                    )}
                                                </TD>
                                                <TD className="border">
                                                    <select
                                                        id="REPORT_CASH_ADVANCE_DETAIL_APPROVAL"
                                                        name="REPORT_CASH_ADVANCE_DETAIL_APPROVAL"
                                                        className="block w-56 rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                        onChange={(e) =>
                                                            handleChangeApprovalReport(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                        value={
                                                            cad.REPORT_CASH_ADVANCE_DETAIL_APPROVAL ||
                                                            ""
                                                        }
                                                    >
                                                        <option value="">
                                                            -- Choose Approval
                                                            --
                                                        </option>
                                                        {getCashAdvanceApproval.map(
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
                                                            menu: "absolute text-left z-20 w-96 bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
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
                                                                cad.REPORT_CASH_ADVANCE_DETAIL_COST_CLASSIFICATION
                                                            ),
                                                            value: cad.REPORT_CASH_ADVANCE_DETAIL_COST_CLASSIFICATION,
                                                        }}
                                                        onChange={(val: any) =>
                                                            handleChangeApproveReportCustom(
                                                                val.value,
                                                                "REPORT_CASH_ADVANCE_DETAIL_COST_CLASSIFICATION",
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
                                                        id="REPORT_CASH_ADVANCE_DETAIL_AMOUNT_APPROVE"
                                                        name="REPORT_CASH_ADVANCE_DETAIL_AMOUNT_APPROVE"
                                                        value={
                                                            cad.REPORT_CASH_ADVANCE_DETAIL_AMOUNT_APPROVE
                                                        }
                                                        decimalScale={2}
                                                        decimalsLimit={2}
                                                        onValueChange={(
                                                            val: any
                                                        ) =>
                                                            handleChangeApproveReportCustom(
                                                                val,
                                                                "REPORT_CASH_ADVANCE_DETAIL_AMOUNT_APPROVE",
                                                                i
                                                            )
                                                        }
                                                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right ${
                                                            cad.REPORT_CASH_ADVANCE_DETAIL_APPROVAL ===
                                                                "3" ||
                                                            cad.REPORT_CASH_ADVANCE_DETAIL_APPROVAL ===
                                                                "1"
                                                                ? "bg-gray-100"
                                                                : ""
                                                        }`}
                                                        required
                                                        placeholder="0.00"
                                                        autoComplete="off"
                                                        autoFocus={
                                                            cad.REPORT_CASH_ADVANCE_DETAIL_AMOUNT_APPROVE
                                                        }
                                                        disabled={
                                                            cad.REPORT_CASH_ADVANCE_DETAIL_APPROVAL ===
                                                                "3" ||
                                                            (cad.REPORT_CASH_ADVANCE_DETAIL_APPROVAL ===
                                                                "1" &&
                                                                true)
                                                        }
                                                    />
                                                </TD>
                                                <TD className="border">
                                                    <div className="w-96">
                                                        <TextInput
                                                            id="REPORT_CASH_ADVANCE_DETAIL_REMARKS"
                                                            type="text"
                                                            name="REPORT_CASH_ADVANCE_DETAIL_REMARKS"
                                                            value={
                                                                cad.REPORT_CASH_ADVANCE_DETAIL_REMARKS ||
                                                                ""
                                                            }
                                                            className="w-1/2"
                                                            autoComplete="off"
                                                            onChange={(e) =>
                                                                handleChangeApproveReport(
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
                                    <tr className="text-center text-black text-sm leading-7">
                                        <TD
                                            className="border text-right pr-5 py-2 font-bold"
                                            colSpan={12}
                                        >
                                            ADVANCED AMOUNT
                                        </TD>
                                        <TD className="border text-center py-2 font-bold">
                                            {formatCurrency.format(
                                                dataReportById?.REPORT_CASH_ADVANCE_TOTAL_AMOUNT_REQUEST
                                            )}
                                        </TD>
                                    </tr>
                                    <tr className="text-center text-black text-sm leading-7">
                                        <TD
                                            className="border text-right pr-5 py-2 font-bold"
                                            colSpan={12}
                                        >
                                            UTILIZATION
                                        </TD>
                                        <TD className="border text-center py-2 font-bold">
                                            {formatCurrency.format(
                                                total_amount_approve
                                            )}
                                        </TD>
                                    </tr>
                                    <tr className="text-center text-black text-sm leading-7">
                                        <TD
                                            className="border text-right pr-5 py-2 font-bold"
                                            colSpan={12}
                                        >
                                            SURPLUS / DEFICIT
                                        </TD>
                                        <TD className="border text-center py-2 font-bold">
                                            {formatCurrency.format(
                                                dataReportById?.REPORT_CASH_ADVANCE_TOTAL_AMOUNT_REQUEST -
                                                    total_amount_approve
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
                                    htmlFor="REPORT_CASH_ADVANCE_TYPE"
                                    className="mb-2"
                                >
                                    Difference
                                    {/* <span className="text-red-600">*</span> */}
                                </InputLabel>
                                <select
                                    id="REPORT_CASH_ADVANCE_TYPE"
                                    name="REPORT_CASH_ADVANCE_TYPE"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    onChange={(e) =>
                                        setDataReportById({
                                            ...dataReportById,
                                            REPORT_CASH_ADVANCE_TYPE:
                                                e.target.value,
                                        })
                                    }
                                    value={
                                        dataReportById?.REPORT_CASH_ADVANCE_TYPE ||
                                        ""
                                    }
                                >
                                    <option value="">
                                        -- Choose Difference --
                                    </option>
                                    {getCashAdvanceDifference.map(
                                        (difference: any) => (
                                            <option
                                                key={
                                                    difference.CASH_ADVANCE_DIFFERENCE_ID
                                                }
                                                value={
                                                    difference.CASH_ADVANCE_DIFFERENCE_ID
                                                }
                                            >
                                                {
                                                    difference.CASH_ADVANCE_DIFFERENCE_NAME
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                        </div>

                        <div className="w-full p-2 mt-5">
                            <InputLabel
                                htmlFor="cash_advance_request_note"
                                value="Note"
                                className="mb-2"
                            />
                            <Textarea
                                id="cash_advance_request_note"
                                name="cash_advance_request_note"
                                className="resize-none border-0 focus:ring-2 focus:ring-inset focus:ring-red-600"
                                rows={5}
                                value={
                                    dataReportById?.REPORT_CASH_ADVANCE_REQUEST_NOTE ||
                                    ""
                                }
                                readOnly
                            />
                        </div>
                        <div className="mt-7">
                            <button
                                type="submit"
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-yellow-400 px-3 py-2 text-sm font-semibold text-white hover:bg-yellow-300 sm:ml-3 sm:mt-0 sm:w-auto"
                                onClick={() => handleBtnReportStatus(3)}
                            >
                                Need Revision
                            </button>
                            <button
                                type="submit"
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500 sm:ml-3 sm:mt-0 sm:w-auto"
                                onClick={() => handleBtnReportStatus(4)}
                            >
                                Reject
                            </button>
                            <button
                                type="submit"
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-500 sm:ml-3 sm:mt-0 sm:w-auto"
                                onClick={() => handleBtnReportStatus(2)}
                            >
                                Approve
                            </button>
                        </div>
                    </>
                }
            />
            {/* Modal Approve Report End */}

            {/* Modal Revised Report Start */}
            <ModalToAction
                classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 min-w-full`}
                show={modal.revised_report}
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
                        view_report: false,
                        approve_report: false,
                        revised_report: false,
                        execute_report: false,
                    })
                }
                title="Cash Advance Revised Report"
                url={`/cashAdvanceReportRevised/${dataReportById?.CASH_ADVANCE_ID}`}
                data={dataReportById}
                method="post"
                onSuccess={handleSuccess}
                headers={{ "Content-type": "multipart/form-data" }}
                submitButtonName={"Save"}
                // panelWidth={"70%"}
                body={
                    <>
                        <ModalToDocument
                            classPanel={
                                "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 sm:min-w-full lg:min-w-[35%]"
                            }
                            show={modalFiles.show_files_revised_report}
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
                                        {dataReportById
                                            ?.cash_advance_detail_report[
                                            modalFiles.index_show_revised_report
                                        ]?.m_cash_advance_report_document && (
                                            <>
                                                {dataReportById?.cash_advance_detail_report[
                                                    modalFiles
                                                        .index_show_revised_report
                                                ]?.m_cash_advance_report_document.map(
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
                                                                    handleRemoveRowRevisedShowFilesReport(
                                                                        i,
                                                                        file
                                                                            ?.document
                                                                            .DOCUMENT_ID,
                                                                        dataById
                                                                            .cash_advance_detail[
                                                                            modalFiles
                                                                                .index_show_revised_report
                                                                        ]
                                                                            .REPORT_CASH_ADVANCE_DETAIL_ID
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

                                        {dataReportById
                                            ?.cash_advance_detail_report[
                                            modalFiles.index_show_revised_report
                                        ]?.filesDocument && (
                                            <>
                                                {dataReportById?.cash_advance_detail_report[
                                                    modalFiles
                                                        .index_show_revised_report
                                                ]?.filesDocument.map(
                                                    (file: any, i: number) => (
                                                        <>
                                                            {file
                                                                .REPORT_CASH_ADVANCE_DETAIL_DOCUMENT
                                                                ?.name ? (
                                                                <div
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
                                                                                ?.REPORT_CASH_ADVANCE_DETAIL_DOCUMENT
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
                                                                        name="REPORT_CASH_ADVANCE_DETAIL_DOCUMENT"
                                                                        type="file"
                                                                        className="w-full"
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleChangeRevisedFilesReport(
                                                                                e,
                                                                                i
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            )}
                                                            <button
                                                                className="text-center self-center bg-red-600 hover:bg-red-500 text-white mx-2 mt-7 py-1 rounded-lg"
                                                                onClick={(e) =>
                                                                    handleRemoveRowRevisedFilesReport(
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
                                            handleAddRowRevisedFilesReport(
                                                dataReportById
                                                    ?.cash_advance_detail_report[
                                                    modalFiles
                                                        .index_show_revised_report
                                                ].REPORT_CASH_ADVANCE_DETAIL_ID
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
                                    htmlFor="cashAdvanceReportNumber"
                                    value="CA Report Number"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="cashAdvanceReportNumber"
                                    type="text"
                                    name="cashAdvanceReportNumber"
                                    value={
                                        dataReportById?.REPORT_CASH_ADVANCE_NUMBER
                                    }
                                    className="bg-gray-100"
                                    autoComplete="cashAdvanceReportNumber"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="tanggalPengajuan"
                                    value="Report Request Date"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="tanggalPengajuan"
                                    type="text"
                                    name="tanggalPengajuan"
                                    value={dateFormat(
                                        dataReportById?.REPORT_CASH_ADVANCE_REQUESTED_DATE,
                                        "dd-mm-yyyy"
                                    )}
                                    className="bg-gray-100"
                                    autoComplete="tanggalPengajuan"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="cashAdvanceNumber"
                                    value="CA Number"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="cashAdvanceNumber"
                                    type="text"
                                    name="cashAdvanceNumber"
                                    value={
                                        dataReportById?.cash_advance
                                            .CASH_ADVANCE_NUMBER
                                    }
                                    className="bg-gray-100"
                                    autoComplete="cashAdvanceNumber"
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
                                        dataReportById?.employee
                                            ?.EMPLOYEE_FIRST_NAME
                                    }
                                    className="bg-gray-100"
                                    autoComplete="namaPengguna"
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
                                        auth.user.employee?.division
                                            .COMPANY_DIVISION_ALIAS
                                    }
                                    className="bg-gray-100"
                                    autoComplete="divisi"
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
                                        dataReportById?.cash_advance.cost_center
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
                                        dataReportById?.employee_used_by
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
                                        dataReportById?.cash_advance.office
                                            ?.COMPANY_OFFICE_ALIAS
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
                                        dataReportById?.employee_approval
                                            ?.EMPLOYEE_FIRST_NAME
                                    }
                                    className="bg-gray-100"
                                    autoComplete="namaPemberiApproval"
                                    readOnly
                                />
                            </div>
                        </div>

                        {/* Table form start */}
                        <div className="max-w-full overflow-x-auto overflow-visible">
                            <table className="w-full divide-y divide-gray-300">
                                <thead className="bg-gray-100">
                                    <tr className="bg-gray-2 text-center dark:bg-meta-4">
                                        <TH
                                            label="No."
                                            className="border"
                                            rowSpan="2"
                                        />
                                        <TH
                                            label="Intended Activity"
                                            className="border"
                                            colSpan="2"
                                        />
                                        <TH className="border" rowSpan="2">
                                            Purpose{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH
                                            label="Relation"
                                            className="border"
                                            colSpan="3"
                                        />
                                        <TH className="border" rowSpan="2">
                                            Location{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH className="border" rowSpan="2">
                                            Amount{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH
                                            label="Document"
                                            className="border"
                                            rowSpan="2"
                                        />
                                        <TH
                                            label="Remarks"
                                            className="border px-3"
                                            rowSpan="2"
                                        />
                                        {DataReportRow.length > 1 && (
                                            <TH
                                                label="Action"
                                                className="border px-3 py-2"
                                                rowSpan="2"
                                            />
                                        )}
                                    </tr>
                                    <tr className="text-center">
                                        <TH className="border" rowSpan="2">
                                            Start Date{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH className="border" rowSpan="2">
                                            End Date{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH label="Name" className="border" />
                                        <TH label="Person" className="border" />
                                        <TH
                                            label="Position"
                                            className="border"
                                        />
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataReportById?.cash_advance_detail_report.map(
                                        (cad: any, i: number) => (
                                            <tr
                                                className="text-center text-sm"
                                                key={i}
                                            >
                                                <TD className="border whitespace-nowrap">
                                                    {i + 1 + "."}
                                                </TD>
                                                <TD className="border whitespace-nowrap">
                                                    <DatePicker
                                                        name="REPORT_CASH_ADVANCE_DETAIL_START_DATE"
                                                        selected={
                                                            cad.REPORT_CASH_ADVANCE_DETAIL_START_DATE
                                                        }
                                                        onChange={(date: any) =>
                                                            handleChangeRevisedReportDate(
                                                                date,
                                                                "REPORT_CASH_ADVANCE_DETAIL_START_DATE",
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
                                                <TD className="border whitespace-nowrap">
                                                    <DatePicker
                                                        name="REPORT_CASH_ADVANCE_DETAIL_END_DATE"
                                                        selected={
                                                            cad.REPORT_CASH_ADVANCE_DETAIL_END_DATE
                                                        }
                                                        onChange={(date: any) =>
                                                            handleChangeRevisedReportDate(
                                                                date,
                                                                "REPORT_CASH_ADVANCE_DETAIL_END_DATE",
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
                                                <TD className="border whitespace-nowrap">
                                                    <TextInput
                                                        id="REPORT_CASH_ADVANCE_DETAIL_PURPOSE"
                                                        type="text"
                                                        name="REPORT_CASH_ADVANCE_DETAIL_PURPOSE"
                                                        value={
                                                            cad.REPORT_CASH_ADVANCE_DETAIL_PURPOSE
                                                        }
                                                        className="w-1/2"
                                                        autoComplete="off"
                                                        onChange={(e) =>
                                                            handleChangeRevisedReport(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                    />
                                                </TD>
                                                <TD className="border whitespace-nowrap">
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
                                                                cad.REPORT_CASH_ADVANCE_DETAIL_RELATION_ORGANIZATION_ID
                                                            ),
                                                            value: cad.REPORT_CASH_ADVANCE_DETAIL_RELATION_ORGANIZATION_ID,
                                                        }}
                                                        onChange={(val: any) =>
                                                            handleChangeRevisedReportCustom(
                                                                val.value,
                                                                "REPORT_CASH_ADVANCE_DETAIL_RELATION_ORGANIZATION_ID",
                                                                i
                                                            )
                                                        }
                                                        primaryColor={
                                                            "bg-red-500"
                                                        }
                                                    />
                                                </TD>
                                                <TD className="border whitespace-nowrap">
                                                    <TextInput
                                                        id="REPORT_CASH_ADVANCE_DETAIL_RELATION_NAME"
                                                        type="text"
                                                        name="REPORT_CASH_ADVANCE_DETAIL_RELATION_NAME"
                                                        value={
                                                            cad.REPORT_CASH_ADVANCE_DETAIL_RELATION_NAME
                                                        }
                                                        className="w-1/2"
                                                        autoComplete="off"
                                                        onChange={(e) =>
                                                            handleChangeRevisedReport(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                    />
                                                </TD>
                                                <TD className="border whitespace-nowrap">
                                                    <TextInput
                                                        id="REPORT_CASH_ADVANCE_DETAIL_RELATION_POSITION"
                                                        type="text"
                                                        name="REPORT_CASH_ADVANCE_DETAIL_RELATION_POSITION"
                                                        value={
                                                            cad.REPORT_CASH_ADVANCE_DETAIL_RELATION_POSITION
                                                        }
                                                        className="w-1/2"
                                                        autoComplete="off"
                                                        onChange={(e) =>
                                                            handleChangeRevisedReport(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                    />
                                                </TD>
                                                <TD className="border whitespace-nowrap">
                                                    <TextInput
                                                        id="REPORT_CASH_ADVANCE_DETAIL_LOCATION"
                                                        type="text"
                                                        name="REPORT_CASH_ADVANCE_DETAIL_LOCATION"
                                                        value={
                                                            cad.REPORT_CASH_ADVANCE_DETAIL_LOCATION
                                                        }
                                                        className="w-1/2"
                                                        autoComplete="off"
                                                        onChange={(e) =>
                                                            handleChangeRevisedReport(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                        required
                                                    />
                                                </TD>
                                                <TD className="border whitespace-nowrap">
                                                    <CurrencyInput
                                                        id="REPORT_CASH_ADVANCE_DETAIL_AMOUNT"
                                                        name="REPORT_CASH_ADVANCE_DETAIL_AMOUNT"
                                                        value={
                                                            cad.REPORT_CASH_ADVANCE_DETAIL_AMOUNT
                                                        }
                                                        decimalScale={2}
                                                        decimalsLimit={2}
                                                        onValueChange={(
                                                            val: any
                                                        ) =>
                                                            handleChangeRevisedReportCustom(
                                                                val,
                                                                "REPORT_CASH_ADVANCE_DETAIL_AMOUNT",
                                                                i
                                                            )
                                                        }
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                        required
                                                        placeholder="0.00"
                                                        autoComplete="off"
                                                    />
                                                </TD>
                                                <TD className="border px-3">
                                                    <button
                                                        type="button"
                                                        className="bg-black hover:bg-slate-800 text-sm text-white py-2 px-3"
                                                        onClick={() => {
                                                            setModalFiles({
                                                                add_files:
                                                                    false,
                                                                show_files:
                                                                    false,
                                                                show_files_revised:
                                                                    false,
                                                                add_files_report:
                                                                    false,
                                                                show_files_report:
                                                                    false,
                                                                show_files_revised_report:
                                                                    true,
                                                                show_files_proof_of_document:
                                                                    false,
                                                                add_files_execute_report:
                                                                    false,
                                                                index: "",
                                                                index_show: "",
                                                                index_show_revised:
                                                                    "",
                                                                index_show_report:
                                                                    "",
                                                                index_show_revised_report:
                                                                    i,
                                                            });
                                                        }}
                                                    >
                                                        {cad
                                                            .m_cash_advance_report_document
                                                            ?.length > 0 ||
                                                        cad.filesDocument
                                                            ?.length > 0
                                                            ? (cad
                                                                  .m_cash_advance_report_document
                                                                  ?.length ||
                                                                  0) +
                                                              (cad.filesDocument
                                                                  ?.length ||
                                                                  0) +
                                                              " Files"
                                                            : "Add Files"}
                                                    </button>
                                                </TD>
                                                <TD className="border whitespace-nowrap px-3">
                                                    {
                                                        cad.REPORT_CASH_ADVANCE_DETAIL_REMARKS
                                                    }
                                                </TD>
                                                {dataReportById
                                                    .cash_advance_detail_report
                                                    .length > 1 && (
                                                    <TD className="border whitespace-nowrap">
                                                        <Button
                                                            className="my-1.5 px-3 py-1"
                                                            onClick={() =>
                                                                handleRemoveRowRevisedReport(
                                                                    i,
                                                                    cad.REPORT_CASH_ADVANCE_DETAIL_ID
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
                                                className="py-2 px-2 text-black bg-none shadow-none hover:underline"
                                                onClick={(e) =>
                                                    handleAddRowRevisedReport(e)
                                                }
                                                type="button"
                                            >
                                                + Add Row
                                            </Button>
                                        </TD>
                                        <TD
                                            className="text-right pr-5 font-bold"
                                            colSpan={6}
                                        >
                                            TOTAL AMOUNT
                                        </TD>
                                        <TD className="font-bold">
                                            {formatCurrency.format(
                                                revised_total_amount_report
                                            )}
                                        </TD>
                                    </tr>
                                    <tr className="text-center text-black text-sm">
                                        <TD
                                            className="py-2 text-right pr-5 font-bold"
                                            colSpan={8}
                                        >
                                            ADVANCED AMOUNT
                                        </TD>
                                        <TD className="font-bold">
                                            {formatCurrency.format(
                                                dataReportById?.REPORT_CASH_ADVANCE_TOTAL_AMOUNT_REQUEST
                                            )}
                                        </TD>
                                    </tr>
                                    <tr className="text-center text-black text-sm">
                                        <TD
                                            className="py-2 text-right pr-5 font-bold"
                                            colSpan={8}
                                        >
                                            SURPLUS / DEFICIT
                                        </TD>
                                        <TD className="font-bold">
                                            {formatCurrency.format(
                                                dataReportById?.REPORT_CASH_ADVANCE_TOTAL_AMOUNT_REQUEST -
                                                    revised_total_amount_report
                                            )}
                                        </TD>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        {/* Table form end */}

                        {/* <div className="grid md:grid-cols-2 my-10">
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="type"
                                    className="mb-2"
                                >
                                    Difference
                                </InputLabel>
                                <select
                                    id="type"
                                    name="type"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    value={dataReportById?.REPORT_CASH_ADVANCE_TYPE}
                                    onChange={(e) =>
                                        setDataCAReport({...dataCAReport, type: e.target.value})
                                    }
                                >
                                    <option value="">
                                        -- Choose Difference --
                                    </option>
                                    {getCashAdvanceDifference.map((difference: any) => (
                                        <option
                                            key={difference.CASH_ADVANCE_DIFFERENCE_ID}
                                            value={difference.CASH_ADVANCE_DIFFERENCE_ID}
                                        >
                                            {difference.CASH_ADVANCE_DIFFERENCE_NAME}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="amount"
                                    className="mb-2"
                                >
                                    Amount
                                </InputLabel>
                                <CurrencyInput
                                    id="amount"
                                    name="amount"
                                    value={
                                        dataReportById?.REPORT_CASH_ADVANCE_AMOUNT
                                    }
                                    decimalScale={2}
                                    decimalsLimit={2}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                    placeholder="0.00"
                                    autoComplete="off"
                                />
                            </div>
                        </div> */}

                        <div className="w-full p-2 mt-5">
                            <InputLabel
                                htmlFor="cash_advance_request_note"
                                value="Note"
                                className="mb-2"
                            />
                            <Textarea
                                id="cash_advance_request_note"
                                name="cash_advance_request_note"
                                className="resize-none border-0 focus:ring-2 focus:ring-inset focus:ring-red-600"
                                rows={5}
                                value={
                                    dataReportById?.REPORT_CASH_ADVANCE_REQUEST_NOTE ||
                                    ""
                                }
                                onChange={(e) =>
                                    setDataReportById({
                                        ...dataReportById,
                                        REPORT_CASH_ADVANCE_REQUEST_NOTE:
                                            e.target.value,
                                    })
                                }
                                // readOnly
                            />
                        </div>
                    </>
                }
            />
            {/* Modal Revised Report End */}

            {/* Modal Execute Report Start */}
            <ModalToAction
                classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 min-w-full`}
                show={modal.execute_report}
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
                        view_report: false,
                        approve_report: false,
                        revised_report: false,
                        execute_report: false,
                    })
                }
                title="Cash Advance Report Execute"
                url={`/cashAdvanceReportExecute`}
                data={dataCAReport}
                method="post"
                onSuccess={handleSuccess}
                headers={{ "Content-type": "multipart/form-data" }}
                submitButtonName="Execute"
                // panelWidth={"70%"}
                body={
                    <>
                        <ModalToDocument
                            classPanel={
                                "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 sm:min-w-full lg:min-w-[35%]"
                            }
                            show={modalFiles.add_files_execute_report}
                            closeable={true}
                            onClose={() => handleOnCloseModalFiles()}
                            title="Proof of Document"
                            url=""
                            data=""
                            method=""
                            onSuccess=""
                            headers={null}
                            submitButtonName=""
                            // panelWidth=""
                            body={
                                <>
                                    {dataCAReport.proof_of_document.map(
                                        (val: any, i: number) => (
                                            <div
                                                className="grid grid-cols-12 mt-3"
                                                key={i}
                                            >
                                                {dataCAReport.proof_of_document[
                                                    i
                                                ].proof_of_document?.name ? (
                                                    <div className="w-full col-span-11">
                                                        <InputLabel
                                                            htmlFor="files"
                                                            value="File"
                                                            className="mb-2"
                                                        />
                                                        <p>
                                                            {
                                                                dataCAReport
                                                                    .proof_of_document[
                                                                    i
                                                                ]
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
                                                            onChange={(e) =>
                                                                handleChangeProofOfDocument(
                                                                    e,
                                                                    i
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                )}
                                                <button
                                                    className="text-center self-center bg-red-600 hover:bg-red-500 text-white mx-2 py-1 rounded-lg mt-8"
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
                                            handleAddRowProofOfDocument(e)
                                        }
                                    >
                                        + Add Row
                                    </button>
                                </>
                            }
                        />
                        <div className="grid md:grid-cols-2 my-10">
                            <div className="w-full p-2">
                                <InputLabel htmlFor="type" className="mb-2">
                                    Advanced Amount
                                    {/* <span className="text-red-600">*</span> */}
                                </InputLabel>
                                <CurrencyInput
                                    value={
                                        dataReportById?.REPORT_CASH_ADVANCE_TOTAL_AMOUNT_REQUEST
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
                                    Utilization
                                    {/* <span className="text-red-600">*</span> */}
                                </InputLabel>
                                <CurrencyInput
                                    value={
                                        dataReportById?.REPORT_CASH_ADVANCE_TOTAL_AMOUNT_APPROVE
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
                                    Surplus / Deficit
                                    {/* <span className="text-red-600">*</span> */}
                                </InputLabel>
                                <CurrencyInput
                                    value={
                                        dataReportById?.REPORT_CASH_ADVANCE_TOTAL_AMOUNT_DIFFERENT
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
                                    Difference
                                    {/* <span className="text-red-600">*</span> */}
                                </InputLabel>
                                <TextInput
                                    value={
                                        dataReportById?.cash_advance_difference
                                            .CASH_ADVANCE_DIFFERENCE_NAME
                                    }
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
                                        setDataCAReport({
                                            ...dataCAReport,
                                            method: e.target.value,
                                        })
                                    }
                                    required
                                >
                                    <option value="">
                                        -- Choose Method --
                                    </option>
                                    {getCashAdvanceMethod.map((method: any) => (
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
                                    htmlFor="transaction_date"
                                    className="mb-2"
                                >
                                    Transaction Date
                                    <span className="text-red-600">*</span>
                                </InputLabel>
                                <DatePicker
                                    name="transaction_date"
                                    selected={dataCAReport.transaction_date}
                                    onChange={(date: any) =>
                                        setDataCAReport({
                                            ...dataCAReport,
                                            transaction_date:
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
                                    <span className="text-red-600">*</span>
                                </InputLabel>
                                <div className="">
                                    <button
                                        type="button"
                                        className="bg-black hover:bg-slate-800 text-sm text-white py-2 px-3"
                                        onClick={() => {
                                            setModalFiles({
                                                add_files: false,
                                                show_files: false,
                                                add_files_report: false,
                                                show_files_report: false,
                                                add_files_execute_report: true,
                                                index: "",
                                            });
                                        }}
                                    >
                                        {dataCAReport.proof_of_document.length >
                                        0
                                            ? dataCAReport.proof_of_document
                                                  .length + " Files"
                                            : "Add Files"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                }
            />
            {/* Modal Execute Report End */}

            {/* Content Start */}
            <Content
                buttonOnAction={
                    <>
                        <Button
                            className="text-xs sm:text-sm font-semibold px-6 py-1.5 md:col-span-2 lg:col-auto text-white bg-red-600 hover:bg-red-500"
                            onClick={(e) => handleAddModal(e, 1, 0)}
                        >
                            {"Add Cash Advance"}
                        </Button>
                    </>
                }
                search={
                    <>
                        <fieldset className="py-3 rounded-lg border-slate-100 border-2">
                            <legend className="ml-8 text-sm">Search</legend>
                            <div className="mt-3 px-4">
                                <InputSearch
                                    id="CASH_ADVANCE_NUMBER"
                                    name="CASH_ADVANCE_NUMBER"
                                    type="text"
                                    placeholder="Cash Advance Number"
                                    autoComplete="off"
                                    value={
                                        searchCashAdvance.cash_advance_search[0]
                                            .CASH_ADVANCE_NUMBER
                                    }
                                    onChange={(val: any) => {
                                        inputDataSearch(
                                            "CASH_ADVANCE_NUMBER",
                                            val.target.value,
                                            0
                                        );
                                        if (
                                            searchCashAdvance
                                                .cash_advance_search[0]
                                                .CASH_ADVANCE_NUMBER === ""
                                        ) {
                                            inputDataSearch("flag", "flag", 0);
                                        } else {
                                            inputDataSearch("flag", "", 0);
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            const cashAdvanceNumber =
                                                searchCashAdvance
                                                    .cash_advance_search[0]
                                                    .CASH_ADVANCE_NUMBER;
                                            if (cashAdvanceNumber) {
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
                                    id="CASH_ADVANCE_REQUESTED_BY"
                                    name="CASH_ADVANCE_REQUESTED_BY"
                                    type="text"
                                    placeholder="Applicant"
                                    autoComplete="off"
                                    value={
                                        searchCashAdvance.cash_advance_search[0]
                                            .CASH_ADVANCE_REQUESTED_BY
                                    }
                                    onChange={(val: any) => {
                                        inputDataSearch(
                                            "CASH_ADVANCE_REQUESTED_BY",
                                            val.target.value,
                                            0
                                        );
                                        if (
                                            searchCashAdvance
                                                .cash_advance_search[0]
                                                .CASH_ADVANCE_REQUESTED_BY ===
                                            ""
                                        ) {
                                            inputDataSearch("flag", "flag", 0);
                                        } else {
                                            inputDataSearch("flag", "", 0);
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            const cashAdvanceRequestedBy =
                                                searchCashAdvance
                                                    .cash_advance_search[0]
                                                    .CASH_ADVANCE_REQUESTED_BY;
                                            if (cashAdvanceRequestedBy) {
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
                                            searchCashAdvance
                                                .cash_advance_search[0]
                                                .CASH_ADVANCE_DIVISION
                                        }
                                        onChange={(val: any) => {
                                            inputDataSearch(
                                                "CASH_ADVANCE_DIVISION",
                                                val,
                                                0
                                            );
                                            if (
                                                searchCashAdvance
                                                    .cash_advance_search[0]
                                                    .CASH_ADVANCE_DIVISION ===
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
                                <InputSearch
                                    id="CASH_ADVANCE_USED_BY"
                                    name="CASH_ADVANCE_USED_BY"
                                    type="text"
                                    placeholder="Used By"
                                    autoComplete="off"
                                    value={
                                        searchCashAdvance.cash_advance_search[0]
                                            .CASH_ADVANCE_USED_BY
                                    }
                                    onChange={(val: any) => {
                                        inputDataSearch(
                                            "CASH_ADVANCE_USED_BY",
                                            val.target.value,
                                            0
                                        );
                                        if (
                                            searchCashAdvance
                                                .cash_advance_search[0]
                                                .CASH_ADVANCE_USED_BY === ""
                                        ) {
                                            inputDataSearch("flag", "flag", 0);
                                        } else {
                                            inputDataSearch("flag", "", 0);
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            const cashAdvanceUsedBy =
                                                searchCashAdvance
                                                    .cash_advance_search[0]
                                                    .CASH_ADVANCE_USED_BY;
                                            if (cashAdvanceUsedBy) {
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
                                        name="CASH_ADVANCE_START_DATE"
                                        selected={
                                            searchCashAdvance
                                                .cash_advance_search[0]
                                                .CASH_ADVANCE_START_DATE
                                        }
                                        onChange={(val: any) => {
                                            inputDataSearch(
                                                "CASH_ADVANCE_START_DATE",
                                                val.toLocaleDateString("en-CA"),
                                                0
                                            );
                                            if (
                                                searchCashAdvance
                                                    .cash_advance_search[0]
                                                    .CASH_ADVANCE_START_DATE ===
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
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                const cashAdvanceStartDate =
                                                    searchCashAdvance
                                                        .cash_advance_search[0]
                                                        .CASH_ADVANCE_START_DATE;
                                                if (cashAdvanceStartDate) {
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
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="grid grid-cols-1 mb-5 relative">
                                    <CalendarDaysIcon className="absolute left-2 z-1 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-6" />
                                    <DatePicker
                                        name="cash_advance_end_date"
                                        selected={
                                            searchCashAdvance
                                                .cash_advance_search[0]
                                                .CASH_ADVANCE_END_DATE
                                        }
                                        onChange={(val: any) => {
                                            inputDataSearch(
                                                "CASH_ADVANCE_END_DATE",
                                                val.toLocaleDateString("en-CA"),
                                                0
                                            );
                                            if (
                                                searchCashAdvance
                                                    .cash_advance_search[0]
                                                    .CASH_ADVANCE_END_DATE ===
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
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                const cashAdvanceEndDate =
                                                    searchCashAdvance
                                                        .cash_advance_search[0]
                                                        .CASH_ADVANCE_END_DATE;
                                                if (cashAdvanceEndDate) {
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
                                        autoComplete="off"
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
                                            searchCashAdvance
                                                .cash_advance_search[0]
                                                .CASH_ADVANCE_COST_CENTER
                                        }
                                        onChange={(val: any) => {
                                            inputDataSearch(
                                                "CASH_ADVANCE_COST_CENTER",
                                                val,
                                                0
                                            );
                                            if (
                                                searchCashAdvance
                                                    .cash_advance_search[0]
                                                    .CASH_ADVANCE_COST_CENTER ===
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
                                <div className="mb-5">
                                    <select
                                        name="CASH_ADVANCE_TYPE"
                                        id="CASH_ADVANCE_TYPE"
                                        className="block w-full rounded-md border-0 py-2.5 text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset text-xs md:text-sm focus:ring-red-600"
                                        value={
                                            searchCashAdvance
                                                .cash_advance_search[0]
                                                .CASH_ADVANCE_TYPE
                                        }
                                        onChange={(val: any) => {
                                            inputDataSearch(
                                                "CASH_ADVANCE_TYPE",
                                                val.target.value,
                                                0
                                            );
                                            if (
                                                searchCashAdvance
                                                    .cash_advance_search[0]
                                                    .CASH_ADVANCE_TYPE === ""
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
                                    >
                                        <option value="1">Cash Advance</option>
                                        <option value="2">
                                            Cash Advance Report
                                        </option>
                                    </select>
                                </div>
                                <div className="flex flex-col md:flex-row justify-end gap-2">
                                    <Button
                                        className="mb-4 w-full md:w-[35%] text-white text-xs sm:text-sm py-1.5 px-2 bg-red-600 hover:bg-red-500"
                                        onClick={() => {
                                            if (
                                                searchCashAdvance
                                                    .cash_advance_search[0]
                                                    .CASH_ADVANCE_ID === "" &&
                                                searchCashAdvance
                                                    .cash_advance_search[0]
                                                    .CASH_ADVANCE_NUMBER === ""
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
                                        onClick={clearSearchCashAdvance}
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
                                    Cash Advance Status
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
                                                    "CASH_ADVANCE_APPROVAL_STATUS",
                                                    "request",
                                                    0
                                                );
                                                if (
                                                    searchCashAdvance
                                                        .cash_advance_search[0]
                                                        .CASH_ADVANCE_APPROVAL_STATUS ===
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
                                                {getCountCARequestStatus}
                                            </span>
                                        </Button>
                                    </div>
                                    <div className="flex relative">
                                        <Button
                                            className="w-36 bg-green-600 px-2 py-1 hover:bg-green-500"
                                            onClick={() => {
                                                inputDataSearch(
                                                    "CASH_ADVANCE_APPROVAL_STATUS",
                                                    "approve1",
                                                    0
                                                );
                                                if (
                                                    searchCashAdvance
                                                        .cash_advance_search[0]
                                                        .CASH_ADVANCE_APPROVAL_STATUS ===
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
                                                {getCountCAApprove1Status}
                                            </span>
                                        </Button>
                                    </div>
                                    <div className="flex relative">
                                        <Button
                                            className="w-36 bg-green-600 px-2 py-1 hover:bg-green-500"
                                            onClick={() => {
                                                inputDataSearch(
                                                    "CASH_ADVANCE_APPROVAL_STATUS",
                                                    "approve2",
                                                    0
                                                );
                                                if (
                                                    searchCashAdvance
                                                        .cash_advance_search[0]
                                                        .CASH_ADVANCE_APPROVAL_STATUS ===
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
                                                {getCountCAApprove2Status}
                                            </span>
                                        </Button>
                                    </div>
                                    <div className="flex relative">
                                        <Button
                                            className="w-36 bg-green-600 px-2 py-1 hover:bg-green-500"
                                            onClick={() => {
                                                inputDataSearch(
                                                    "CASH_ADVANCE_APPROVAL_STATUS",
                                                    "approve3",
                                                    0
                                                );
                                                if (
                                                    searchCashAdvance
                                                        .cash_advance_search[0]
                                                        .CASH_ADVANCE_APPROVAL_STATUS ===
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
                                                {getCountCAApprove3Status}
                                            </span>
                                        </Button>
                                    </div>
                                    <div className="flex relative">
                                        <Button
                                            className="w-36 bg-yellow-400 px-2 py-1 hover:bg-yellow-300"
                                            onClick={() => {
                                                inputDataSearch(
                                                    "CASH_ADVANCE_APPROVAL_STATUS",
                                                    "revision",
                                                    0
                                                );
                                                if (
                                                    searchCashAdvance
                                                        .cash_advance_search[0]
                                                        .CASH_ADVANCE_APPROVAL_STATUS ===
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
                                                {getCountCANeedRevisionStatus}
                                            </span>
                                        </Button>
                                    </div>
                                    <div className="flex relative">
                                        <Button
                                            className="w-36 bg-red-600 px-2 py-1 hover:bg-red-500"
                                            onClick={() => {
                                                inputDataSearch(
                                                    "CASH_ADVANCE_APPROVAL_STATUS",
                                                    "reject",
                                                    0
                                                );
                                                if (
                                                    searchCashAdvance
                                                        .cash_advance_search[0]
                                                        .CASH_ADVANCE_APPROVAL_STATUS ===
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
                                                {getCountCARejectStatus}
                                            </span>
                                        </Button>
                                    </div>
                                    <div className="flex relative">
                                        <Button
                                            className="w-36 bg-green-500 px-2 py-1 hover:bg-green-600"
                                            onClick={() => {
                                                inputDataSearch(
                                                    "CASH_ADVANCE_APPROVAL_STATUS",
                                                    "pendingReport",
                                                    0
                                                );
                                                if (
                                                    searchCashAdvance
                                                        .cash_advance_search[0]
                                                        .CASH_ADVANCE_APPROVAL_STATUS ===
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
                                            Pending Report
                                            <span className="flex absolute bg-red-600 -top-2 -right-3 px-2 rounded-full">
                                                {getCountCAPendingReportStatus}
                                            </span>
                                        </Button>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                        <div className="mt-10">
                            <fieldset className="pb-10 pt-5 rounded-lg border-slate-100 border-2">
                                <legend className="ml-8 text-sm">
                                    Cash Advance Report Status
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
                                                    "CASH_ADVANCE_APPROVAL_STATUS",
                                                    "requestReport",
                                                    0
                                                );
                                                if (
                                                    searchCashAdvance
                                                        .cash_advance_search[0]
                                                        .CASH_ADVANCE_APPROVAL_STATUS ===
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
                                                {getCountCAReportRequestStatus}
                                            </span>
                                        </Button>
                                    </div>
                                    <div className="flex relative">
                                        <Button
                                            className="w-36 bg-green-600 px-2 py-1 hover:bg-green-500"
                                            onClick={() => {
                                                inputDataSearch(
                                                    "CASH_ADVANCE_APPROVAL_STATUS",
                                                    "approve1Report",
                                                    0
                                                );
                                                if (
                                                    searchCashAdvance
                                                        .cash_advance_search[0]
                                                        .CASH_ADVANCE_APPROVAL_STATUS ===
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
                                                {getCountCAReportApprove1Status}
                                            </span>
                                        </Button>
                                    </div>
                                    <div className="flex relative">
                                        <Button
                                            className="w-36 bg-green-600 px-2 py-1 hover:bg-green-500"
                                            onClick={() => {
                                                inputDataSearch(
                                                    "CASH_ADVANCE_APPROVAL_STATUS",
                                                    "approve2Report",
                                                    0
                                                );
                                                if (
                                                    searchCashAdvance
                                                        .cash_advance_search[0]
                                                        .CASH_ADVANCE_APPROVAL_STATUS ===
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
                                                {getCountCAReportApprove2Status}
                                            </span>
                                        </Button>
                                    </div>
                                    <div className="flex relative">
                                        <Button
                                            className="w-36 bg-green-600 px-2 py-1 hover:bg-green-500"
                                            onClick={() => {
                                                inputDataSearch(
                                                    "CASH_ADVANCE_APPROVAL_STATUS",
                                                    "approve3Report",
                                                    0
                                                );
                                                if (
                                                    searchCashAdvance
                                                        .cash_advance_search[0]
                                                        .CASH_ADVANCE_APPROVAL_STATUS ===
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
                                                {getCountCAReportApprove3Status}
                                            </span>
                                        </Button>
                                    </div>
                                    <div className="flex relative">
                                        <Button
                                            className="w-36 bg-yellow-400 px-2 py-1 hover:bg-yellow-300"
                                            onClick={() => {
                                                inputDataSearch(
                                                    "CASH_ADVANCE_APPROVAL_STATUS",
                                                    "revisionReport",
                                                    0
                                                );
                                                if (
                                                    searchCashAdvance
                                                        .cash_advance_search[0]
                                                        .CASH_ADVANCE_APPROVAL_STATUS ===
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
                                                    getCountCAReportNeedRevisionStatus
                                                }
                                            </span>
                                        </Button>
                                    </div>
                                    <div className="flex relative">
                                        <Button
                                            className="w-36 bg-red-600 px-2 py-1 hover:bg-red-500"
                                            onClick={() => {
                                                inputDataSearch(
                                                    "CASH_ADVANCE_APPROVAL_STATUS",
                                                    "rejectReport",
                                                    0
                                                );
                                                if (
                                                    searchCashAdvance
                                                        .cash_advance_search[0]
                                                        .CASH_ADVANCE_APPROVAL_STATUS ===
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
                                                {getCountCAReportRejectStatus}
                                            </span>
                                        </Button>
                                    </div>
                                    <div className="flex relative">
                                        <Button
                                            className="w-36 bg-green-500 px-2 py-1 hover:bg-green-400"
                                            onClick={() => {
                                                inputDataSearch(
                                                    "CASH_ADVANCE_APPROVAL_STATUS",
                                                    "complited",
                                                    0
                                                );
                                                if (
                                                    searchCashAdvance
                                                        .cash_advance_search[0]
                                                        .CASH_ADVANCE_APPROVAL_STATUS ===
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
                            searchParam={searchCashAdvance.cash_advance_search}
                            url={"getCA"}
                            doubleClickEvent={handleShowModal}
                            triggeringRefreshData={refreshSuccess}
                            cellHeight={130}
                            colDefs={[
                                {
                                    headerName: "No.",
                                    valueGetter: "node.rowIndex + 1",
                                    flex: 1,
                                    cellStyle: (params: any) => {
                                        return calculateDate(
                                            params.data
                                                ?.CASH_ADVANCE_REQUESTED_DATE
                                        );
                                    },
                                },
                                {
                                    headerName: "Cash Advance Number",
                                    field: "CASH_ADVANCE_NUMBER",
                                    flex: 2,
                                    cellStyle: (params: any) => {
                                        return calculateDate(
                                            params.data
                                                ?.CASH_ADVANCE_REQUESTED_DATE
                                        );
                                    },
                                },
                                {
                                    headerName: "Cash Advance Report Number",
                                    flex: 2,
                                    cellStyle: (params: any) => {
                                        return calculateDate(
                                            params.data
                                                ?.CASH_ADVANCE_REQUESTED_DATE
                                        );
                                    },
                                    cellRenderer: (params: any) => {
                                        const cashAdvanceReportNumber =
                                            params.data.cash_advance_report
                                                ?.REPORT_CASH_ADVANCE_NUMBER;

                                        return cashAdvanceReportNumber
                                            ? cashAdvanceReportNumber
                                            : "-";
                                    },
                                },
                                {
                                    headerName: "Request Date",
                                    field: "CASH_ADVANCE_REQUESTED_DATE",
                                    flex: 2,
                                    cellStyle: (params: any) => {
                                        return calculateDate(
                                            params.data
                                                ?.CASH_ADVANCE_REQUESTED_DATE
                                        );
                                    },
                                    valueFormatter: (params: any) => {
                                        return dateFormat(
                                            params.value,
                                            "dd-mm-yyyy"
                                        );
                                    },
                                },
                                {
                                    headerName: "Amount",
                                    field: "CASH_ADVANCE_TOTAL_AMOUNT",
                                    flex: 2,
                                    cellStyle: (params: any) => {
                                        return calculateDate(
                                            params.data
                                                ?.CASH_ADVANCE_REQUESTED_DATE
                                        );
                                    },
                                    valueFormatter: (params: any) => {
                                        return formatCurrency.format(
                                            params.value
                                        );
                                    },
                                },
                                {
                                    headerName: "Cash Advance",
                                    children: [
                                        {
                                            headerName: "Approve",
                                            flex: 2,
                                            cellHeader: "header-center",
                                            cellStyle: (params: any) => {
                                                return calculateDate(
                                                    params.data
                                                        ?.CASH_ADVANCE_REQUESTED_DATE
                                                );
                                            },
                                            cellRenderer: (params: any) => {
                                                const first_approval_status =
                                                    params.data
                                                        .CASH_ADVANCE_FIRST_APPROVAL_STATUS;

                                                const first_approval_user =
                                                    params.data
                                                        .CASH_ADVANCE_FIRST_APPROVAL_USER;

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
                                                        .CASH_ADVANCE_SECOND_APPROVAL_STATUS;
                                                const second_approval_user =
                                                    params.data
                                                        .CASH_ADVANCE_SECOND_APPROVAL_USER;

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
                                                }

                                                const third_approval_status =
                                                    params.data
                                                        .CASH_ADVANCE_THIRD_APPROVAL_STATUS;
                                                const third_approval_user =
                                                    params.data
                                                        .CASH_ADVANCE_THIRD_APPROVAL_USER;

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
                                                                    first_approval_user
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
                                            cellStyle: (params: any) => {
                                                return calculateDate(
                                                    params.data
                                                        ?.CASH_ADVANCE_REQUESTED_DATE
                                                );
                                            },
                                            cellRenderer: (params: any) => {
                                                const paramsData = params.data;
                                                const status =
                                                    paramsData?.CASH_ADVANCE_SECOND_APPROVAL_STATUS ===
                                                    5
                                                        ? "Execute"
                                                        : "Pending";

                                                return (
                                                    <BadgeFlat
                                                        className={
                                                            status === "Execute"
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-yellow-300 text-white"
                                                        }
                                                        title={status}
                                                        body={status}
                                                    />
                                                );
                                            },
                                            valueGetter: (params: any) => {
                                                const status =
                                                    params.data
                                                        ?.CASH_ADVANCE_SECOND_APPROVAL_STATUS ===
                                                    5
                                                        ? "Execute"
                                                        : "Pending";
                                                console.log(
                                                    "Value Getter Status:",
                                                    status
                                                );
                                                return status;
                                            },
                                        },
                                    ],
                                },

                                {
                                    headerName: "Cash Advance Report",
                                    children: [
                                        {
                                            headerName: "Approve",
                                            flex: 2,
                                            cellHeader: "header-center",
                                            cellStyle: (params: any) => {
                                                return calculateDate(
                                                    params.data
                                                        ?.CASH_ADVANCE_REQUESTED_DATE
                                                );
                                            },
                                            cellRenderer: (params: any) => {
                                                const first_approval_status =
                                                    params.data
                                                        .cash_advance_report
                                                        ?.REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS;
                                                const first_approval_user =
                                                    params.data
                                                        .cash_advance_report
                                                        ?.REPORT_CASH_ADVANCE_FIRST_APPROVAL_USER;

                                                let badgeClass = "";
                                                let title = "";

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
                                                        .cash_advance_report
                                                        ?.REPORT_CASH_ADVANCE_SECOND_APPROVAL_STATUS;
                                                const second_approval_user =
                                                    params.data
                                                        .cash_advance_report
                                                        ?.REPORT_CASH_ADVANCE_SECOND_APPROVAL_USER;

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
                                                    second_approval_status === 6
                                                ) {
                                                    badgeClassSecond =
                                                        "bg-green-100 text-green-700";
                                                    titleSecond = "Complited";
                                                }

                                                const third_approval_status =
                                                    params.data
                                                        .cash_advance_report
                                                        ?.REPORT_CASH_ADVANCE_THIRD_APPROVAL_STATUS;
                                                const third_approval_user =
                                                    params.data
                                                        .cash_advance_report
                                                        ?.REPORT_CASH_ADVANCE_THIRD_APPROVAL_USER;

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
                                                                    first_approval_user
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
                                            cellStyle: (params: any) => {
                                                return calculateDate(
                                                    params.data
                                                        ?.CASH_ADVANCE_REQUESTED_DATE
                                                );
                                            },
                                            cellRenderer: (params: any) => {
                                                const paramsData = params.data;
                                                const status =
                                                    paramsData
                                                        .cash_advance_report
                                                        ?.REPORT_CASH_ADVANCE_SECOND_APPROVAL_STATUS ===
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
                                            valueGetter: (params: any) => {
                                                // Mengembalikan nilai status untuk digunakan dalam filter
                                                const status =
                                                    params.data
                                                        ?.cash_advance_report
                                                        ?.REPORT_CASH_ADVANCE_SECOND_APPROVAL_STATUS ===
                                                    6
                                                        ? "Execute"
                                                        : "Pending";
                                                return status;
                                            },
                                        },
                                    ],
                                },
                                {
                                    headerName: "Action",
                                    field: "",
                                    flex: 2,
                                    autoHeight: true,
                                    cellStyle: (params: any) => {
                                        return calculateDate(
                                            params.data
                                                ?.CASH_ADVANCE_REQUESTED_DATE
                                        );
                                    },
                                    cellRenderer: (params: any) => {
                                        const paramsData = params.data;
                                        return (
                                            <>
                                                <select
                                                    className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 cursor-pointer"
                                                    onChange={(e) =>
                                                        handleSelectChange(
                                                            e,
                                                            paramsData.CASH_ADVANCE_ID,
                                                            paramsData
                                                                .cash_advance_report
                                                                ?.REPORT_CASH_ADVANCE_ID,
                                                            paramsData.CASH_ADVANCE_DIVISION,
                                                            paramsData.CASH_ADVANCE_COST_CENTER,
                                                            paramsData.CASH_ADVANCE_BRANCH,
                                                            paramsData.CASH_ADVANCE_USED_BY,
                                                            paramsData.CASH_ADVANCE_REQUESTED_BY,
                                                            paramsData.CASH_ADVANCE_FIRST_APPROVAL_BY,
                                                            paramsData.CASH_ADVANCE_TOTAL_AMOUNT
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
                                                    <option value="createReport">
                                                        Create CA Report
                                                    </option>
                                                    <option value="detailReport">
                                                        Detail CA Report
                                                    </option>
                                                    <option value="approveReport">
                                                        Approve Report
                                                    </option>
                                                    <option value="revisedReport">
                                                        Revised Report
                                                    </option>
                                                    <option value="executeReport">
                                                        Execute Report
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
