import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import InputLabel from "@/Components/InputLabel";
import TableTH from "@/Components/Table/TableTH";
import axios from "axios";
import { useState, FormEvent, useEffect, ChangeEvent } from "react";
import TableTD from "@/Components/Table/TableTD";
import TextInput from "@/Components/TextInput";
import Button from "@/Components/Button/Button";
import { CustomFlowbiteTheme, Datepicker, Textarea } from "flowbite-react";
import Dropdown from "@/Components/Dropdown";
import ModalToAction from "@/Components/Modal/ModalToAction";
import TH from "@/Components/TH";
import TD from "@/Components/TD";
import ToastMessage from "@/Components/ToastMessage";
import Pagination from "@/Components/Pagination";
import {
    ArrowDownTrayIcon,
    ArrowPathIcon,
} from "@heroicons/react/20/solid";
import dateFormat, { masks } from "dateformat";
import ModalSearch from "@/Components/Modal/ModalSearch";
import Input from "@/Components/Input";
import Select from "react-tailwindcss-select";
import CurrencyInput from "react-currency-input-field";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";

export default function CashAdvance({ auth }: PageProps) {
    const datePickerTheme: CustomFlowbiteTheme['datepicker'] = {
        "popup": {
            "root": {
                "base": "fixed z-50 block pt-2"
            }
        }
    };

    useEffect(() => {
        getCARequestStatus();
        getCAApprove1Status();
        getCAApprove2Status();
        getCAPendingReportStatus();
        getCANeedRevisionStatus();
        getCARejectStatus();
        getCADifferents();
    }, []);

    const handleRefresh = () => {
        getCA();
        getCARequestStatus();
        getCAApprove1Status();
        getCAApprove2Status();
        getCAPendingReportStatus();
        getCANeedRevisionStatus();
        getCARejectStatus();
        getCADifferents();
    }

    // Modal Add Start
    const [modal, setModal] = useState({
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
        add_files_report: false,
        show_files_report: false,
        add_files_execute_report: false,
        index: "",
        index_show: "",
        index_show_report: "",
    });
    // Modal Add Files End

    const { data, setData, errors, reset } = useForm<any>({
        cash_advance_id: "",
        cash_advance_used_by: "",
        cash_advance_requested_by: "",
        cash_advance_division: "",
        cash_advance_first_approval_by: "",
        cash_advance_request_note: "",
        cash_advance_delivery_method_transfer: "",
        cash_advance_transfer_amount: "",
        cash_advance_delivery_method_cash: "",
        cash_advance_cash_amount: "",
        cash_advance_total_amount: "",
        cash_advance_total_amount_request: "",
        cash_advance_transfer_date: "",
        cash_advance_from_bank_account: "",
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
        cash_advance_first_approval_by: "",
        cash_advance_request_note: "",
        cash_advance_delivery_method_transfer: "",
        cash_advance_transfer_amount: "",
        cash_advance_delivery_method_cash: "",
        cash_advance_cash_amount: "",
        cash_advance_total_amount: "",
        cash_advance_total_amount_request: "",
        cash_advance_transfer_date: "",
        cash_advance_from_bank_account: "",
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
            cash_advance_first_approval_by: "",
            cash_advance_request_note: "",
            cash_advance_delivery_method_transfer: "",
            cash_advance_transfer_amount: "",
            cash_advance_delivery_method_cash: "",
            cash_advance_cash_amount: "",
            cash_advance_total_amount: "",
            cash_advance_total_amount_request: "",
            cash_advance_transfer_date: "",
            cash_advance_from_bank_account: "",
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

        setIsSuccess(message);
        getCA();
        getCAReport();
        getCANumber();
        getCARequestStatus();
        getCAApprove1Status();
        getCAApprove2Status();
        getCAPendingReportStatus();
        getCANeedRevisionStatus();
        getCARejectStatus();
        getCADifferents();
    };
    // Handle Success End

    const [dataById, setDataById] = useState<any>({
        CASH_ADVANCE_REQUEST_NOTE: "",
        cash_advance_detail: [
            {
                CASH_ADVANCE_DETAIL_ID: "",
                CASH_ADVANCE_DETAIL_PURPOSE: "",
                CASH_ADVANCE_DETAIL_LOCATION: "",
                CASH_ADVANCE_DETAIL_AMOUNT: "",
                CASH_ADVANCE_DETAIL_NOTE: "",
                CASH_ADVANCE_DETAIL_DOCUMENT_ID: [],
                cash_advance_detail_document_id: "",
            },
        ],
        user: [
            {
                id: "",
                name: "",
                email: "",
                role_id: "",
            },
        ],
        user_used_by: [
            {
                id: "",
                name: "",
                email: "",
                role_id: "",
            },
        ],
        user_approval: [
            {
                id: "",
                name: "",
                email: "",
                role_id: "",
            },
        ],
    });

    // Handle Add Row Start
    const [DataRow, setDataRow] = useState([
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
        // let totalDataRow.forEach((item) => {
        //     total_amount += Number(item.cash_advance_detail_amount);
        // });
        // setData("cash_advance_transfer_amount",)
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

        const CashAdvanceDetail: any = [...data.CashAdvanceDetail]

        CashAdvanceDetail[modalFiles.index].cash_advance_detail_document_id = [
            ...CashAdvanceDetail[modalFiles.index].cash_advance_detail_document_id,
            {
                cash_advance_detail_document_id: "",
            }
        ];

        setDataFilesRow({
            ...DataFilesRow,
            cash_advance_detail_document_id: [
                ...DataFilesRow.cash_advance_detail_document_id,
                {
                    cash_advance_detail_document_id: ""
                }
            ]
        });

        setData({
            ...data,
            CashAdvanceDetail: CashAdvanceDetail
        });
    };

    // Handle Add Row Files Start
    const handleChangeAddFiles = (e: any, i: number) => {
        const { name, files } = e.target;

        const onchangeFile: any = [...DataFilesRow.cash_advance_detail_document_id];
        const onchangeFileData: any = [...data.CashAdvanceDetail];

        onchangeFile[i][name] = files[0];
        onchangeFileData[modalFiles.index][name][i] = files[0];

        setData("CashAdvanceDetail", onchangeFileData);

        setDataFilesRow({...DataFilesRow, cash_advance_detail_document_id: onchangeFile});
    };
    // Handle Add Row Files End

    // Handle Remove Files Row Start
    const handleRemoveFilesRow = (e: any, i: number) => {
        e.preventDefault()

        const deleteFilesRow = [...DataFilesRow.cash_advance_detail_document_id];

        const deleteFilesData: any = [...data.CashAdvanceDetail];

        deleteFilesRow.splice(i, 1);

        deleteFilesData[modalFiles.index].cash_advance_detail_document_id.splice(i, 1);

        setDataFilesRow({...DataFilesRow, cash_advance_detail_document_id: deleteFilesRow});

        setData({...data, CashAdvanceDetail: deleteFilesData});
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

        const CashAdvanceDetail: any = [...dataCAReport.CashAdvanceDetail]

        CashAdvanceDetail[modalFiles.index].cash_advance_detail_document_id = [
            ...CashAdvanceDetail[modalFiles.index].cash_advance_detail_document_id,
            {
                cash_advance_detail_document_id: "",
            }
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
            CashAdvanceDetail: CashAdvanceDetail
        });
    };

    console.log("Data Row : ", DataRow);
    // console.log("Button index : ", modalFiles.index);
    console.log("Data File CA", dataCAReport);

    // Handle Add Row Files Report Start
    const handleChangeAddFilesReport = (e: any, i: number) => {
        const { name, files } = e.target;

        // const onchangeFile: any = [...DataFilesReportRow.cash_advance_detail_document_id];
        const onchangeFileData: any = [...dataCAReport.CashAdvanceDetail];

        // onchangeFile[i][name] = files[0];
        onchangeFileData[modalFiles.index][name][i] = files[0];

        setDataCAReport({...dataCAReport, CashAdvanceDetail: onchangeFileData});

        // setDataFilesReportRow({...DataFilesReportRow, cash_advance_detail_document_id: onchangeFile});
    };
    // Handle Add Row Files End
    

    // Handle Remove Files Report Row Start
    const handleRemoveFilesReportRow = (e: any, i: number) => {
        e.preventDefault()

        // const deleteFilesRow = [...DataFilesReportRow.cash_advance_detail_document_id];

        const deleteFilesData: any = [...dataCAReport.CashAdvanceDetail];

        // deleteFilesRow.splice(i, 1);

        deleteFilesData[modalFiles.index].cash_advance_detail_document_id.splice(i, 1);

        // setDataFilesReportRow({...DataFilesReportRow, cash_advance_detail_document_id: deleteFilesRow});

        setDataCAReport({...dataCAReport, CashAdvanceDetail: deleteFilesData});
    };
    // Handle Remove Files Report Row End

    // Handle Add Row Proof of Document Start
    const handleAddRowProofOfDocument = (e: FormEvent) => {
        e.preventDefault();

        setDataCAReport({
            ...dataCAReport, proof_of_document: [
                ...dataCAReport.proof_of_document, {
                    proof_of_document: ""
                }
            ]
        });
    };
    // Handle Add Row Proof of Document End

    // Handle Change Row Proof of Document Start
    const handleChangeProofOfDocument = (e: any, i: number) => {
        const { name, files } = e.target;

        const onchangeFileData: any = [...dataCAReport.proof_of_document];

        onchangeFileData[i][name] = files[0];

        setDataCAReport({...dataCAReport, proof_of_document: onchangeFileData});
    };
    // Handle Change Row Proof of Document End

    // Handle Remove Row Proof of Document Row Start
    const handleRemoveProofOfDocument = (e: any, i: number) => {
        e.preventDefault()

        const deleteFilesData: any = [...dataCAReport.proof_of_document];

        deleteFilesData.splice(i, 1);

        setDataCAReport({...dataCAReport, proof_of_document: deleteFilesData});
    };
    // Handle Remove Row Proof of Document Row End

    // Handle Add Row Revised Start
    const handleAddRowRevised = (e: any) => {
        setDataById({
            ...dataById, cash_advance_detail: [
                ...dataById.cash_advance_detail, {
                    CASH_ADVANCE_DETAIL_AMOUNT: "",
                    CASH_ADVANCE_DETAIL_DOCUMENT_ID: [],
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
                    CASH_ADVANCE_ID: ""
                }
            ]
        })
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
    const handleRemoveRowRevised = (i: number) => {
        const deleteRow = [...dataById.cash_advance_detail];

        deleteRow.splice(i, 1);

        setDataById({ ...dataById, cash_advance_detail: deleteRow });
    };
    // Handle Remove Row Revised End

    // Handle Add Row Revised Files Start
    const handleAddRowRevisedFiles = (e: FormEvent) => {
        e.preventDefault();

        const cash_advance_detail: any = [...dataById.cash_advance_detail];
        
        cash_advance_detail[modalFiles.index_show].CASH_ADVANCE_DETAIL_DOCUMENT_ID = [
            ...(cash_advance_detail[modalFiles.index_show].CASH_ADVANCE_DETAIL_DOCUMENT_ID || []),
            {
                CASH_ADVANCE_DETAIL_DOCUMENT_ID: "",
            },
        ];

        setDataById({
            ...dataById, cash_advance_detail: cash_advance_detail
        });
    };
    // Handle Add Row Revised Files End

    // Handle Change Revised Files Start
    const handleChangeRevisedFiles = (e: any, i:number) => {

        const { name, files } = e.target;

        const onchangeFileData: any = [...dataById.cash_advance_detail];
        
        onchangeFileData[modalFiles.index_show].CASH_ADVANCE_DETAIL_DOCUMENT_ID[i][name] = files[0];

        setDataById({ ...dataById, cash_advance_detail: onchangeFileData });
    };
    // Handle Change Revised Files End

    // Handle Remove Row Revised Files Start
    const handleRemoveRowRevisedFiles = (e:any, i: number) => {
        const deleteRow = [...dataById.cash_advance_detail];

        deleteRow[modalFiles.index_show].CASH_ADVANCE_DETAIL_DOCUMENT_ID.splice(i, 1);

        setDataById({ ...dataById, cash_advance_detail: deleteRow });
    };
    // Handle Remove Row Revised Files End

    // Handle Remove Row Revised Show Files Start
    const handleRemoveRowRevisedShowFiles = (e:any, i: number) => {
        const deleteRow = [...dataById.cash_advance_detail];

        deleteRow[modalFiles.index_show].m_cash_advance_document.splice(i, 1);

        setDataById({ ...dataById, cash_advance_detail: deleteRow });
    };
    // Handle Remove Row Revised Show Files End

    // Handle Add Row Report CA Start
    const [DataReportRow, setDataReportRow] = useState([
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
            ...dataCAReport, CashAdvanceDetail: [
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
                }
            ]
        });
    };
    // Handle Add Row Report CA End

    // Handle Change Add Report CA Start
    const handleChangeAddReport = (e: any, i: number) => {
        const { name, value } = e.target;

        const onchangeVal: any = [...dataCAReport.CashAdvanceDetail];

        onchangeVal[i][name] = value;

        setDataReportRow(onchangeVal);

        setDataCAReport({...dataCAReport, CashAdvanceDetail: onchangeVal});
    };
    // Handle Change Add Report CA End

    // Handle Change Add Report Custom CA Start
    const handleChangeAddReportCustom = (value: any, name: any, i: number) => {
        const onchangeVal: any = [...dataCAReport.CashAdvanceDetail];

        onchangeVal[i][name] = value;

        setDataReportRow(onchangeVal);

        setDataCAReport({...dataCAReport, CashAdvanceDetail: onchangeVal});
    };
    // Handle Change Add Report Custom CA End

    // Handle Change Add Report Date CA Start
    const handleChangeAddReportDate = (date: any, name: any, i: number) => {
        const onchangeVal: any = [...dataCAReport.CashAdvanceDetail];

        onchangeVal[i][name] = date.toLocaleDateString("en-CA");

        setDataReportRow(onchangeVal);

        setDataCAReport({...dataCAReport, CashAdvanceDetail: onchangeVal});
    };
    // Handle Change Add Report Date CA End

    // Handle Remove Row Report CA Start
    const handleRemoveReportRow = (i: number) => {
        const deleteRow = [...dataCAReport.CashAdvanceDetail];

        deleteRow.splice(i, 1);

        setDataReportRow(deleteRow);

        setDataCAReport({...dataCAReport, CashAdvanceDetail: deleteRow});
    };
    // Handle Remove Row Report CA End

    // Handle Remove Row Revised Start
    const handleAddRowRevisedReport = (e:any) => {
        setDataReportById({ 
            ...dataReportById, cash_advance_detail_report: [
                ...dataReportById.cash_advance_detail_report, {
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
                    REPORT_CASH_ADVANCE_ID: ""
                }
            ]
        });
    };
    // Handle Remove Row Revised End

    // Handle Change Approve Report Start
    const handleChangeApproveReport = (e: any, i: number) => {
        const { name, value } = e.target;

        const onchangeVal: any = [...dataReportById.cash_advance_detail_report];

        onchangeVal[i][name] = value;

        setDataReportById({ ...dataReportById, cash_advance_detail_report: onchangeVal });
    };
    // Handle Change Approve Report End

    // Handle Change Approve Custom Report Start
    const handleChangeApproveReportCustom = (value: any, name: any, i: number) => {

        const onchangeVal: any = [...dataReportById.cash_advance_detail_report];

        onchangeVal[i][name] = value;

        setDataReportById({ ...dataReportById, cash_advance_detail_report: onchangeVal });
    };
    // Handle Change Approve Custom Report End

    // Handle Change Revised Report Start
    const handleChangeRevisedReport = (e: any, i: number) => {
        const { name, value } = e.target;

        const onchangeVal: any = [...dataReportById.cash_advance_detail_report];

        onchangeVal[i][name] = value;

        setDataReportById({ ...dataReportById, cash_advance_detail_report: onchangeVal });
    };
    // Handle Change Revised Report End

    // Handle Change Revised Report Custom Start
    const handleChangeRevisedReportCustom = (value: any, name: any, i: number) => {

        const onchangeVal: any = [...dataReportById.cash_advance_detail_report];

        onchangeVal[i][name] = value;

        setDataReportById({ ...dataReportById, cash_advance_detail_report: onchangeVal });
    };
    // Handle Change Revised Report Custom End

    // Handle Change Revised Report Date Start
    const handleChangeRevisedReportDate = (date: any, name: any, i: number) => {

        const onchangeVal: any = [...dataReportById.cash_advance_detail_report];

        onchangeVal[i][name] = date.toLocaleDateString("en-CA");

        setDataReportById({ ...dataReportById, cash_advance_detail_report: onchangeVal });
    };
    // Handle Change Revised Report Date End

    // Handle Remove Row Revised Start
    const handleRemoveRowRevisedReport = (i: number) => {
        const deleteRow = [...dataReportById.cash_advance_detail_report];

        deleteRow.splice(i, 1);

        setDataReportById({ ...dataReportById, cash_advance_detail_report: deleteRow });
    };
    // Handle Remove Row Revised End

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
    const [searchCA, setSearchCA] = useState<any>({
        cash_advance_requested_by: "",
        cash_advance_used_by: "",
        cash_advance_start_date: "",
        cash_advance_end_date: "",
        cash_advance_division: "",
        cash_advance_type: "",
    });

    console.log("searchCA", searchCA);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getCA = async (pageNumber = "page=1", status = "", status_type = "") => {
        // setIsLoading(true);
        // alert(status);
        // return false;
        await axios
            .post(`/getCA?${pageNumber}`, {
                cash_advance_requested_by: searchCA.cash_advance_requested_by,
                cash_advance_used_by: searchCA.cash_advance_used_by,
                cash_advance_start_date: searchCA.cash_advance_start_date,
                cash_advance_end_date: searchCA.cash_advance_end_date,
                cash_advance_division: searchCA.cash_advance_division,
                cash_advance_type: searchCA.cash_advance_type,
                status: status,
                status_type: status_type
            })
            .then((res) => {
                setCA(res.data);
                // setIsLoading(false);
                // if (modal.search) {
                //     setModal({
                //         add: false,
                //         delete: false,
                //         edit: false,
                //         view: false,
                //         document: false,
                //         search: false,
                //         search_ca_report: false,
                //         approve: false,
                //         report: false,
                //         execute: false,
                //         view_report: false,
                //         approve_report: false,
                //         revised_report: false,
                //         execute_report: false,
                //     });
                // }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // Clear Search Start
    const clearSearchCA = async (pageNumber = "page=1") => {
        await axios
            .post(`/getCA?${pageNumber}`)
            .then((res) => {
                setCA(res.data);
                setSearchCA({
                    cash_advance_requested_by: "",
                    cash_advance_used_by: "",
                    cash_advance_start_date: "",
                    cash_advance_end_date: "",
                    cash_advance_division: "",
                });
                // console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    // Clear Search End

    const [cashAdvanceReport, setCAReport] = useState<any>([]);
    const [searchCAReport, setSearchCAReport] = useState<any>({
        REPORT_CASH_ADVANCE_NUMBER: "",
    });
    const [isLoadingReport, setIsLoadingReport] = useState<boolean>(false);
    const getCAReport = async (pageNumber = "page=1") => {
        setIsLoading(true);
        await axios
            .post(`/getCAReport?${pageNumber}`, {
                REPORT_CASH_ADVANCE_NUMBER: searchCAReport.REPORT_CASH_ADVANCE_NUMBER,
            })
            .then((res) => {
                setCAReport(res.data);
                setIsLoadingReport(false);
                if (modal.search_ca_report) {
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
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };
    // Search End

    // const getCA = async (pageNumber = "page=1") => {
    //     await axios
    //         .get(`/getCA?${pageNumber}`)
    //         .then((res) => {
    //             setCA(res.data);
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // };

    // Data Start

    const [getCountCARequestStatus, setCountCARequestStatus] = useState<any>([]);
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

    const [getCountCAApprove1Status, setCountCAApprove1Status] = useState<any>([]);
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

    const [getCountCAApprove2Status, setCountCAApprove2Status] = useState<any>([]);
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

    const [getCountCAPendingReportStatus, setCountCAPendingReportStatus] = useState<any>([]);
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

    const [getCountCANeedRevisionStatus, setCountCANeedRevisionStatus] = useState<any>([]);
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

    const [getCashAdvanceDifferents, setCashAdvanceDifferents] = useState<any>([]);
    const getCADifferents = async () => {
        await axios
            .get(`/getCashAdvanceDifferents`)
            .then((res) => {
                console.log("getCashAdvanceDifferents", getCashAdvanceDifferents)
                setCashAdvanceDifferents(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const {
        users,
        cash_advance_purpose,
        cash_advance_cost_classification,
        relations,
        coa,
        persons
    }: any = usePage().props;

    const types = [
        {
            id: 1,
            name: "Settlement",
        },
        {
            id: 2,
            name: "Refund",
        },
    ];

    const methods = [
        {
            id: 1,
            name: "Cash",
        },
        {
            id: 2,
            name: "Transfer",
        },
    ];
    // Data End

    // Handle Approve Start
    const handleAddModal = async (e: FormEvent, transfer_method: number, cash_method: number) => {
        e.preventDefault();

        setData({
            ...data,
            cash_advance_delivery_method_transfer: transfer_method,
            cash_advance_delivery_method_cash: cash_method
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
        })
    };
    // Handle Approve End

    // Handle Approve Start
    const handleApproveModal = async (e: FormEvent, id: number) => {
        e.preventDefault();

        await axios
            .get(`/getCAById/${id}`)
            .then((res) => {
                setDataById(res.data);
                console.log(res.data);
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
                console.log(res.data);
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
                console.log(res.data);
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
    const handleAddCAReportModal = async (e: FormEvent, id: number, used_by: number, first_approval_by: number, total_amount: number) => {
        e.preventDefault();

        setDataCAReport(
            {...dataCAReport, 
                cash_advance_id: id, 
                cash_advance_used_by: used_by, 
                cash_advance_first_approval_by: first_approval_by,
                cash_advance_total_amount_request: total_amount
            }
        );

        await axios
            .get(`/getCAById/${id}`)
            .then((res) => {
                setDataById(res.data);
                console.log(res.data);
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
    const handleShowModal = async (e: FormEvent, id: number) => {
        e.preventDefault();

        await axios
            .get(`/getCAById/${id}`)
            .then((res) => {
                setDataById(res.data);
                console.log(res.data);
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
                console.log(res.data);
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
                console.log(res.data);
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
                console.log(res.data);
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

        setDataCAReport(
            {...dataCAReport, 
                cash_advance_id: id
            }
        );

        await axios
            .get(`/getCAReportById/${id}`)
            .then((res) => {
                setDataReportById(res.data);
                console.log(res.data);
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

        // console.log(dataById);

        await axios
            .patch(`/cashAdvanceApprove/${dataById.CASH_ADVANCE_ID}`, dataById, {
                headers: {
                    "Content-type": "multipart/form-data",
                },
            })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleBtnReportStatus = async (status: number) => {
        setDataReportById({
            ...dataReportById,
            REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS: status,
        });

        // console.log(dataById);

        await axios
            .patch(`/cashAdvanceReportApprove/${dataReportById.CASH_ADVANCE_ID}`, dataReportById, {
                headers: {
                    "Content-type": "multipart/form-data",
                },
            })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleBtnRevised = async () => {
        await axios
            .patch(`/cashAdvanceRevised/${dataById.CASH_ADVANCE_ID}`, dataById, {
                headers: {
                    "Content-type": "multipart/form-data",
                },
            })
            .then((res) => {
                console.log(res);
                close();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // Handle Add Files Start
    const handleAddFilesModal = async (e: FormEvent, id: number) => {
        e.preventDefault();

        // await axios
        //     .get(`/getCAReportById/${id}`)
        //     .then((res) => {
        //         setDataReportById(res.data);
        //         console.log(res.data);
        //     })
        //     .catch((err) => console.log(err));

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
        });
    };
    // Handle Add Files End

    const handleFileDownload = async (id: number, key: number) => {
        await axios({
            url: `/cashAdvanceDownload/${id}/${key}`,
            method: "GET",
            responseType: "blob",
        })
            .then((response) => {
                console.log(response);
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
                        text: "File not found",
                    });
                }
            });
    };

    const handleFileReportDownload = async (id: number, key: number) => {
        await axios({
            url: `/cashAdvanceReportDownload/${id}/${key}`,
            method: "GET",
            responseType: "blob",
        })
            .then((response) => {
                console.log(response);
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
                    alert("File not Found");
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

    DataRow.forEach((item) => {
        total_amount += Number(item.cash_advance_detail_amount);

        if (isNaN(total_amount)) {
            total_amount = "";
        }
    });
    
    useEffect(() => {
        if(total_amount !== 0){
            setData("cash_advance_transfer_amount", total_amount)
        }         
    }, [total_amount]);

    let total_amount_report = 0;

    DataReportRow.forEach((item) => {
        total_amount_report += Number(item.cash_advance_detail_amount);

        if (isNaN(total_amount_report)) {
            total_amount_report = "";
        }
    });


    // useEffect(() => {
    //     if(total_amount_report !== 0){
    //         setDataCAReport({
    //             ...dataCAReport, 
    //             amount: total_amount_report - dataReportById?.cash_advance.CASH_ADVANCE_TOTAL_AMOUNT
    //         })
    //     }         
    // }, [total_amount_report]);

    let revised_total_amount = 0;

    dataById.cash_advance_detail.forEach((item: any) => {
        revised_total_amount += Number(item.CASH_ADVANCE_DETAIL_AMOUNT);
        if (isNaN(revised_total_amount)) {
            revised_total_amount = "";
        }
    });

    useEffect(() => {
        if(revised_total_amount !== 0 ){
            setDataById({
                ...dataById,
                CASH_ADVANCE_TRANSFER_AMOUNT: revised_total_amount,
            });
        }         
    }, []);

    let revised_total_amount_report = 0;

    dataReportById?.cash_advance_detail_report.forEach((item: any) => {
        revised_total_amount_report += Number(item.REPORT_CASH_ADVANCE_DETAIL_AMOUNT);
        if (isNaN(revised_total_amount_report)) {
            revised_total_amount_report = "";
        }
    });

    let total_amount_approve = 0;

    dataReportById?.cash_advance_detail_report.forEach((item: any) => {
        total_amount_approve += Number(item.REPORT_CASH_ADVANCE_DETAIL_AMOUNT_APPROVE);
        if (isNaN(total_amount_approve)) {
            total_amount_approve = "";
        }
    });

    const [toggleState, setToggleState] = useState(1);

    const toggleTab = (i: number) => {
        setToggleState(i);
    };

    const [checkedTransfer, setCheckedTransfer] = useState(true);
    const handleCheckedTransfer = (e:any) => {
        if (checkedTransfer === true) {
            setData("cash_advance_transfer_amount", 0);
        }

        setCheckedTransfer(!checkedTransfer);

        setDataById({
            ...dataById,
            CASH_ADVANCE_DELIVERY_METHOD_TRANSFER: e.target.value,
        })
    };

    const [checkedCash, setCheckedCash] = useState(false);
    const handleCheckedCash = (e:any) => {
        if (checkedTransfer === true) {
            setData("cash_advance_cash_amount", 0);
        }

        setDataById({
            ...dataById,
            CASH_ADVANCE_DELIVERY_METHOD_CASH: e.target.value,
        })
        setCheckedCash(!checkedCash);
    };

    // console.log("checkedCash", checkedCash)

    const [checkedTransferEdit, setCheckedTransferEdit] = useState(true);
    const handleCheckedTransferEdit = (e:any) => {
        if (checkedTransferEdit === true) {
            setDataById({
                ...dataById,
                CASH_ADVANCE_TRANSFER_AMOUNT: 0,
            })
        }
        setCheckedTransferEdit(!checkedTransferEdit);
    };

    console.log("checkedTransferEdit", checkedTransferEdit)

    const [checkedCashEdit, setCheckedCashEdit] = useState(true);
    const handleCheckedCashEdit = (e:any) => {
        if (checkedCashEdit === true) {
            setDataById({
                ...dataById,
                CASH_ADVANCE_CASH_AMOUNT: 0,
            })
        }
        setCheckedCashEdit(!checkedCashEdit);
    };

    console.log("checkedCashEdit", checkedCashEdit)

    const [checkedTransferReport, setCheckedTransferReport] = useState(false);
    const handleCheckedTransferReport = (e:any) => {
        setDataCAReport({...dataCAReport, cash_advance_delivery_method_transfer: e.target.value})
        // setDataReportById({
        //     ...dataReportById,
        //     CASH_ADVANCE_DELIVERY_METHOD_TRANSFER: e.target.value,
        // })
        setCheckedTransferReport(!checkedTransferReport);
    };

    const [checkedCashReport, setCheckedCashReport] = useState(false);
    const handleCheckedCashReport = (e:any) => {
        setDataCAReport({...dataCAReport, cash_advance_delivery_method_cash: e.target.value})
        // setDataReportById({
        //     ...dataReportById,
        //     CASH_ADVANCE_DELIVERY_METHOD_CASH: e.target.value,
        // })
        setCheckedCashReport(!checkedCashReport);
    };

    const [checkedTransferEditReport, setCheckedTransferEditReport] = useState(true);
    const handleCheckedTransferEditReport = (e:any) => {
        setDataReportById({
            ...dataReportById,
            REPORT_CASH_ADVANCE_DELIVERY_METHOD_TRANSFER: e.target.value,
        })
        setCheckedTransferEditReport(!checkedTransferEditReport);
    };

    const [checkedCashEditReport, setCheckedCashEditReport] = useState(true);
    const handleCheckedCashEditReport = (e:any) => {
        setDataReportById({
            ...dataReportById,
            REPORT_CASH_ADVANCE_DELIVERY_METHOD_CASH: e.target.value,
        })
        setCheckedCashEditReport(!checkedCashEditReport);
    };

    const timeline = [
        {
            id: 1,
            content: 'Applied to',
            target: 'Front End Developer',
            href: '#',
            date: 'Sep 20',
            datetime: '2020-09-20',
            icon: '',
            iconBackground: 'bg-gray-400',
        },
        {
            id: 2,
            content: 'Applied to',
            target: 'Front End Developer',
            href: '#',
            date: 'Sep 20',
            datetime: '2020-09-20',
            icon: '',
            iconBackground: 'bg-gray-400',
        },
    ]

    const selectPerson = persons?.filter((m:any)=> m.DIVISION_ID === auth.user.person?.DIVISION_ID && m.STRUCTURE_ID === 4).map((query: any) => {
        return {
            value: query.PERSON_ID,
            label: query.PERSON_FIRST_NAME,
        };
    });

    const selectApproval = persons?.filter((m:any)=> m.DIVISION_ID === auth.user.person?.DIVISION_ID && (m.STRUCTURE_ID === 2 || m.STRUCTURE_ID === 3)).map((query: any) => {
        return {
            value: query.PERSON_ID,
            label: query.PERSON_FIRST_NAME,
        };
    });

    const selectRelation = relations?.map((query: any) => {
        return {
            value: query.RELATION_ORGANIZATION_ID,
            label: query.RELATION_ORGANIZATION_NAME,
        };
    });

    const selectCoa = coa?.map((query: any) => {
        return {
            value: query.COA_ID,
            label: query.COA_CODE + " - " + query.COA_TITLE,
        };
    });

    // const [files, setFiles] = useState<any>();

    // const handleAddFiles = () => {

    // };
    console.log("Data", data);
    // console.log("Data Files", DataFilesRow);
    // console.log(files);
    // console.log(DataReportRow);
    console.log("Cash Advance", cashAdvance.data);
    // console.log("Cash Advance Report", cashAdvanceReport.data);
    console.log("Data CA By Id", dataById);
    console.log("Data Report By Id", dataReportById);
    console.log("Data CA Report", dataCAReport);
    // console.log("Search CA", persons);

    return (
        <AuthenticatedLayout user={auth.user} header={"Cash Advance"}>
            <Head title="Cash Advance" />

            {isSuccess && (
                <ToastMessage
                    message={isSuccess}
                    isShow={true}
                    isSuccess={true}
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
                // panelWidth={"65%"}
                body={
                    <>
                        <ModalToAction
                            classPanel={"relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 sm:min-w-full lg:min-w-[35%]"}
                            show={modalFiles.add_files}
                            closeable={true}
                            onClose={() =>
                                setModalFiles({
                                    add_files: false,
                                    show_files: false,
                                    add_files_report: false,
                                    show_files_report: false,
                                    index: ""
                                })
                            }
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
                                    {data.CashAdvanceDetail[modalFiles.index]?.cash_advance_detail_document_id.map((val: any, i:number) => (
                                        <div className="grid grid-cols-12 my-5" key={i}>
                                                <div className={`w-full col-span-11`}>
                                                    <InputLabel
                                                        htmlFor="files"
                                                        value="File"
                                                        className="mb-2"
                                                    />

                                                    {data.CashAdvanceDetail[modalFiles.index].cash_advance_detail_document_id[i]?.name ? (
                                                        <p>
                                                            {data.CashAdvanceDetail[modalFiles.index].cash_advance_detail_document_id[i]?.name}
                                                        </p>
                                                    ) : (
                                                        <Input
                                                            name="cash_advance_detail_document_id"
                                                            type="file"
                                                            className="w-full"
                                                            onChange={(e) =>
                                                                handleChangeAddFiles(e, i)
                                                            }
                                                        />
                                                    )}
                                                </div>
                                                <button
                                                    className="text-center self-center bg-red-600 hover:bg-red-500 text-white mx-2 mt-8 py-1 rounded-lg"
                                                    onClick={(e) =>
                                                        handleRemoveFilesRow(e, i)
                                                    }
                                                >
                                                    X
                                                </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="text-sm cursor-pointer hover:underline"
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
                                    value={auth.user.name}
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2 mb-1">
                                <InputLabel
                                    htmlFor="namaPemohon"
                                    className=""
                                >
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
                                    options={selectPerson}
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
                                <InputLabel
                                    htmlFor="cash_advance_division"
                                    value="Division"
                                    className="mb-4"
                                />
                                <TextInput
                                    id="cash_advance_division"
                                    type="text"
                                    name="cash_advance_division"
                                    value={auth.user.person.division?.RELATION_DIVISION_ALIAS}
                                    className="bg-gray-100"
                                    readOnly
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
                                        setData("cash_advance_first_approval_by", val)
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
                                        {DataRow.length > 1 && (
                                            <TH
                                                label="Action"
                                                className="border"
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
                                        <TH
                                            label="Name"
                                            className="border"
                                        />
                                        <TH
                                            label="Person"
                                            className="border"
                                        />
                                        <TH
                                            label="Position"
                                            className="border"
                                        />
                                    </tr>
                                </thead>
                                <tbody id="form_table">
                                    {DataRow.map((val, i) => (
                                        <tr className="text-center" key={i}>
                                            <TD className="border">{i + 1}.</TD>
                                            <TD className="border">
                                                <DatePicker
                                                    name="cash_advance_detail_start_date"
                                                    selected={val.cash_advance_detail_start_date}
                                                    onChange={(date: any) =>
                                                        handleChangeAddDate(date, "cash_advance_detail_start_date", i)
                                                    }
                                                    dateFormat={"dd-MM-yyyy"}
                                                    placeholderText="dd-mm-yyyyy"
                                                    className="border-0 rounded-md shadow-md text-sm h-9 w-[100%] focus:ring-2 focus:ring-inset focus:ring-red-600"
                                                    autoComplete="off"
                                                    required
                                                 />
                                            </TD>
                                            <TD className="border">
                                                <DatePicker
                                                    name="cash_advance_detail_end_date"
                                                    selected={val.cash_advance_detail_end_date}
                                                    onChange={(date: any) =>
                                                        handleChangeAddDate(date, "cash_advance_detail_end_date", i)
                                                    }
                                                    dateFormat={"dd-MM-yyyy"}
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
                                                        handleChangeAdd(e, i)
                                                    }
                                                >
                                                    <option value="">
                                                        -- Choose Purpose --
                                                    </option>
                                                    {cash_advance_purpose.map((purpose: any) => (
                                                        <option
                                                            key={purpose.CASH_ADVANCE_PURPOSE_ID}
                                                            value={purpose.CASH_ADVANCE_PURPOSE_ID}
                                                        >
                                                            {purpose.CASH_ADVANCE_PURPOSE}
                                                        </option>
                                                    ))}
                                                </select>
                                            </TD>
                                            <TD className="border">
                                                <Select
                                                    classNames={{
                                                        menuButton: () =>
                                                            `flex text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400 ring-1 ring-gray-300`,
                                                        menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                        listItem: ({ isSelected }: any) =>
                                                            `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                                isSelected
                                                                    ? `text-white bg-red-600`
                                                                    : `text-gray-500 hover:bg-red-100 hover:text-black`
                                                            }`,
                                                    }}
                                                    options={selectRelation}
                                                    isSearchable={true}
                                                    placeholder={"Choose Business Relation"}
                                                    value={val.cash_advance_detail_relation_organization_id}
                                                    onChange={(val: any) =>
                                                        handleChangeAddCustom(val, "cash_advance_detail_relation_organization_id", i)
                                                    }
                                                    primaryColor={"bg-red-500"}
                                                />
                                            </TD>
                                            <TD className="border">
                                                <TextInput
                                                    id="cash_advance_detail_relation_name"
                                                    type="text"
                                                    name="cash_advance_detail_relation_name"
                                                    value={val.cash_advance_detail_relation_name}
                                                    className="w-1/2"
                                                    autoComplete="off"
                                                    onChange={(e) =>
                                                        handleChangeAdd(e, i)
                                                    }
                                                />
                                            </TD>
                                            <TD className="border">
                                                <TextInput
                                                    id="cash_advance_detail_relation_position"
                                                    type="text"
                                                    name="cash_advance_detail_relation_position"
                                                    value={val.cash_advance_detail_relation_position}
                                                    className="w-1/2"
                                                    autoComplete="off"
                                                    onChange={(e) =>
                                                        handleChangeAdd(e, i)
                                                    }
                                                />
                                            </TD>
                                            <TD className="border">
                                                <TextInput
                                                    id="cash_advance_detail_location"
                                                    type="text"
                                                    name="cash_advance_detail_location"
                                                    value={val.cash_advance_detail_location}
                                                    className="w-1/2"
                                                    autoComplete="off"
                                                    onChange={(e) =>
                                                        handleChangeAdd(e, i)
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
                                                    onValueChange={(val: any) =>
                                                        handleChangeAddCustom(val, "cash_advance_detail_amount", i)
                                                    }
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                    required
                                                    placeholder="0.00"
                                                    autoComplete="off"
                                                />
                                            </TD>
                                            <TD className="border px-2">
                                                <div className="">
                                                    <button type="button"
                                                        className="bg-black hover:bg-slate-800 text-sm text-white py-2 px-3"
                                                        onClick={() => {
                                                            setModalFiles({
                                                                add_files: true,
                                                                show_files: false,
                                                                add_files_report: false,
                                                                show_files_report: false,
                                                                index: i
                                                            });
                                                        }}
                                                    >
                                                        {
                                                            data.CashAdvanceDetail[i]?.cash_advance_detail_document_id.length > 0
                                                            ?
                                                                (data.CashAdvanceDetail[i]?.cash_advance_detail_document_id?.length + ' Files')
                                                            :
                                                                'Add Files'
                                                        }
                                                    </button>
                                                </div>
                                            </TD>
                                            {DataRow.length > 1 && (
                                                <TD className="border">
                                                    <Button
                                                        className="my-1.5 px-3 py-1"
                                                        onClick={() =>
                                                            handleRemoveRow(i)
                                                        }
                                                        type="button"
                                                    >
                                                        X
                                                    </Button>
                                                </TD>
                                            )}
                                        </tr>
                                    ))}
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
                                        <TD>{formatCurrency.format(total_amount)}</TD>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        {/* Table form end */}

                        <div className="mt-10">
                            <fieldset className="bg-white pb-10 pt-5 rounded-lg border-2">
                                <legend className="ml-12 px-3 font-medium">Delivery Method</legend>
                                <div className="mt-4 mx-5 space-y-5">
                                    <div className="relative flex items-start">
                                        <div className="flex h-9 items-center">
                                            <input
                                                id="transfer"
                                                name="transfer"
                                                type="checkbox"
                                                aria-describedby="transfer-description"
                                                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                                                value={checkedTransfer === true ? 0 : 1}
                                                defaultChecked={true}
                                                onChange={(e) => handleCheckedTransfer(e)}
                                            />
                                        </div>
                                        <div className="flex w-full gap-4">
                                            <div className="ml-3 text-sm leading-9">
                                                <label htmlFor="transfer" className="font-medium text-gray-900">
                                                Transfer
                                                </label>
                                            </div>
                                            {checkedTransfer === true ? (
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
                                                        setData("cash_advance_transfer_amount", val)
                                                    }
                                                    className="block w-1/4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                    placeholder="0.00"
                                                    autoComplete="off"
                                                />
                                            ) : (
                                                <CurrencyInput
                                                    id="cash_advance_transfer_amount"
                                                    name="cash_advance_transfer_amount"
                                                    value="0"
                                                    decimalScale={2}
                                                    decimalsLimit={2}
                                                    className="block w-1/4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                    disabled
                                                />
                                            )}
                                            <TextInput
                                                id="account_number"
                                                type="text"
                                                name="account_number"
                                                value=""
                                                className="w-full lg:w-1/4"
                                                placeholder="Bank Account Name - Bank Account - Account Number"
                                                // onChange={(e) =>
                                                //     handleChangeAdd(e, i)
                                                // }
                                                // required
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
                                                value={checkedCash === true ? 0 : 1}
                                                onChange={(e) => handleCheckedCash(e)}
                                            />
                                        </div>
                                        <div className="flex w-full">
                                            <div className="ml-3 text-sm leading-9">
                                                <label htmlFor="cash" className="font-medium text-gray-900">
                                                Cash
                                                </label>
                                            </div>
                                            {checkedCash === true ? (
                                                <CurrencyInput
                                                    id="cash_advance_cash_amount"
                                                    name="cash_advance_cash_amount"
                                                    value={
                                                        data.cash_advance_cash_amount
                                                    }
                                                    decimalScale={2}
                                                    decimalsLimit={2}
                                                    onValueChange={(val: any) =>
                                                        setData("cash_advance_cash_amount", val)
                                                    }
                                                    className="block w-1/4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right ml-9"
                                                    placeholder="0.00"
                                                    autoComplete="off"
                                                />
                                            ) : (
                                                <CurrencyInput
                                                    id="cash_advance_cash_amount"
                                                    name="cash_advance_cash_amount"
                                                    value="0"
                                                    decimalScale={2}
                                                    decimalsLimit={2}
                                                    className="block w-1/4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right ml-9"
                                                    disabled
                                                />
                                            )}
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
                                    setData("cash_advance_request_note", e.target.value)
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
                // panelWidth={"65%"}
                body={
                    <>
                        <ModalToAction
                            classPanel={"relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 sm:min-w-full lg:min-w-[35%]"}
                            show={modalFiles.show_files}
                            closeable={true}
                            onClose={() =>
                                setModalFiles({
                                    add_files: false,
                                    show_files: false,
                                    add_files_report: false,
                                    show_files_report: false,
                                    index: ""
                                })
                            }
                            title="Show Files"
                            url={`/cashAdvanceDownload/${dataById.cash_advance_detail[modalFiles.index]?.CASH_ADVANCE_DETAIL_ID}`}
                            data=""
                            method=""
                            onSuccess=""
                            headers={null}
                            submitButtonName=""
                            // panelWidth=""
                            body={
                                <>
                                    <div className="grid grid-cols-12 my-3">
                                        {dataById.cash_advance_detail[modalFiles.index_show]?.m_cash_advance_document.map((file:any, i:number) => (
                                            <>
                                                <div className={`w-full col-span-11 mb-4`} key={i}>
                                                    <InputLabel
                                                        htmlFor="files"
                                                        value="File"
                                                        className="mb-2"
                                                    />
                                                    <p>
                                                        {dataById.cash_advance_detail[modalFiles.index_show].m_cash_advance_document[i]?.document.DOCUMENT_ORIGINAL_NAME}
                                                    </p>
                                                </div>
                                                <button 
                                                    type="button" 
                                                    title="Download File" 
                                                    onClick={() =>
                                                        handleFileDownload(
                                                            dataById.cash_advance_detail[modalFiles.index_show]?.CASH_ADVANCE_DETAIL_ID,
                                                            i
                                                        )
                                                    }
                                                >
                                                    <ArrowDownTrayIcon className="w-5 mt-7 m-auto cursor-pointer" />
                                                </button>
                                            </>
                                        ))}
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
                                    htmlFor="namaPemohon"
                                    value="Used By"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="namaPemohon"
                                    type="text"
                                    name="namaPemohon"
                                    value={dataById.person_used_by?.PERSON_FIRST_NAME}
                                    className="bg-gray-100"
                                    autoComplete="namaPemohon"
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById.user_used_by,
                                            name: e.target.value,
                                        })
                                    }
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
                                    value={auth.user.person.PERSON_FIRST_NAME}
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
                                    htmlFor="divisi"
                                    value="Division"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="divisi"
                                    type="text"
                                    name="divisi"
                                    value={auth.user.person.division.RELATION_DIVISION_ALIAS}
                                    className="bg-gray-100"
                                    autoComplete="divisi"
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            CASH_ADVANCE_DIVISION: e.target.value,
                                        })
                                    }
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
                                    value={dataById.person_approval?.PERSON_FIRST_NAME}
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
                                                    {cad.purpose?.CASH_ADVANCE_PURPOSE}
                                                </TD>
                                                <TD className="border px-3">
                                                    {cad.relation_organization?.RELATION_ORGANIZATION_NAME}
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {
                                                        cad.CASH_ADVANCE_DETAIL_RELATION_NAME
                                                    }
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {
                                                        cad.CASH_ADVANCE_DETAIL_RELATION_POSITION
                                                    }
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
                                                    {cad?.m_cash_advance_document?.length > 0 ? (
                                                        <button type="button"
                                                            className="bg-black hover:bg-slate-800 text-sm text-white py-2 px-3"
                                                            onClick={() => {
                                                                setModalFiles({
                                                                    add_files: false,
                                                                    show_files: true,
                                                                    add_files_report: false,
                                                                    show_files_report: false,
                                                                    index: "",
                                                                    index_show: i,
                                                                    index_show_report: "",
                                                                });
                                                            }}
                                                        >
                                                            
                                                            {cad?.m_cash_advance_document?.length} Files
                                                        </button>
                                                    ) : 
                                                        '-'
                                                    }
                                                </TD>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr className="text-center text-black text-sm leading-7">
                                        <TD
                                            className="border text-right pr-5 py-2"
                                            colSpan={8}
                                        >
                                            TOTAL AMOUNT
                                        </TD>
                                        <TD className="border py-2">
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
                                <legend className="ml-12 px-3 font-medium">Delivery Method</legend>
                                <div className="mt-4 mx-5 space-y-5">
                                    <div className="relative flex items-start">
                                        <div className="flex h-9 items-center">
                                            <input
                                            id="transfer"
                                            name="transfer"
                                            type="checkbox"
                                            aria-describedby="transfer-description"
                                            className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                                            value={1}
                                            checked={dataById?.CASH_ADVANCE_TRANSFER_AMOUNT > 0 && true}
                                            onChange={(e) => handleCheckedTransfer(e)}
                                            required
                                            />
                                        </div>
                                        <div className="flex w-full gap-4">
                                            <div className="ml-3 text-sm leading-9">
                                                <label htmlFor="transfer" className="font-medium text-gray-900">
                                                Transfer
                                                </label>
                                            </div>
                                            <CurrencyInput
                                                id="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                name="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                value={dataById.CASH_ADVANCE_TRANSFER_AMOUNT}
                                                decimalScale={2}
                                                decimalsLimit={2}
                                                className="block w-1/4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                disabled
                                                placeholder="0.00"
                                            />
                                            <TextInput
                                                id="account_number"
                                                type="text"
                                                name="account_number"
                                                value=""
                                                className="w-full lg:w-1/4"
                                                placeholder="Bank Account Name - Bank Account - Account Number"
                                                // onChange={(e) =>
                                                //     handleChangeAdd(e, i)
                                                // }
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
                                            value={2}
                                            checked={dataById?.CASH_ADVANCE_CASH_AMOUNT > 0 && true}
                                            onChange={(e) => handleCheckedCash(e)}
                                            />
                                        </div>
                                        <div className="flex w-full">
                                            <div className="ml-3 text-sm leading-9">
                                                <label htmlFor="cash" className="font-medium text-gray-900">
                                                Cash
                                                </label>
                                            </div>
                                            <CurrencyInput
                                                id="CASH_ADVANCE_CASH_AMOUNT"
                                                name="CASH_ADVANCE_CASH_AMOUNT"
                                                value={dataById.CASH_ADVANCE_CASH_AMOUNT}
                                                decimalScale={2}
                                                decimalsLimit={2}
                                                className="block w-1/4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right ml-9"
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
                                value={dataById.CASH_ADVANCE_REQUEST_NOTE}
                                readOnly
                            />
                        </div>

                        <div className="flow-root mt-10">
                            <p>Status</p>
                            <ul role="list" className="mt-5">
                                {/* {timeline.map((event, eventIdx) => ( */}
                                <li>
                                    <div className="relative pb-8">
                                        {/* {eventIdx !== timeline.length - 1 ? ( */}
                                            <span aria-hidden="true" className="absolute left-4 top-4 -ml-px h-12 w-0.5 bg-red-300" />
                                        {/* ) : null} */}
                                        <div className="relative flex space-x-3">
                                            <div>
                                                <span
                                                    className="bg-red-600 flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white"
                                                >
                                                    {/* <event.icon aria-hidden="true" className="h-5 w-5 text-white" /> */}

                                                </span>
                                            </div>
                                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                    Created{' '}
                                                    {/* <a href={event.href} className="font-medium text-gray-900">
                                                        {event.target}
                                                    </a> */}
                                                    </p>
                                                </div>
                                                <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                                    <time dateTime="2024-07-19">2024-07-19</time>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                {/* ))} */}
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
                url={`/cashAdvanceApprove/${dataById.cash_advance_detail.CASH_ADVANCE_DETAIL_ID}`}
                data={dataById}
                method="patch"
                onSuccess={handleSuccess}
                headers={null}
                submitButtonName={""}
                // panelWidth={"70%"}
                body={
                    <>
                        <ModalToAction
                            classPanel={"relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 sm:min-w-full lg:min-w-[35%]"}
                            show={modalFiles.show_files}
                            closeable={true}
                            onClose={() =>
                                setModalFiles({
                                    add_files: false,
                                    show_files: false,
                                    add_files_report: false,
                                    show_files_report: false,
                                    index: ""
                                })
                            }
                            title="Show Files"
                            url={`/cashAdvanceDownload/${dataById.cash_advance_detail[modalFiles.index]?.CASH_ADVANCE_DETAIL_ID}`}
                            data=""
                            method=""
                            onSuccess=""
                            headers={null}
                            submitButtonName=""
                            // panelWidth=""
                            body={
                                <>
                                    <div className="grid grid-cols-12 my-3">
                                            {dataById.cash_advance_detail[modalFiles.index_show]?.m_cash_advance_document.map((file:any, i:number) => (
                                                <>
                                                    <div className={`w-full col-span-11 mb-4`} key={i}>
                                                        <InputLabel
                                                            htmlFor="files"
                                                            value="File"
                                                            className="mb-2"
                                                        />
                                                        <p>
                                                            {dataById.cash_advance_detail[modalFiles.index_show].m_cash_advance_document[i]?.document.DOCUMENT_ORIGINAL_NAME}
                                                        </p>
                                                    </div>
                                                    <button 
                                                        type="button" 
                                                        title="Download File" 
                                                        onClick={() =>
                                                            handleFileDownload(
                                                                dataById.cash_advance_detail[modalFiles.index_show]?.CASH_ADVANCE_DETAIL_ID,
                                                                i
                                                            )
                                                        }
                                                    >
                                                        <ArrowDownTrayIcon className="w-5 mt-7 m-auto cursor-pointer" />
                                                    </button>
                                                </>
                                            ))}
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
                                    value={dataById.person_used_by?.PERSON_FIRST_NAME}
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
                                    value={auth.user.person.PERSON_FIRST_NAME}
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
                                    htmlFor="divisi"
                                    value="Division"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="divisi"
                                    type="text"
                                    name="divisi"
                                    value={auth.user.person.division.RELATION_DIVISION_ALIAS}
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
                                    value={dataById.person_approval?.PERSON_FIRST_NAME}
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
                                </thead>{" "}
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
                                                    {cad.purpose?.CASH_ADVANCE_PURPOSE}
                                                </TD>
                                                <TD className="border px-3">
                                                    {cad.relation_organization?.RELATION_ORGANIZATION_NAME}
                                                </TD>
                                                <TD className="border px-3">
                                                    {
                                                        cad.CASH_ADVANCE_DETAIL_RELATION_NAME
                                                    }
                                                </TD>
                                                <TD className="border px-3">
                                                    {
                                                        cad.CASH_ADVANCE_DETAIL_RELATION_POSITION
                                                    }
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
                                                    {cad?.m_cash_advance_document?.length > 0 ? (
                                                        <button type="button"
                                                            className="bg-black hover:bg-slate-800 text-sm text-white py-2 px-3"
                                                            onClick={() => {
                                                                setModalFiles({
                                                                    add_files: false,
                                                                    show_files: true,
                                                                    add_files_report: false,
                                                                    show_files_report: false,
                                                                    index: "",
                                                                    index_show: i,
                                                                    index_show_report: "",
                                                                });
                                                            }}
                                                        >
                                                            
                                                            {cad?.m_cash_advance_document?.length} Files
                                                        </button>
                                                    ) : 
                                                        '-'
                                                    }
                                                </TD>
                                                <TD className="border">
                                                    <TextInput
                                                        id="CASH_ADVANCE_DETAIL_NOTE"
                                                        type="text"
                                                        name="CASH_ADVANCE_DETAIL_NOTE"
                                                        value={
                                                            cad.CASH_ADVANCE_DETAIL_NOTE
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
                                                </TD>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr className="text-center text-black text-sm leading-7">
                                        <TD
                                            className="border text-right pr-5 py-2"
                                            colSpan={8}
                                        >
                                            TOTAL AMOUNT
                                        </TD>
                                        <TD className="border text-center py-2">
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
                                <legend className="ml-12 px-3 font-medium">Delivery Method</legend>
                                <div className="mt-4 mx-5 space-y-5">
                                    <div className="relative flex items-start">
                                        <div className="flex h-9 items-center">
                                            <input
                                            id="transfer"
                                            name="transfer"
                                            type="checkbox"
                                            aria-describedby="transfer-description"
                                            className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                                            value={1}
                                            defaultChecked={dataById?.CASH_ADVANCE_TRANSFER_AMOUNT > 0 && true}
                                            onChange={(e) => handleCheckedTransferEdit(e)}
                                            required
                                            />
                                        </div>
                                        <div className="flex w-full gap-4">
                                            <div className="ml-3 text-sm leading-9">
                                                <label htmlFor="transfer" className="font-medium text-gray-900">
                                                Transfer
                                                </label>
                                            </div>
                                            <CurrencyInput
                                                id="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                name="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                value={dataById.CASH_ADVANCE_TRANSFER_AMOUNT}
                                                decimalScale={2}
                                                decimalsLimit={2}
                                                className="block w-1/4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                onValueChange ={(val: any) =>
                                                    setDataById({
                                                        ...dataById,
                                                        CASH_ADVANCE_TRANSFER_AMOUNT: val,
                                                    })
                                                }
                                                placeholder="0.00"
                                                disabled={checkedTransferEdit === false || dataById?.CASH_ADVANCE_TRANSFER_AMOUNT === null && true}
                                            />
                                            {/* {checkedTransferEdit === true &&(
                                                <CurrencyInput
                                                    id="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                    name="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                    value={dataById.CASH_ADVANCE_TRANSFER_AMOUNT}
                                                    decimalScale={2}
                                                    decimalsLimit={2}
                                                    className="block w-1/4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                    onValueChange ={(val: any) =>
                                                        setDataById({
                                                            ...dataById,
                                                            CASH_ADVANCE_TRANSFER_AMOUNT: val,
                                                        })
                                                    }
                                                    placeholder="0.00"
                                                />
                                            )} */}
                                            {/* {checkedTransferEdit === false &&(
                                                <CurrencyInput
                                                id="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                name="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                value={dataById.CASH_ADVANCE_TRANSFER_AMOUNT}
                                                decimalScale={2}
                                                decimalsLimit={2}
                                                className="block w-1/4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                disabled
                                                placeholder="0.00"
                                            />
                                            )} */}
                                            <TextInput
                                                id="account_number"
                                                type="text"
                                                name="account_number"
                                                value=""
                                                className="w-full lg:w-1/4"
                                                placeholder="Bank Account Name - Bank Account - Account Number"
                                                // onChange={(e) =>
                                                //     handleChangeAdd(e, i)
                                                // }
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
                                            value={2}
                                            defaultChecked={dataById?.CASH_ADVANCE_CASH_AMOUNT > 0 && true}
                                            onChange={(e) => handleCheckedCashEdit(e)}
                                            // required
                                            />
                                        </div>
                                        <div className="flex w-full">
                                            <div className="ml-3 text-sm leading-9">
                                                <label htmlFor="cash" className="font-medium text-gray-900">
                                                Cash
                                                </label>
                                            </div>
                                            <CurrencyInput
                                                id="CASH_ADVANCE_CASH_AMOUNT"
                                                name="CASH_ADVANCE_CASH_AMOUNT"
                                                value={dataById.CASH_ADVANCE_CASH_AMOUNT}
                                                decimalScale={2}
                                                decimalsLimit={2}
                                                className="block w-1/4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right ml-9"
                                                onValueChange ={(val: any) =>
                                                    setDataById({
                                                        ...dataById,
                                                        CASH_ADVANCE_CASH_AMOUNT: val,
                                                    })
                                                }
                                                placeholder="0.00"
                                                disabled={checkedCashEdit === true || dataById?.CASH_ADVANCE_CASH_AMOUNT === null && true}
                                            />
                                            {/* {checkedCashEdit === true &&(
                                                <CurrencyInput
                                                    id="CASH_ADVANCE_CASH_AMOUNT"
                                                    name="CASH_ADVANCE_CASH_AMOUNT"
                                                    value={dataById.CASH_ADVANCE_CASH_AMOUNT}
                                                    decimalScale={2}
                                                    decimalsLimit={2}
                                                    className="block w-1/4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right ml-9"
                                                    onValueChange ={(val: any) =>
                                                        setDataById({
                                                            ...dataById,
                                                            CASH_ADVANCE_CASH_AMOUNT: val,
                                                        })
                                                    }
                                                    placeholder="0.00"
                                                />
                                            )}
                                            {checkedCashEdit === false &&(
                                                <CurrencyInput
                                                    id="CASH_ADVANCE_CASH_AMOUNT"
                                                    name="CASH_ADVANCE_CASH_AMOUNT"
                                                    value={dataById.CASH_ADVANCE_CASH_AMOUNT}
                                                    decimalScale={2}
                                                    decimalsLimit={2}
                                                    className="block w-1/4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right ml-9"
                                                    disabled={!checkedCashEdit}
                                                    placeholder="0.00"
                                                />
                                            )} */}
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="mt-4 mx-5 space-y-5">
                                    <div className="relative flex items-start">
                                        <div className="flex h-9 items-center">
                                            <input
                                            id="transfer"
                                            name="transfer"
                                            type="checkbox"
                                            aria-describedby="transfer-description"
                                            className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                                            value={1}
                                            checked={dataById?.CASH_ADVANCE_TRANSFER_AMOUNT && true}
                                            onChange={(e) => handleCheckedTransfer(e)}
                                            required
                                            />
                                        </div>
                                        <div className="flex w-full gap-4">
                                            <div className="ml-3 text-sm leading-9">
                                                <label htmlFor="transfer" className="font-medium text-gray-900">
                                                Transfer
                                                </label>
                                            </div>
                                            <TextInput
                                                id="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                type="number"
                                                name="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                value={dataById.CASH_ADVANCE_TRANSFER_AMOUNT}
                                                className="w-full lg:w-1/4 text-right"
                                                placeholder="0.00"
                                                readOnly
                                                required
                                            />
                                            <TextInput
                                                id="account_number"
                                                type="text"
                                                name="account_number"
                                                value=""
                                                className="w-full lg:w-1/4"
                                                placeholder="Bank Account Name - Bank Account - Account Number"
                                                // onChange={(e) =>
                                                //     handleChangeAdd(e, i)
                                                // }
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
                                            value={2}
                                            checked={dataById?.CASH_ADVANCE_CASH_AMOUNT && true}
                                            onChange={(e) => handleCheckedCash(e)}
                                            />
                                        </div>
                                        <div className="flex w-full">
                                            <div className="ml-3 text-sm leading-9">
                                                <label htmlFor="cash" className="font-medium text-gray-900">
                                                Cash
                                                </label>
                                            </div>
                                            <TextInput
                                                id="CASH_ADVANCE_CASH_AMOUNT"
                                                type="number"
                                                name="CASH_ADVANCE_CASH_AMOUNT"
                                                value={dataById.CASH_ADVANCE_CASH_AMOUNT}
                                                className="w-5/12 lg:w-1/4 text-right ml-9"
                                                placeholder="0.00"
                                                readOnly
                                                required
                                            />
                                        </div>
                                    </div>
                                </div> */}
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
                                value={dataById.CASH_ADVANCE_REQUEST_NOTE}
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
                                            value={dataById.person_used_by?.PERSON_FIRST_NAME}
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
                                onClick={() => handleBtnStatus(2)}
                            >
                                Reject
                            </button>
                            <button
                                type="submit"
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-500 sm:ml-3 sm:mt-0 sm:w-auto"
                                onClick={() => handleBtnStatus(1)}
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
                // panelWidth={"70%"}
                body={
                    <>
                        <ModalToAction
                            classPanel={"relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 sm:min-w-full lg:min-w-[35%]"}
                            show={modalFiles.show_files}
                            closeable={true}
                            onClose={() =>
                                setModalFiles({
                                    add_files: false,
                                    show_files: false,
                                    add_files_report: false,
                                    show_files_report: false,
                                    index: ""
                                })
                            }
                            title="Show Files"
                            url={`/cashAdvanceDownload/${dataById.cash_advance_detail[modalFiles.index]?.CASH_ADVANCE_DETAIL_ID}`}
                            data=""
                            method=""
                            onSuccess=""
                            headers={null}
                            submitButtonName=""
                            // panelWidth=""
                            body={
                                <>
                                    <div className="grid grid-cols-12 my-3">
                                        {dataById.cash_advance_detail[modalFiles.index_show]?.m_cash_advance_document.map((file:any, i:number) => (
                                            <>
                                                <div className={`w-full col-span-11 mb-4`} key={i}>
                                                    <InputLabel
                                                        htmlFor="files"
                                                        value="File"
                                                        className="mb-2"
                                                    />
                                                    <p>
                                                        {dataById.cash_advance_detail[modalFiles.index_show].m_cash_advance_document[i]?.document.DOCUMENT_ORIGINAL_NAME}
                                                    </p>
                                                </div>
                                                <button
                                                    className="text-center self-center bg-red-600 hover:bg-red-500 text-white mx-2 mt-4 py-1 rounded-lg"
                                                    onClick={(e) =>
                                                        handleRemoveRowRevisedShowFiles(e, i)
                                                    }
                                                >
                                                    X
                                                </button>
                                            </>
                                        ))}
                                        
                                        {dataById.cash_advance_detail[modalFiles.index_show]?.CASH_ADVANCE_DETAIL_DOCUMENT_ID ? (
                                            <>
                                                {dataById.cash_advance_detail[modalFiles.index_show]?.CASH_ADVANCE_DETAIL_DOCUMENT_ID.map((e: any, i:number) => (
                                                    <>
                                                    {dataById.cash_advance_detail[modalFiles.index_show]?.CASH_ADVANCE_DETAIL_DOCUMENT_ID[i].CASH_ADVANCE_DETAIL_DOCUMENT_ID?.name ? (
                                                        <div className={`w-full col-span-11 mb-4`}>
                                                            <InputLabel
                                                                htmlFor="files"
                                                                value="File"
                                                                className="mb-2"
                                                            />
                                                            <p>
                                                                {dataById.cash_advance_detail[modalFiles.index_show]?.CASH_ADVANCE_DETAIL_DOCUMENT_ID[i].CASH_ADVANCE_DETAIL_DOCUMENT_ID?.name}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className={`w-full col-span-11 mb-4`}>
                                                            <InputLabel
                                                                htmlFor="files"
                                                                value="File"
                                                                className="mb-2"
                                                            />
                                                            <Input
                                                                name="CASH_ADVANCE_DETAIL_DOCUMENT_ID"
                                                                type="file"
                                                                className="w-full"
                                                                onChange={(e) =>
                                                                    handleChangeRevisedFiles(e, i)
                                                                }
                                                            />
                                                        </div>
                                                    )}
                                                        <button
                                                            className="text-center self-center bg-red-600 hover:bg-red-500 text-white mx-2 mt-7 py-1 rounded-lg"
                                                            onClick={(e) =>
                                                                handleRemoveRowRevisedFiles(e, i)
                                                            }
                                                        >
                                                            X
                                                        </button>
                                                    </>
                                                ))}
                                            </>
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        className="text-sm cursor-pointer hover:underline"
                                        onClick={(e) => handleAddRowRevisedFiles(e)}
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
                                    htmlFor="namaPemohon"
                                    value="Used By"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="namaPemohon"
                                    type="text"
                                    name="namaPemohon"
                                    value={dataById.person_used_by?.PERSON_FIRST_NAME}
                                    className="bg-gray-100"
                                    autoComplete="namaPemohon"
                                    onChange={(e) =>
                                        setData("cash_advance_used_by", e.target.value)
                                    }
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
                                    value={auth.user.person.PERSON_FIRST_NAME}
                                    className="bg-gray-100"
                                    autoComplete="namaPengguna"
                                    onChange={(e) =>
                                        setData("cash_advance_requested_by", e.target.value)
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
                                    htmlFor="divisi"
                                    value="Division"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="cash_advance_division"
                                    type="text"
                                    name="cash_advance_division"
                                    value={auth.user.person.division.RELATION_DIVISION_ALIAS}
                                    className="bg-gray-100"
                                    autoComplete="cash_advance_division"
                                    onChange={(e) =>
                                        setData("cash_advance_division", e.target.value)
                                    }
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
                                    value={dataById.person_approval?.PERSON_FIRST_NAME}
                                    className="bg-gray-100"
                                    autoComplete="namaPemberiApproval"
                                    onChange={(e) =>
                                        setData(
                                            "cash_advance_first_approval_by",
                                            e.target.value
                                        )
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
                                                        selected={cad.CASH_ADVANCE_DETAIL_START_DATE}
                                                        onChange={(date: any) =>
                                                            handleChangeRevisedDate(date, "CASH_ADVANCE_DETAIL_START_DATE", i)
                                                        }
                                                        dateFormat={"dd-MM-yyyy"}
                                                        placeholderText="dd-mm-yyyyy"
                                                        className="border-0 rounded-md shadow-md text-sm h-9 w-[100%] focus:ring-2 focus:ring-inset focus:ring-red-600"
                                                        autoComplete="off"
                                                        required
                                                    />
                                                </TD>
                                                <TD className="border">
                                                <DatePicker
                                                        name="CASH_ADVANCE_DETAIL_END_DATE"
                                                        selected={cad.CASH_ADVANCE_DETAIL_END_DATE}
                                                        onChange={(date: any) =>
                                                            handleChangeRevisedDate(date, "CASH_ADVANCE_DETAIL_END_DATE", i)
                                                        }
                                                        dateFormat={"dd-MM-yyyy"}
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
                                                        value={cad.CASH_ADVANCE_DETAIL_PURPOSE}
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
                                                        {cash_advance_purpose.map((purpose:any) => (
                                                            <option
                                                                key={purpose.CASH_ADVANCE_PURPOSE_ID}
                                                                value={purpose.CASH_ADVANCE_PURPOSE_ID}
                                                            >
                                                                {purpose.CASH_ADVANCE_PURPOSE}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </TD>
                                                <TD className="border">
                                                    <select
                                                        id="CASH_ADVANCE_DETAIL_RELATION_ORGANIZATION_ID"
                                                        name="CASH_ADVANCE_DETAIL_RELATION_ORGANIZATION_ID"
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                        value={
                                                            cad.CASH_ADVANCE_DETAIL_RELATION_ORGANIZATION_ID
                                                        }
                                                        onChange={(e) =>
                                                            handleChangeRevised(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                        required
                                                    >
                                                        <option value="">
                                                            -- Choose Business
                                                            Relation --
                                                        </option>
                                                        {relations.map(
                                                            (relation: any) => (
                                                                <option
                                                                    key={relation.RELATION_ORGANIZATION_ID}
                                                                    value={
                                                                        relation.RELATION_ORGANIZATION_ID
                                                                    }
                                                                >
                                                                    {
                                                                        relation.RELATION_ORGANIZATION_NAME
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </TD>
                                                <TD className="border">
                                                    <TextInput
                                                        id="CASH_ADVANCE_DETAIL_RELATION_NAME"
                                                        type="text"
                                                        name="CASH_ADVANCE_DETAIL_RELATION_NAME"
                                                        value={
                                                            cad.CASH_ADVANCE_DETAIL_RELATION_NAME
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
                                                        id="CASH_ADVANCE_DETAIL_RELATION_POSITION"
                                                        type="text"
                                                        name="CASH_ADVANCE_DETAIL_RELATION_POSITION"
                                                        value={
                                                            cad.CASH_ADVANCE_DETAIL_RELATION_POSITION
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
                                                        onValueChange={(val: any) =>
                                                            handleChangeRevisedCustom(val, "CASH_ADVANCE_DETAIL_AMOUNT", i)
                                                        }
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                        required
                                                        placeholder="0.00"
                                                        autoComplete="off"
                                                    />
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {cad?.m_cash_advance_document?.length > 0 ? (
                                                        <button type="button"
                                                            className="bg-black hover:bg-slate-800 text-sm text-white py-2 px-3"
                                                            onClick={() => {
                                                                setModalFiles({
                                                                    add_files: false,
                                                                    show_files: true,
                                                                    add_files_report: false,
                                                                    show_files_report: false,
                                                                    index: "",
                                                                    index_show: i,
                                                                    index_show_report: "",
                                                                });
                                                            }}
                                                        >
                                                            
                                                            {cad?.m_cash_advance_document?.length} Files
                                                        </button>
                                                    ) : 
                                                        '-'
                                                    }
                                                </TD>
                                                <TD className="border text-left px-3">
                                                    {cad.CASH_ADVANCE_DETAIL_NOTE}
                                                </TD>
                                                {dataById.cash_advance_detail
                                                    .length > 1 && (
                                                    <TD className="border">
                                                        <Button
                                                            className="my-1.5 px-3 py-1"
                                                            onClick={() =>
                                                                handleRemoveRowRevised(
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
                                    <tr className="text-center text-black text-sm leading-7">
                                        <TD>
                                            
                                        </TD>
                                        <TD>
                                            <Button
                                                className="mt-5 px-2 py-1 text-black bg-none shadow-none hover:underline"
                                                onClick={(e) => handleAddRowRevised(e)}
                                                type="button"
                                            >
                                                + Add Row
                                            </Button>
                                        </TD>
                                        <TD
                                            className="text-right pr-5 py-2"
                                            colSpan={6}
                                        >
                                            TOTAL AMOUNT
                                        </TD>
                                        <TD className="py-2">
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
                                <legend className="ml-12 px-3 font-medium">Delivery Method</legend>
                                <div className="mt-4 mx-5 space-y-5">
                                    <div className="relative flex items-start">
                                        <div className="flex h-9 items-center">
                                            <input
                                            id="transfer"
                                            name="transfer"
                                            type="checkbox"
                                            aria-describedby="transfer-description"
                                            className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                                            value={1}
                                            defaultChecked={dataById?.CASH_ADVANCE_TRANSFER_AMOUNT > 0 && true}
                                            onChange={(e) => handleCheckedTransferEdit(e)}
                                            required
                                            />
                                        </div>
                                        <div className="flex w-full gap-4">
                                            <div className="ml-3 text-sm leading-9">
                                                <label htmlFor="transfer" className="font-medium text-gray-900">
                                                Transfer
                                                </label>
                                            </div>
                                            {checkedTransferEdit === true ? (
                                                <CurrencyInput
                                                    id="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                    name="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                    value={dataById.CASH_ADVANCE_TRANSFER_AMOUNT}
                                                    decimalScale={2}
                                                    decimalsLimit={2}
                                                    className="block w-1/4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                    onValueChange ={(val: any) =>
                                                        setDataById({
                                                            ...dataById,
                                                            CASH_ADVANCE_TRANSFER_AMOUNT: val,
                                                        })
                                                    }
                                                    placeholder="0.00"
                                                />
                                            ) : (
                                                <CurrencyInput
                                                    id="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                    name="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                    value={dataById.CASH_ADVANCE_TRANSFER_AMOUNT}
                                                    decimalScale={2}
                                                    decimalsLimit={2}
                                                    className="block w-1/4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                    disabled
                                                    placeholder="0.00"
                                                />
                                            )}
                                            <TextInput
                                                id="account_number"
                                                type="text"
                                                name="account_number"
                                                value=""
                                                className="w-full lg:w-1/4"
                                                placeholder="Bank Account Name - Bank Account - Account Number"
                                                // onChange={(e) =>
                                                //     handleChangeAdd(e, i)
                                                // }
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
                                            value={2}
                                            defaultChecked={dataById?.CASH_ADVANCE_CASH_AMOUNT !== null && true}
                                            onChange={(e) => handleCheckedCashEdit(e)}
                                            // required
                                            />
                                        </div>
                                        <div className="flex w-full">
                                            <div className="ml-3 text-sm leading-9">
                                                <label htmlFor="cash" className="font-medium text-gray-900">
                                                Cash
                                                </label>
                                            </div>
                                            {checkedCashEdit === true ? (
                                                <CurrencyInput
                                                    id="CASH_ADVANCE_CASH_AMOUNT"
                                                    name="CASH_ADVANCE_CASH_AMOUNT"
                                                    value={dataById.CASH_ADVANCE_CASH_AMOUNT}
                                                    decimalScale={2}
                                                    decimalsLimit={2}
                                                    className="block w-1/4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right ml-9"
                                                    onValueChange ={(val: any) =>
                                                        setDataById({
                                                            ...dataById,
                                                            CASH_ADVANCE_CASH_AMOUNT: val,
                                                        })
                                                    }
                                                    placeholder="0.00"
                                                />
                                            ) : (
                                                <CurrencyInput
                                                    id="CASH_ADVANCE_CASH_AMOUNT"
                                                    name="CASH_ADVANCE_CASH_AMOUNT"
                                                    value={dataById.CASH_ADVANCE_CASH_AMOUNT}
                                                    decimalScale={2}
                                                    decimalsLimit={2}
                                                    className="block w-1/4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right ml-9"
                                                    disabled
                                                    placeholder="0.00"
                                                />
                                            )}
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
                                value={dataById.CASH_ADVANCE_REQUEST_NOTE}
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
                                            value="21/9/2023 09.00WIB"
                                            className="border-none"
                                        />
                                        <TableTD
                                            value="Pemohon"
                                            className="border-none"
                                        />
                                        <TableTD
                                            value="Created"
                                            className="border-none"
                                        />
                                    </tr>
                                    <tr>
                                        <TableTD
                                            value="21/9/2023 10.00WIB"
                                            className="w-48 border-none"
                                        />
                                        <TableTD
                                            value="Pemberi Approval"
                                            className="border-none"
                                        />
                                        <TableTD
                                            value="Revised"
                                            className="border-none"
                                        />
                                    </tr>
                                </tbody>
                            </table>
                        </div> */}
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
                // panelWidth={"70%"}
                body={
                    <>
                        <ModalToAction
                            classPanel={"relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 sm:min-w-full lg:min-w-[35%]"}
                            show={modalFiles.show_files}
                            closeable={true}
                            onClose={() =>
                                setModalFiles({
                                    add_files: false,
                                    show_files: false,
                                    add_files_report: false,
                                    show_files_report: false,
                                    index: ""
                                })
                            }
                            title="Show Files"
                            url={`/cashAdvanceDownload/${dataById.cash_advance_detail[modalFiles.index]?.CASH_ADVANCE_DETAIL_ID}`}
                            data=""
                            method=""
                            onSuccess=""
                            headers={null}
                            submitButtonName=""
                            // panelWidth=""
                            body={
                                <>
                                    <div className="grid grid-cols-12 my-3">
                                            {dataById.cash_advance_detail[modalFiles.index_show]?.m_cash_advance_document.map((file:any, i:number) => (
                                                <>
                                                    <div className={`w-full col-span-11 mb-4`} key={i}>
                                                        <InputLabel
                                                            htmlFor="files"
                                                            value="File"
                                                            className="mb-2"
                                                        />
                                                        <p>
                                                            {dataById.cash_advance_detail[modalFiles.index_show].m_cash_advance_document[i]?.document.DOCUMENT_ORIGINAL_NAME}
                                                        </p>
                                                    </div>
                                                    <button 
                                                        type="button" 
                                                        title="Download File" 
                                                        onClick={() =>
                                                            handleFileDownload(
                                                                dataById.cash_advance_detail[modalFiles.index_show]?.CASH_ADVANCE_DETAIL_ID,
                                                                i
                                                            )
                                                        }
                                                    >
                                                        <ArrowDownTrayIcon className="w-5 mt-7 m-auto cursor-pointer" />
                                                    </button>
                                                </>
                                            ))}
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
                                    value={dataById.person_used_by?.PERSON_FIRST_NAME}
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
                                    value={auth.user.person.PERSON_FIRST_NAME}
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
                                    type="TEXT"
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
                                    value={auth.user.person.division.RELATION_DIVISION_ALIAS}
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
                                    value={dataById.person_approval?.PERSON_FIRST_NAME}
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
                                </thead>{" "}
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
                                                    {cad.purpose?.CASH_ADVANCE_PURPOSE}
                                                </TD>
                                                <TD className="border px-3">
                                                    {cad.relation_organization?.RELATION_ORGANIZATION_NAME}
                                                </TD>
                                                <TD className="border px-3">
                                                    {
                                                        cad.CASH_ADVANCE_DETAIL_RELATION_NAME
                                                    }
                                                </TD>
                                                <TD className="border px-3">
                                                    {
                                                        cad.CASH_ADVANCE_DETAIL_RELATION_POSITION
                                                    }
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
                                                    {cad?.m_cash_advance_document?.length > 0 ? (
                                                        <button type="button"
                                                            className="bg-black hover:bg-slate-800 text-sm text-white py-2 px-3"
                                                            onClick={() => {
                                                                setModalFiles({
                                                                    add_files: false,
                                                                    show_files: true,
                                                                    add_files_report: false,
                                                                    show_files_report: false,
                                                                    index: "",
                                                                    index_show: i,
                                                                    index_show_report: "",
                                                                });
                                                            }}
                                                        >
                                                            
                                                            {cad?.m_cash_advance_document?.length} Files
                                                        </button>
                                                    ) : 
                                                        '-'
                                                    }
                                                </TD>
                                                <TD className="border">
                                                    {cad.CASH_ADVANCE_DETAIL_NOTE}
                                                </TD>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr className="text-center text-black text-sm leading-7">
                                        <TD
                                            className="border text-right pr-5 py-2"
                                            colSpan={8}
                                        >
                                            TOTAL AMOUNT
                                        </TD>
                                        <TD className="border text-center py-2">
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
                                <legend className="ml-12 px-3 font-medium">Delivery Method</legend>
                                <div className="mt-4 mx-5 space-y-5">
                                    <div className="relative flex items-start">
                                        <div className="flex h-9 items-center">
                                            <input
                                                id="transfer"
                                                name="transfer"
                                                type="checkbox"
                                                aria-describedby="transfer-description"
                                                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                                                value={1}
                                                onChange={(e) => handleCheckedTransferEdit(e)}
                                                defaultChecked={dataById.CASH_ADVANCE_TRANSFER_AMOUNT > 0 && true}
                                            />
                                        </div>
                                        <div className="flex w-full gap-4">
                                            <div className="ml-3 text-sm leading-9">
                                                <label htmlFor="transfer" className="font-medium text-gray-900">
                                                    Transfer
                                                </label>
                                            </div>
                                            <CurrencyInput
                                                id="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                name="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                value={dataById.CASH_ADVANCE_TRANSFER_AMOUNT}
                                                decimalScale={2}
                                                decimalsLimit={2}
                                                className="block w-1/4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                onValueChange ={(val: any) =>
                                                    setDataById({
                                                        ...dataById,
                                                        CASH_ADVANCE_TRANSFER_AMOUNT: val,
                                                    })
                                                }
                                                placeholder="0.00"
                                            />
                                            <TextInput
                                                id="account_number"
                                                type="text"
                                                name="account_number"
                                                value={""}
                                                className="w-full lg:w-1/4"
                                                placeholder="To Bank Account"
                                                // onChange={(e) =>
                                                //     handleChangeAdd(e, i)
                                                // }
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    {checkedTransferEdit === true &&(
                                    <div className="ml-7">
                                        <div className="mb-5">
                                            <InputLabel
                                                htmlFor="cash_advance_transfer_date"
                                                className="mb-2"
                                            >
                                                Transfer Date
                                                {/* <span className="text-red-600">*</span> */}
                                            </InputLabel>
                                            <DatePicker
                                                name="CASH_ADVANCE_TRANSFER_DATE"
                                                selected={dataById.CASH_ADVANCE_TRANSFER_DATE}
                                                onChange={(date: any) =>
                                                    setDataById({...dataById, CASH_ADVANCE_TRANSFER_DATE: date.toLocaleDateString("en-CA")})
                                                }
                                                dateFormat={"dd-MM-yyyy"}
                                                placeholderText="dd-mm-yyyyy"
                                                className="border-0 rounded-md shadow-md text-sm h-9 w-[100%] focus:ring-2 focus:ring-inset focus:ring-red-600"
                                            autoComplete="off"/>

                                        </div>
                                        <div className="mb-5">
                                            <InputLabel
                                                htmlFor="CASH_ADVANCE_FROM_BANK_ACCOUNT"
                                                className="mb-2"
                                            >
                                                From Bank Account
                                                {/* <span className="text-red-600">*</span> */}
                                            </InputLabel>
                                            <select name="CASH_ADVANCE_FROM_BANK_ACCOUNT" id="CASH_ADVANCE_FROM_BANK_ACCOUNT" className="block w-full lg:w-7/12 rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                            onChange={(e) =>
                                                setDataById({
                                                    ...dataById,
                                                    CASH_ADVANCE_FROM_BANK_ACCOUNT: e.target.value,
                                                })
                                            }
                                            >
                                                <option value="">-- Choose Bank Account --</option>
                                                <option value="Bank 1">Bank 1</option>
                                                <option value="Bank 2">Bank 2</option>
                                            </select>
                                        </div>
                                    </div>
                                    )}
                                    <div className="relative flex items-start">
                                        <div className="flex h-9 items-center">
                                            <input
                                            id="cash"
                                            name="cash"
                                            type="checkbox"
                                            aria-describedby="cash-description"
                                            className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                                            value={2}
                                            onChange={(e) => handleCheckedCashEdit(e)}
                                            defaultChecked={dataById.CASH_ADVANCE_CASH_AMOUNT > 0  && true}
                                            />
                                        </div>
                                        <div className="flex w-full">
                                            <div className="ml-3 text-sm leading-9">
                                                <label htmlFor="cash" className="font-medium text-gray-900">
                                                Cash
                                                </label>
                                            </div>
                                            <CurrencyInput
                                                id="CASH_ADVANCE_CASH_AMOUNT"
                                                name="CASH_ADVANCE_CASH_AMOUNT"
                                                value={dataById.CASH_ADVANCE_CASH_AMOUNT}
                                                decimalScale={2}
                                                decimalsLimit={2}
                                                className="block w-1/4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right ml-9"
                                                onValueChange ={(val: any) =>
                                                    setDataById({
                                                        ...dataById,
                                                        CASH_ADVANCE_CASH_AMOUNT: val,
                                                    })
                                                }
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    {checkedCashEdit === true &&(
                                    <div className="ml-7">
                                        <div className="mb-5">
                                            <InputLabel
                                                htmlFor="CASH_ADVANCE_RECEIVE_DATE"
                                                className="mb-2"
                                            >
                                                Receive Date
                                                {/* <span className="text-red-600">*</span> */}
                                            </InputLabel>
                                            <DatePicker
                                                name="CASH_ADVANCE_RECEIVE_DATE"
                                                selected={dataById.CASH_ADVANCE_RECEIVE_DATE}
                                                onChange={(date: any) =>
                                                    setDataById({...dataById, CASH_ADVANCE_RECEIVE_DATE: date.toLocaleDateString("en-CA")})
                                                }
                                                dateFormat={"dd-MM-yyyy"}
                                                placeholderText="dd-mm-yyyyy"
                                                className="border-0 rounded-md shadow-md text-sm h-9 w-[100%] focus:ring-2 focus:ring-inset focus:ring-red-600"
                                            autoComplete="off"/>

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
                                                value={dataById.CASH_ADVANCE_RECEIVE_NAME}
                                                className="w-full lg:w-7/12"
                                                onChange={(e) =>
                                                    setDataById({
                                                        ...dataById,
                                                        CASH_ADVANCE_RECEIVE_NAME: e.target.value,
                                                    })
                                                }
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>
                                    )}
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
                                value={dataById.CASH_ADVANCE_REQUEST_NOTE}
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
                                            value={dataById.person_used_by?.PERSON_FIRST_NAME}
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
                    </>
                }
            />
            {/* Modal Execute End */}

            {/* Modal Report Start */}
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
                        <div className="grid md:grid-cols-2 my-10">
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="cashAdvanceNumber"
                                    className="mb-2"
                                >
                                    CA Number{" "}
                                    <span className="text-red-600">*</span>
                                </InputLabel>
                                <TextInput
                                    id="cashAdvanceNumber"
                                    type="text"
                                    name="cashAdvanceNumber"
                                    value={dataById.CASH_ADVANCE_NUMBER}
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="namaPemohon"
                                    className="mb-2"
                                >
                                    Used By
                                    <span className="text-red-600">*</span>
                                </InputLabel>
                                <TextInput
                                    id="cashAdvanceNumber"
                                    type="text"
                                    name="cashAdvanceNumber"
                                    value={dataById.person_used_by?.PERSON_FIRST_NAME}
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
                                    value={auth.user.person.PERSON_FIRST_NAME}
                                    className="bg-gray-100"
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
                                        dataById?.CASH_ADVANCE_REQUESTED_DATE,
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
                                    value={auth.user.person.division.RELATION_DIVISION_ALIAS}
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="namaPemberiApproval"
                                    className="mb-2"
                                >
                                    Request for Approval{" "}
                                    <span className="text-red-600">*</span>
                                </InputLabel>
                                <TextInput
                                    id="cashAdvanceNumber"
                                    type="text"
                                    name="cashAdvanceNumber"
                                    value={dataById.person_approval?.PERSON_FIRST_NAME}
                                    className="bg-gray-100"
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
                                        <TH
                                            label="Name"
                                            className="border"
                                        />
                                        <TH
                                            label="Person"
                                            className="border"
                                        />
                                        <TH
                                            label="Position"
                                            className="border"
                                        />
                                    </tr>
                                </thead>
                                <tbody id="form_table">
                                    {DataReportRow.map((val, i) => (
                                        <tr className="text-center" key={i}>
                                            <TD className="border">{i + 1}.</TD>
                                            <TD className="border">
                                                <DatePicker
                                                    name="cash_advance_detail_start_date"
                                                    selected={val.cash_advance_detail_start_date}
                                                    onChange={(date: any) =>
                                                        handleChangeAddReportDate(date, "cash_advance_detail_start_date", i)
                                                    }
                                                    dateFormat={"dd-MM-yyyy"}
                                                    placeholderText="dd-mm-yyyyy"
                                                    className="border-0 rounded-md shadow-md text-sm h-9 w-[100%] focus:ring-2 focus:ring-inset focus:ring-red-600"
                                                    autoComplete="off"
                                                    required
                                                />
                                            </TD>
                                            <TD className="border">
                                                <DatePicker
                                                    name="cash_advance_detail_end_date"
                                                    selected={val.cash_advance_detail_end_date}
                                                    onChange={(date: any) =>
                                                        handleChangeAddReportDate(date, "cash_advance_detail_end_date", i)
                                                    }
                                                    dateFormat={"dd-MM-yyyy"}
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
                                                    value={val.cash_advance_detail_purpose}
                                                    className="w-1/2"
                                                    autoComplete="off"
                                                    onChange={(e) =>
                                                        handleChangeAddReport(e, i)
                                                    }
                                                />
                                            </TD>
                                            <TD className="border">
                                            <Select
                                                    classNames={{
                                                        menuButton: () =>
                                                            `flex text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400 ring-1 ring-gray-300`,
                                                        menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                        listItem: ({ isSelected }: any) =>
                                                            `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                                isSelected
                                                                    ? `text-white bg-red-600`
                                                                    : `text-gray-500 hover:bg-red-100 hover:text-black`
                                                            }`,
                                                    }}
                                                    options={selectRelation}
                                                    isSearchable={true}
                                                    placeholder={"Choose Business Relation"}
                                                    value={val.cash_advance_detail_relation_organization_id}
                                                    onChange={(val: any) =>
                                                        handleChangeAddReportCustom(val, "cash_advance_detail_relation_organization_id", i)
                                                    }
                                                    primaryColor={"bg-red-500"}
                                                />
                                            </TD>
                                            <TD className="border">
                                                <TextInput
                                                    id="cash_advance_detail_relation_name"
                                                    type="text"
                                                    name="cash_advance_detail_relation_name"
                                                    value={val.cash_advance_detail_relation_name}
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
                                                    value={val.cash_advance_detail_relation_position}
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
                                                    value={val.cash_advance_detail_location}
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
                                                    onValueChange={(val: any) =>
                                                        handleChangeAddReportCustom(val, "cash_advance_detail_amount", i)
                                                    }
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                    required
                                                    placeholder="0.00"
                                                    autoComplete="off"
                                                />
                                            </TD>
                                            <TD className="border">
                                                <div className="">
                                                    <button type="button"
                                                        className="bg-black hover:bg-slate-800 text-sm text-white py-2 px-3"
                                                        onClick={() => {
                                                            setModalFiles({
                                                                add_files: false,
                                                                show_files: false,
                                                                add_files_report: true,
                                                                show_files_report: false,
                                                                index: i
                                                            });
                                                        }}
                                                    >
                                                        {
                                                            dataCAReport.CashAdvanceDetail[i]?.cash_advance_detail_document_id.length > 0
                                                            ?
                                                                (dataCAReport.CashAdvanceDetail[i]?.cash_advance_detail_document_id?.length + ' Files')
                                                            :
                                                                'Add Files'
                                                        }
                                                    </button>
                                                </div>
                                            </TD>
                                            <TD className="border">
                                                {DataReportRow.length > 1 && (
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
                                    ))}
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
                                        <TD>
                                            {formatCurrency.format(total_amount_report)}
                                        </TD>
                                    </tr>
                                    <tr className="text-right text-sm leading-9">
                                        <TD
                                            className="pr-5 font-bold"
                                            colSpan={8}
                                        >
                                            TOTAL AMOUNT REQUEST
                                        </TD>
                                        <TD>
                                            {formatCurrency.format(dataById.CASH_ADVANCE_TOTAL_AMOUNT)}
                                        </TD>
                                    </tr>
                                    <tr className="text-right text-sm leading-9">
                                        <TD
                                            className="pr-5 font-bold"
                                            colSpan={8}
                                        >
                                            TOTAL AMOUNT DIFFERENT
                                        </TD>
                                        <TD>
                                            {formatCurrency.format(dataById.CASH_ADVANCE_TOTAL_AMOUNT - total_amount_report)}
                                        </TD>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        {/* Table form end */}
                        
                        {/* {(dataById.CASH_ADVANCE_TOTAL_AMOUNT - total_amount_report) !== 0 &&(
                            <div className="grid md:grid-cols-2 my-10">
                                <div className="w-full p-2">
                                    <InputLabel
                                        htmlFor="type"
                                        className="mb-2"
                                    >
                                        Type
                                    </InputLabel>
                                    <select
                                        id="type"
                                        name="type"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                        onChange={(e) =>
                                            setDataCAReport({...dataCAReport, type: e.target.value})
                                        }
                                        required
                                    >
                                        <option value="">
                                            -- Choose Type --
                                        </option>
                                        {types.map((type: any) => (
                                            <option
                                                key={type.id}
                                                value={type.id}
                                            >
                                                {type.name}
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
                                            dataCAReport.amount
                                        }
                                        decimalScale={2}
                                        decimalsLimit={2}
                                        onValueChange={(val: any) =>
                                            setDataCAReport({...dataCAReport, amount: val})
                                        }
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                        required
                                        placeholder="0.00"
                                        autoComplete="off"
                                    />
                                </div>
                            </div>
                        )} */}

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
                                    setDataCAReport({...dataCAReport, cash_advance_request_note: e.target.value})
                                }
                            />
                        </div>

                        <ModalToAction
                            classPanel={"relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 sm:min-w-full lg:min-w-[35%]"}
                            show={modalFiles.add_files_report}
                            closeable={true}
                            onClose={() =>
                                setModalFiles({
                                    add_files: false,
                                    show_files: false,
                                    add_files_report: false,
                                    show_files_report: false,
                                    index: ""
                                })
                            }
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
                                    {dataCAReport.CashAdvanceDetail[modalFiles.index]?.cash_advance_detail_document_id.map((val: any, i:number) => (
                                        <div className="grid grid-cols-12 my-5" key={i}>
                                                <div className={`w-full col-span-11`}>
                                                    <InputLabel
                                                        htmlFor="files"
                                                        value="File"
                                                        className="mb-2"
                                                    />
                                                    {dataCAReport.CashAdvanceDetail[modalFiles.index].cash_advance_detail_document_id[i]?.name ? (
                                                        <p>
                                                            {dataCAReport.CashAdvanceDetail[modalFiles.index].cash_advance_detail_document_id[i]?.name}
                                                        </p>
                                                    ) : (
                                                        <Input
                                                            name="cash_advance_detail_document_id"
                                                            type="file"
                                                            className="w-full"
                                                            onChange={(e) =>
                                                                handleChangeAddFilesReport(e, i)
                                                            }
                                                        />
                                                    )}
                                                </div>
                                                <button
                                                    className="text-center self-center bg-red-600 hover:bg-red-500 text-white mx-2 mt-8 py-1 rounded-lg"
                                                    onClick={(e) =>
                                                        handleRemoveFilesReportRow(e, i)
                                                    }
                                                >
                                                    X
                                                </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="text-sm cursor-pointer hover:underline"
                                        onClick={(e) => handleAddRowFilesReport(e)}
                                    >
                                        + Add Row
                                    </button>
                                </>
                            }
                        />
                    </>
                }
            />
            {/* Modal Report End */}

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
                        <ModalToAction
                            classPanel={"relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 sm:min-w-full lg:min-w-[35%]"}
                            show={modalFiles.show_files_report}
                            closeable={true}
                            onClose={() =>
                                setModalFiles({
                                    add_files: false,
                                    show_files: false,
                                    add_files_report: false,
                                    show_files_report: false,
                                    index: "",
                                    index_show: "",
                                    index_show_report: "",
                                })
                            }
                            title="Show Files"
                            url={`/cashAdvanceReportDownload/${dataReportById?.cash_advance_detail_report[modalFiles.index_show_report]?.REPORT_CASH_ADVANCE_DETAIL_ID}`}
                            data=""
                            method=""
                            onSuccess=""
                            headers={null}
                            submitButtonName=""
                            // panelWidth=""
                            body={
                                <>
                                    <div className="grid grid-cols-12 my-3">
                                            {dataReportById?.cash_advance_detail_report[modalFiles.index_show_report]?.m_cash_advance_report_document.map((file:any, i:number) => (
                                                <>
                                                    <div className={`w-full col-span-11 mb-4`} key={i}>
                                                        <InputLabel
                                                            htmlFor="files"
                                                            value="File"
                                                            className="mb-2"
                                                        />
                                                        <p>
                                                            {dataReportById?.cash_advance_detail_report[modalFiles.index_show_report].m_cash_advance_report_document[i]?.document.DOCUMENT_ORIGINAL_NAME}
                                                        </p>
                                                    </div>
                                                    <button 
                                                        type="button" 
                                                        title="Download File" 
                                                        onClick={() =>
                                                            handleFileReportDownload(
                                                                dataReportById?.cash_advance_detail_report[modalFiles.index_show_report]?.REPORT_CASH_ADVANCE_DETAIL_ID,
                                                                i
                                                            )
                                                        }
                                                    >
                                                        <ArrowDownTrayIcon className="w-5 mt-7 m-auto cursor-pointer" />
                                                    </button>
                                                </>
                                            ))}
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
                                    value={dataReportById?.REPORT_CASH_ADVANCE_NUMBER}
                                    className="bg-gray-100"
                                    autoComplete="cashAdvanceReportNumber"
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
                                    value={dataReportById?.cash_advance.CASH_ADVANCE_NUMBER}
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
                                    value={auth.user.person.PERSON_FIRST_NAME}
                                    className="bg-gray-100"
                                    autoComplete="namaPengguna"
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
                                    value={dataReportById?.person_used_by?.PERSON_FIRST_NAME}
                                    className="bg-gray-100"
                                    autoComplete="namaPemohon"
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
                                    value={auth.user.person.division.RELATION_DIVISION_ALIAS}
                                    className="bg-gray-100"
                                    autoComplete="divisi"
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
                                    htmlFor="namaPemberiApproval"
                                    value="Request for Approval"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="namaPemberiApproval"
                                    type="text"
                                    name="namaPemberiApproval"
                                    value={dataReportById?.person_approval?.PERSON_FIRST_NAME}
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
                                                    {cad.REPORT_CASH_ADVANCE_DETAIL_PURPOSE}
                                                </TD>
                                                <TD className="border px-3">
                                                    {cad.relation_organization?.RELATION_ORGANIZATION_NAME}
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {
                                                        cad.REPORT_CASH_ADVANCE_DETAIL_RELATION_NAME
                                                    }
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {
                                                        cad.REPORT_CASH_ADVANCE_DETAIL_RELATION_POSITION
                                                    }
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
                                                    {cad?.m_cash_advance_report_document?.length > 0 ? (
                                                        <button type="button"
                                                            className="bg-black hover:bg-slate-800 text-sm text-white py-2 px-3"
                                                            onClick={() => {
                                                                setModalFiles({
                                                                    add_files: false,
                                                                    show_files: false,
                                                                    add_files_report: false,
                                                                    show_files_report: true,
                                                                    index: "",
                                                                    index_show: "",
                                                                    index_show_report: i,
                                                                });
                                                            }}
                                                        >
                                                            
                                                            {cad?.m_cash_advance_report_document?.length} Files
                                                        </button>
                                                    ) : 
                                                        '-'
                                                    }
                                                </TD>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr className="text-center text-black text-sm leading-7">
                                        <TD
                                            className="border text-right pr-5 py-2"
                                            colSpan={8}
                                        >
                                            TOTAL AMOUNT
                                        </TD>
                                        <TD className="border py-2">
                                            {formatCurrency.format(
                                                dataReportById?.REPORT_CASH_ADVANCE_TOTAL_AMOUNT
                                            )}
                                        </TD>
                                    </tr>
                                    <tr className="text-center text-black text-sm leading-7">
                                        <TD
                                            className="border text-right pr-5 py-2"
                                            colSpan={8}
                                        >
                                            TOTAL AMOUNT REQUEST
                                        </TD>
                                        <TD className="border py-2">
                                            {formatCurrency.format(
                                                dataReportById?.REPORT_CASH_ADVANCE_TOTAL_AMOUNT_REQUEST
                                            )}
                                        </TD>
                                    </tr>
                                    <tr className="text-center text-black text-sm leading-7">
                                        <TD
                                            className="border text-right pr-5 py-2"
                                            colSpan={8}
                                        >
                                            TOTAL AMOUNT DIFFERENT
                                        </TD>
                                        <TD className="border py-2">
                                            {formatCurrency.format(
                                                dataReportById?.REPORT_CASH_ADVANCE_TOTAL_AMOUNT_REQUEST - dataReportById?.REPORT_CASH_ADVANCE_TOTAL_AMOUNT
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
                                    htmlFor="type"
                                    className="mb-2"
                                >
                                    Type
                                    {/* <span className="text-red-600">*</span> */}
                                </InputLabel>
                                <TextInput
                                    value={dataReportById?.REPORT_CASH_ADVANCE_TYPE === 1 ? "Settlement" : "Refund"}
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="amount"
                                    className="mb-2"
                                >
                                    Amount
                                    {/* <span className="text-red-600">*</span> */}
                                </InputLabel>
                                <CurrencyInput
                                    id="amount"
                                    name="amount"
                                    value={
                                        dataReportById?.REPORT_CASH_ADVANCE_AMOUNT
                                    }
                                    decimalScale={2}
                                    decimalsLimit={2}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right bg-gray-100"
                                    disabled
                                    placeholder="0.00"
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        {/* <div className="mt-10">
                            <fieldset className="bg-white pb-10 pt-5 rounded-lg border-2">
                                <legend className="ml-12 px-3 font-medium">Delivery Method</legend>
                                <div className="mt-4 mx-5 space-y-5">
                                    <div className="relative flex items-start">
                                        <div className="flex h-9 items-center">
                                            <input
                                            id="transfer"
                                            name="transfer"
                                            type="checkbox"
                                            aria-describedby="transfer-description"
                                            className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                                            value={1}
                                            checked={dataReportById?.REPORT_CASH_ADVANCE_TRANSFER_AMOUNT > 0 && true}
                                            onChange={(e) => handleCheckedTransfer(e)}
                                            required
                                            />
                                        </div>
                                        <div className="flex w-full gap-4">
                                            <div className="ml-3 text-sm leading-9">
                                                <label htmlFor="transfer" className="font-medium text-gray-900">
                                                Transfer
                                                </label>
                                            </div>
                                            <TextInput
                                                id="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                type="number"
                                                name="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                value={dataReportById?.REPORT_CASH_ADVANCE_TRANSFER_AMOUNT}
                                                className="w-full lg:w-1/4 text-right"
                                                placeholder="0.00"
                                                readOnly
                                                required
                                            />
                                            <TextInput
                                                id="account_number"
                                                type="text"
                                                name="account_number"
                                                value=""
                                                className="w-full lg:w-1/4"
                                                placeholder="Bank Account Name - Bank Account - Account Number"
                                                // onChange={(e) =>
                                                //     handleChangeAdd(e, i)
                                                // }
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
                                            value={2}
                                            checked={dataReportById?.REPORT_CASH_ADVANCE_CASH_AMOUNT > 0 && true}
                                            onChange={(e) => handleCheckedCash(e)}
                                            />
                                        </div>
                                        <div className="flex w-full">
                                            <div className="ml-3 text-sm leading-9">
                                                <label htmlFor="cash" className="font-medium text-gray-900">
                                                Cash
                                                </label>
                                            </div>
                                            <TextInput
                                                id="CASH_ADVANCE_CASH_AMOUNT"
                                                type="number"
                                                name="CASH_ADVANCE_CASH_AMOUNT"
                                                value={dataReportById?.REPORT_CASH_ADVANCE_CASH_AMOUNT}
                                                className="w-5/12 lg:w-1/4 text-right ml-9"
                                                placeholder="0.00"
                                                readOnly
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
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
                                value={dataReportById?.REPORT_CASH_ADVANCE_REQUEST_NOTE}
                                onChange={(e) =>
                                    setData("cash_advance_request_note", e.target.value)
                                }
                                readOnly
                            />
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
                url={`/cashAdvanceReportApprove/${dataReportById?.CASH_ADVANCE_ID}`}
                data={dataReportById}
                method="patch"
                onSuccess={handleSuccess}
                headers={null}
                submitButtonName={""}
                // panelWidth={"70%"}
                body={
                    <>
                        <ModalToAction
                            classPanel={"relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 sm:min-w-full lg:min-w-[35%]"}
                            show={modalFiles.show_files_report}
                            closeable={true}
                            onClose={() =>
                                setModalFiles({
                                    add_files: false,
                                    show_files: false,
                                    add_files_report: false,
                                    show_files_report: false,
                                    index: "",
                                    index_show: "",
                                    index_show_report: "",
                                })
                            }
                            title="Show Files"
                            url={`/cashAdvanceReportDownload/${dataReportById?.cash_advance_detail_report[modalFiles.index_show_report]?.REPORT_CASH_ADVANCE_DETAIL_ID}`}
                            data=""
                            method=""
                            onSuccess=""
                            headers={null}
                            submitButtonName=""
                            // panelWidth=""
                            body={
                                <>
                                    <div className="grid grid-cols-12 my-3">
                                            {dataReportById?.cash_advance_detail_report[modalFiles.index_show_report]?.m_cash_advance_report_document.map((file:any, i:number) => (
                                                <>
                                                    <div className={`w-full col-span-11 mb-4`} key={i}>
                                                        <InputLabel
                                                            htmlFor="files"
                                                            value="File"
                                                            className="mb-2"
                                                        />
                                                        <p>
                                                            {dataReportById?.cash_advance_detail_report[modalFiles.index_show_report].m_cash_advance_report_document[i]?.document.DOCUMENT_ORIGINAL_NAME}
                                                        </p>
                                                    </div>
                                                    <button 
                                                        type="button" 
                                                        title="Download File" 
                                                        onClick={() =>
                                                            handleFileReportDownload(
                                                                dataReportById?.cash_advance_detail_report[modalFiles.index_show_report]?.REPORT_CASH_ADVANCE_DETAIL_ID,
                                                                i
                                                            )
                                                        }
                                                    >
                                                        <ArrowDownTrayIcon className="w-5 mt-7 m-auto cursor-pointer" />
                                                    </button>
                                                </>
                                            ))}
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
                                    value={dataReportById?.REPORT_CASH_ADVANCE_NUMBER}
                                    className="bg-gray-100"
                                    autoComplete="cashAdvanceReportNumber"
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
                                    value={dataReportById?.cash_advance.CASH_ADVANCE_NUMBER}
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
                                    value={auth.user.person.PERSON_FIRST_NAME}
                                    className="bg-gray-100"
                                    autoComplete="namaPengguna"
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
                                    value={dataReportById?.person_used_by?.PERSON_FIRST_NAME}
                                    className="bg-gray-100"
                                    autoComplete="namaPemohon"
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
                                    value={auth.user.person.division.RELATION_DIVISION_ALIAS}
                                    className="bg-gray-100"
                                    autoComplete="divisi"
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
                                    htmlFor="namaPemberiApproval"
                                    value="Request for Approval"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="namaPemberiApproval"
                                    type="text"
                                    name="namaPemberiApproval"
                                    value={dataReportById?.person_approval?.PERSON_FIRST_NAME}
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
                                            label="Approval"
                                            className="border"
                                            rowSpan="2"
                                        />
                                        <TH
                                            label="Cost Classification"
                                            className="border"
                                            rowSpan="2"
                                        />
                                        <TH
                                            label="Amount Approve"
                                            className="border"
                                            rowSpan="2"
                                        />
                                        <TH
                                            label="Remarks"
                                            className="border"
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
                                </thead>{" "}
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
                                                    {cad.REPORT_CASH_ADVANCE_DETAIL_PURPOSE}
                                                </TD>
                                                <TD className="border px-3">
                                                    {cad.relation_organization?.RELATION_ORGANIZATION_NAME}
                                                </TD>
                                                <TD className="border px-3">
                                                    {
                                                        cad.REPORT_CASH_ADVANCE_DETAIL_RELATION_NAME
                                                    }
                                                </TD>
                                                <TD className="border px-3">
                                                    {
                                                        cad.REPORT_CASH_ADVANCE_DETAIL_RELATION_POSITION
                                                    }
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
                                                    {cad?.m_cash_advance_report_document?.length > 0 ? (
                                                        <button type="button"
                                                            className="bg-black hover:bg-slate-800 text-sm text-white py-2 px-3"
                                                            onClick={() => {
                                                                setModalFiles({
                                                                    add_files: false,
                                                                    show_files: false,
                                                                    add_files_report: false,
                                                                    show_files_report: true,
                                                                    index: "",
                                                                    index_show: "",
                                                                    index_show_report: i,
                                                                });
                                                            }}
                                                        >
                                                            
                                                            {cad?.m_cash_advance_report_document?.length} Files
                                                        </button>
                                                    ) : 
                                                        '-'
                                                    }
                                                </TD>
                                                <TD className="border">
                                                    <select
                                                        id="REPORT_CASH_ADVANCE_DETAIL_APPROVAL"
                                                        name="REPORT_CASH_ADVANCE_DETAIL_APPROVAL"
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                        onChange={(e) =>
                                                            handleChangeApproveReport(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                        value={cad.REPORT_CASH_ADVANCE_DETAIL_APPROVAL}
                                                    >
                                                        <option value="">
                                                            -- Choose Approval --
                                                        </option>
                                                        {cash_advance_cost_classification.map(
                                                            (cost_classification:any) => (
                                                                <option
                                                                    key={cost_classification.CASH_ADVANCE_COST_CLASSIFICATION_ID}
                                                                    value={
                                                                        cost_classification.CASH_ADVANCE_COST_CLASSIFICATION_ID
                                                                    }
                                                                >
                                                                    {
                                                                        cost_classification.CASH_ADVANCE_COST_CLASSIFICATION_NAME
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
                                                            `flex text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400 ring-1 ring-gray-300`,
                                                        menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                        listItem: ({ isSelected }: any) =>
                                                            `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                                isSelected
                                                                    ? `text-white bg-red-600`
                                                                    : `text-gray-500 hover:bg-red-100 hover:text-black`
                                                            }`,
                                                    }}
                                                    options={selectCoa}
                                                    isSearchable={true}
                                                    placeholder={"Choose COA"}
                                                    value={cad.REPORT_CASH_ADVANCE_DETAIL_COST_CLASSIFICATION}
                                                    onChange={(val: any) =>
                                                        handleChangeApproveReportCustom(val, "REPORT_CASH_ADVANCE_DETAIL_COST_CLASSIFICATION", i)
                                                    }
                                                    primaryColor={"bg-red-500"}
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
                                                        onValueChange={(val: any) =>
                                                            handleChangeApproveReportCustom(val, "REPORT_CASH_ADVANCE_DETAIL_AMOUNT_APPROVE", i)
                                                        }
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                        required
                                                        placeholder="0.00"
                                                        autoComplete="off"
                                                    />
                                                </TD>
                                                <TD className="border">
                                                    <TextInput
                                                        id="REPORT_CASH_ADVANCE_DETAIL_REMARKS"
                                                        type="text"
                                                        name="REPORT_CASH_ADVANCE_DETAIL_REMARKS"
                                                        value={cad.REPORT_CASH_ADVANCE_DETAIL_REMARKS}
                                                        className="w-1/2"
                                                        autoComplete="off"
                                                        onChange={(e) =>
                                                            handleChangeApproveReport(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                    />
                                                </TD>
                                        </tr>
                                        )
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr className="text-center text-black text-sm leading-7">
                                        <TD
                                            className="border text-right pr-5 py-2"
                                            colSpan={12}
                                        >
                                            TOTAL AMOUNT APPROVE
                                        </TD>
                                        <TD className="border text-center py-2">
                                            {formatCurrency.format(
                                                total_amount_approve
                                            )}
                                        </TD>
                                    </tr>
                                    <tr className="text-center text-black text-sm leading-7">
                                        <TD
                                            className="border text-right pr-5 py-2"
                                            colSpan={12}
                                        >
                                            TOTAL AMOUNT REQUEST
                                        </TD>
                                        <TD className="border text-center py-2">
                                            {formatCurrency.format(
                                                dataReportById?.REPORT_CASH_ADVANCE_TOTAL_AMOUNT_REQUEST
                                            )}
                                        </TD>
                                    </tr>
                                    <tr className="text-center text-black text-sm leading-7">
                                        <TD
                                            className="border text-right pr-5 py-2"
                                            colSpan={12}
                                        >
                                            TOTAL AMOUNT DIFFERENT
                                        </TD>
                                        <TD className="border text-center py-2">
                                            {formatCurrency.format(
                                                dataReportById?.cash_advance.CASH_ADVANCE_TOTAL_AMOUNT - total_amount_approve
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
                                    Type
                                    {/* <span className="text-red-600">*</span> */}
                                </InputLabel>
                                <select
                                    id="REPORT_CASH_ADVANCE_TYPE"
                                    name="REPORT_CASH_ADVANCE_TYPE"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    onChange={(e) =>
                                        setDataReportById({...dataReportById, REPORT_CASH_ADVANCE_TYPE: e.target.value})
                                    }
                                    value={dataReportById?.REPORT_CASH_ADVANCE_TYPE}
                                >
                                    <option value="">
                                        -- Choose Type --
                                    </option>
                                    {getCashAdvanceDifferents.map((different: any) => (
                                        <option
                                            key={different.CASH_ADVANCE_DIFFERENTS_ID}
                                            value={different.CASH_ADVANCE_DIFFERENTS_ID}
                                        >
                                            {different.CASH_ADVANCE_DIFFERENTS_NAME}
                                        </option>
                                    ))}
                                </select>
                                {/* <TextInput
                                    value={dataReportById?.REPORT_CASH_ADVANCE_TYPE === 1 ? "Settlement" : "Refund"}
                                    className="bg-gray-100"
                                    readOnly
                                /> */}
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
                                value={dataReportById?.REPORT_CASH_ADVANCE_REQUEST_NOTE}
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
                                onClick={() => handleBtnReportStatus(2)}
                            >
                                Reject
                            </button>
                            <button
                                type="submit"
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-500 sm:ml-3 sm:mt-0 sm:w-auto"
                                onClick={() => handleBtnReportStatus(1)}
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
                method="patch"
                onSuccess={handleSuccess}
                headers={null}
                submitButtonName={"Save"}
                // panelWidth={"70%"}
                body={
                    <>
                        <ModalToAction
                            classPanel={"relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 sm:min-w-full lg:min-w-[35%]"}
                            show={modalFiles.show_files_report}
                            closeable={true}
                            onClose={() =>
                                setModalFiles({
                                    add_files: false,
                                    show_files: false,
                                    add_files_report: false,
                                    show_files_report: false,
                                    index: "",
                                    index_show: "",
                                    index_show_report: "",
                                })
                            }
                            title="Show Files"
                            url={`/cashAdvanceReportDownload/${dataReportById?.cash_advance_detail_report[modalFiles.index_show_report]?.REPORT_CASH_ADVANCE_DETAIL_ID}`}
                            data=""
                            method=""
                            onSuccess=""
                            headers={null}
                            submitButtonName=""
                            // panelWidth=""
                            body={
                                <>
                                    <div className="grid grid-cols-12 my-3">
                                            {dataReportById?.cash_advance_detail_report[modalFiles.index_show_report]?.m_cash_advance_report_document.map((file:any, i:number) => (
                                                <>
                                                    <div className={`w-full col-span-11 mb-4`} key={i}>
                                                        <InputLabel
                                                            htmlFor="files"
                                                            value="File"
                                                            className="mb-2"
                                                        />
                                                        <p>
                                                            {dataReportById?.cash_advance_detail_report[modalFiles.index_show_report].m_cash_advance_report_document[i]?.document.DOCUMENT_ORIGINAL_NAME}
                                                        </p>
                                                    </div>
                                                    <button 
                                                        type="button" 
                                                        title="Download File" 
                                                        onClick={() =>
                                                            handleFileReportDownload(
                                                                dataReportById?.cash_advance_detail_report[modalFiles.index_show_report]?.REPORT_CASH_ADVANCE_DETAIL_ID,
                                                                i
                                                            )
                                                        }
                                                    >
                                                        <ArrowDownTrayIcon className="w-5 mt-7 m-auto cursor-pointer" />
                                                    </button>
                                                </>
                                            ))}
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
                                    value={dataReportById?.REPORT_CASH_ADVANCE_NUMBER}
                                    className="bg-gray-100"
                                    autoComplete="cashAdvanceReportNumber"
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
                                    value={dataReportById?.cash_advance.CASH_ADVANCE_NUMBER}
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
                                    value={auth.user.person.PERSON_FIRST_NAME}
                                    className="bg-gray-100"
                                    autoComplete="namaPengguna"
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
                                    value={dataReportById?.person_used_by?.PERSON_FIRST_NAME}
                                    className="bg-gray-100"
                                    autoComplete="namaPemohon"
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
                                    value={auth.user.person.division.RELATION_DIVISION_ALIAS}
                                    className="bg-gray-100"
                                    autoComplete="divisi"
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
                                    htmlFor="namaPemberiApproval"
                                    value="Request for Approval"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="namaPemberiApproval"
                                    type="text"
                                    name="namaPemberiApproval"
                                    value={dataReportById?.person_approval?.PERSON_FIRST_NAME}
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
                                        {dataReportById?.cash_advance_detail_report.length >
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
                                                        selected={cad.REPORT_CASH_ADVANCE_DETAIL_START_DATE}
                                                        onChange={(date: any) =>
                                                            handleChangeRevisedReportDate(date, "REPORT_CASH_ADVANCE_DETAIL_START_DATE", i)
                                                        }
                                                        dateFormat={"dd-MM-yyyy"}
                                                        placeholderText="dd-mm-yyyyy"
                                                        className="border-0 rounded-md shadow-md text-sm h-9 w-[100%] focus:ring-2 focus:ring-inset focus:ring-red-600"
                                                        autoComplete="off"
                                                        required
                                                    />
                                                </TD>
                                                <TD className="border whitespace-nowrap">
                                                    <DatePicker
                                                        name="REPORT_CASH_ADVANCE_DETAIL_END_DATE"
                                                        selected={cad.REPORT_CASH_ADVANCE_DETAIL_END_DATE}
                                                        onChange={(date: any) =>
                                                            handleChangeRevisedReportDate(date, "REPORT_CASH_ADVANCE_DETAIL_END_DATE", i)
                                                        }
                                                        dateFormat={"dd-MM-yyyy"}
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
                                                        value={cad.REPORT_CASH_ADVANCE_DETAIL_PURPOSE}
                                                        className="w-1/2"
                                                        autoComplete="off"
                                                        onChange={(e) =>
                                                            handleChangeRevisedReport(e, i)
                                                        }
                                                    />
                                                </TD>
                                                <TD className="border whitespace-nowrap">
                                                    <select
                                                        id="REPORT_CASH_ADVANCE_DETAIL_RELATION_ORGANIZATION_ID"
                                                        name="REPORT_CASH_ADVANCE_DETAIL_RELATION_ORGANIZATION_ID"
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                        value={
                                                            cad.REPORT_CASH_ADVANCE_DETAIL_RELATION_ORGANIZATION_ID
                                                        }
                                                        onChange={(e) =>
                                                            handleChangeRevisedReport(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                        required
                                                    >
                                                        <option value="">
                                                            -- Choose Business
                                                            Relation --
                                                        </option>
                                                        {relations.map(
                                                            (relation: any) => (
                                                                <option
                                                                    key={relation.RELATION_ORGANIZATION_ID}
                                                                    value={
                                                                        relation.RELATION_ORGANIZATION_ID
                                                                    }
                                                                >
                                                                    {
                                                                        relation.RELATION_ORGANIZATION_NAME
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
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
                                                        required
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
                                                        required
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
                                                        onValueChange={(val: any) =>
                                                            handleChangeRevisedReportCustom(val, "REPORT_CASH_ADVANCE_DETAIL_AMOUNT", i)
                                                        }
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                                        required
                                                        placeholder="0.00"
                                                        autoComplete="off"
                                                    />
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {cad?.m_cash_advance_report_document?.length > 0 ? (
                                                        <button type="button"
                                                            className="bg-black hover:bg-slate-800 text-sm text-white py-2 px-3"
                                                            onClick={() => {
                                                                setModalFiles({
                                                                    add_files: false,
                                                                    show_files: false,
                                                                    add_files_report: false,
                                                                    show_files_report: true,
                                                                    index: "",
                                                                    index_show: "",
                                                                    index_show_report: i,
                                                                });
                                                            }}
                                                        >
                                                            
                                                            {cad?.m_cash_advance_report_document?.length} Files
                                                        </button>
                                                    ) : 
                                                        '-'
                                                    }
                                                </TD>
                                                {dataReportById.cash_advance_detail_report
                                                    .length > 1 && (
                                                    <TD className="border whitespace-nowrap">
                                                        <Button
                                                            className="my-1.5 px-3 py-1"
                                                            onClick={() =>
                                                                handleRemoveRowRevisedReport(
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
                                    <tr className="text-center text-black text-sm leading-7">
                                        <TD></TD>
                                        <TD>
                                            <Button
                                                className="mt-5 px-2 py-1 text-black bg-none shadow-none hover:underline"
                                                onClick={(e) => handleAddRowRevisedReport(e)}
                                                type="button"
                                            >
                                                + Add Row
                                            </Button>
                                        </TD>
                                        <TD
                                            className="text-right pr-5 py-2"
                                            colSpan={6}
                                        >
                                            TOTAL AMOUNT
                                        </TD>
                                        <TD className="py-2">
                                            {formatCurrency.format(
                                                revised_total_amount_report
                                            )}
                                        </TD>
                                    </tr>
                                    <tr className="text-center text-black text-sm leading-7">
                                        <TD
                                            className="text-right pr-5 py-2"
                                            colSpan={8}
                                        >
                                            TOTAL AMOUNT REQUEST
                                        </TD>
                                        <TD className="py-2">
                                            {formatCurrency.format(
                                                dataReportById?.REPORT_CASH_ADVANCE_TOTAL_AMOUNT_REQUEST
                                            )}
                                        </TD>
                                    </tr>
                                    <tr className="text-center text-black text-sm leading-7">
                                        <TD
                                            className="text-right pr-5 py-2"
                                            colSpan={8}
                                        >
                                            TOTAL AMOUNT DIFFERENT
                                        </TD>
                                        <TD className="py-2">
                                            {formatCurrency.format(
                                                dataReportById?.REPORT_CASH_ADVANCE_TOTAL_AMOUNT_REQUEST - revised_total_amount_report
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
                                    Type
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
                                        -- Choose Type --
                                    </option>
                                    {getCashAdvanceDifferents.map((different: any) => (
                                        <option
                                            key={different.CASH_ADVANCE_DIFFERENTS_ID}
                                            value={different.CASH_ADVANCE_DIFFERENTS_ID}
                                        >
                                            {different.CASH_ADVANCE_DIFFERENTS_NAME}
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
                                value={dataReportById?.REPORT_CASH_ADVANCE_REQUEST_NOTE}
                                onChange={(e) => setDataReportById({
                                    ...dataReportById,
                                    REPORT_CASH_ADVANCE_REQUEST_NOTE: e.target.value,
                                })}
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
                        <div className="grid md:grid-cols-2 my-10">
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="type"
                                    className="mb-2"
                                >
                                    Total Amount Request
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
                                <InputLabel
                                    htmlFor="type"
                                    className="mb-2"
                                >
                                    Total Amount Approve
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
                                <InputLabel
                                    htmlFor="type"
                                    className="mb-2"
                                >
                                    Total Amount Different
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
                                <InputLabel
                                    htmlFor="amount"
                                    className="mb-2"
                                >
                                    Amount
                                    {/* <span className="text-red-600">*</span> */}
                                </InputLabel>
                                <CurrencyInput
                                    id="amount"
                                    name="amount"
                                    value={
                                        dataReportById?.REPORT_CASH_ADVANCE_AMOUNT
                                    }
                                    decimalScale={2}
                                    decimalsLimit={2}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right bg-gray-100"
                                    disabled
                                    placeholder="0.00"
                                    autoComplete="off"
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="type"
                                    className="mb-2"
                                >
                                    Type
                                    {/* <span className="text-red-600">*</span> */}
                                </InputLabel>
                                <TextInput
                                    value={dataReportById?.REPORT_CASH_ADVANCE_TYPE === 1 ? "Settlement" : "Refund"}
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="method"
                                    className="mb-2"
                                >
                                    Method
                                    <span className="text-red-600">*</span>
                                </InputLabel>
                                <select
                                    id="method"
                                    name="method"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    onChange={(e) =>
                                        setDataCAReport({...dataCAReport, method: e.target.value})
                                    }
                                    required
                                >
                                    <option value="">
                                        -- Choose Method --
                                    </option>
                                    {methods.map((method: any) => (
                                        <option
                                            key={method.id}
                                            value={method.id}
                                        >
                                            {method.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-full p-2">
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
                                    onChange={(date:any) =>
                                        setDataCAReport({...dataCAReport, transaction_date: date.toLocaleDateString("en-CA")})
                                    }
                                    dateFormat={"dd-MM-yyyy"}
                                    placeholderText="dd-mm-yyyyy"
                                    className="border-0 rounded-md shadow-md text-sm h-9 w-[100%] focus:ring-2 focus:ring-inset focus:ring-red-600"
                                    autoComplete="off"
                                    required
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="document"
                                    className="mb-2"
                                >
                                    Proof of Document
                                    <span className="text-red-600">*</span>
                                </InputLabel>
                                <div className="">
                                    <button type="button"
                                        className="bg-black hover:bg-slate-800 text-sm text-white py-2 px-3"
                                        onClick={() => {
                                            setModalFiles({
                                                add_files: false,
                                                show_files: false,
                                                add_files_report: false,
                                                show_files_report: false,
                                                add_files_execute_report: true,
                                                index: ""
                                            });
                                        }}
                                    >
                                        Add Files
                                    </button>
                                </div>
                                <ModalToAction
                                    classPanel={"relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 sm:min-w-full lg:min-w-[35%]"}
                                    show={modalFiles.add_files_execute_report}
                                    closeable={true}
                                    onClose={() =>
                                        setModalFiles({
                                            add_files: false,
                                            show_files: false,
                                            add_files_report: false,
                                            show_files_report: false,
                                            add_files_execute_report: false,
                                            index: ""
                                        })
                                    }
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
                                            {/* {data.CashAdvanceDetail[modalFiles.index]?.cash_advance_detail_document_id.map((val: any, i:number) => (
                                                <div className="grid grid-cols-12 my-5" key={i}>
                                                        <div className={`w-full col-span-11`}>
                                                            <InputLabel
                                                                htmlFor="files"
                                                                value="File"
                                                                className="mb-2"
                                                            />

                                                            {data.CashAdvanceDetail[modalFiles.index].cash_advance_detail_document_id[i]?.name ? (
                                                                <p>
                                                                    {data.CashAdvanceDetail[modalFiles.index].cash_advance_detail_document_id[i]?.name}
                                                                </p>
                                                            ) : (
                                                                <Input
                                                                    name="cash_advance_detail_document_id"
                                                                    type="file"
                                                                    className="w-full"
                                                                    onChange={(e) =>
                                                                        handleChangeAddFiles(e, i)
                                                                    }
                                                                />
                                                            )}
                                                        </div>
                                                        <button
                                                            className="text-center self-center bg-red-600 hover:bg-red-500 text-white mx-2 mt-8 py-1 rounded-lg"
                                                            onClick={(e) =>
                                                                handleRemoveFilesRow(e, i)
                                                            }
                                                        >
                                                            X
                                                        </button>
                                                </div>
                                            ))} */}
                                            {dataCAReport.proof_of_document.map((val:any, i:number) => (
                                                <div className="grid grid-cols-12 my-5" key={i}>
                                                    <div className="w-full col-span-11">
                                                        <Input
                                                            name="proof_of_document"
                                                            type="file"
                                                            className="w-full"
                                                            onChange={(e) =>
                                                                handleChangeProofOfDocument(e, i)
                                                            }
                                                        />
                                                    </div>
                                                    <button
                                                        className="text-center self-center bg-red-600 hover:bg-red-500 text-white mx-2 py-1 rounded-lg"
                                                        onClick={(e) =>
                                                            handleRemoveProofOfDocument(e, i)
                                                        }
                                                    >
                                                        X
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                className="text-sm cursor-pointer hover:underline"
                                                onClick={(e) => handleAddRowProofOfDocument(e)}
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
            {/* Modal Execute Report End */}

            {/* Modal Search CA */}
            <ModalSearch
                show={modal.search}
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
                title={"Search Cash Advance"}
                submitButtonName={"Search"}
                onAction={() => {
                    getCA();
                }}
                isLoading={isLoading}
                body={
                    <>
                        <div className="mb-4">
                            <InputLabel
                                htmlFor="CASH_ADVANCE_NUMBER"
                                value="CA Number"
                            />
                            <TextInput
                                id="CASH_ADVANCE_NUMBER"
                                type="text"
                                name="CASH_ADVANCE_NUMBER"
                                value={searchCA.CASH_ADVANCE_NUMBER}
                                className=""
                                onChange={(e) =>
                                    setSearchCA({
                                        ...searchCA,
                                        CASH_ADVANCE_NUMBER: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </>
                }
            />
            {/* End Modal Search CA */}

            {/* Modal Search CA Report */}
            <ModalSearch
                show={modal.search_ca_report}
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
                title={"Search Cash Advance Report"}
                submitButtonName={"Search"}
                onAction={() => getCAReport()}
                isLoading={isLoadingReport}
                body={
                    <>
                        <div className="mb-4">
                            <InputLabel
                                htmlFor="REPORT_CASH_ADVANCE_NUMBER"
                                value="CA Number"
                            />
                            <TextInput
                                id="REPORT_CASH_ADVANCE_NUMBER"
                                type="text"
                                name="REPORT_CASH_ADVANCE_NUMBER"
                                value={searchCAReport.REPORT_CASH_ADVANCE_NUMBER}
                                className=""
                                onChange={(e) =>
                                    setSearchCAReport({
                                        ...searchCAReport,
                                        REPORT_CASH_ADVANCE_NUMBER: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </>
                }
            />
            {/* End Modal Search CA Report */}

            {/* Content Start */}
            {/* <div className="max-w-0xl mx-auto sm:px-6 lg:px-0"> */}
            <div className="p-6 text-gray-900 mb-60">
                {/* Tabs Start */}
                {/* <div className="flex hover:cursor-pointer">
                    {tabs.map((tab, i) => (
                        <div
                            key={i}
                            className={`tab-1 px-5 py-4 rounded-t-lg ${
                                toggleState === tab.index
                                    ? `font-bold bg-white`
                                    : "hover:bg-white"
                            }`}
                            onClick={() => toggleTab(tab.index)}
                        >
                            {tab.name}
                        </div>
                    ))}
                </div> */}
                {/* Tabs End */}
                
                    <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-4 mb-5 mt-5">
                        <div className="flex flex-col">
                            <div className="rounded-tr-md rounded-br-md rounded-bl-md bg-white pt-5 pb-1 px-10 shadow-default dark:border-strokedark dark:bg-boxdark">
                                <Button
                                    className="text-sm font-semibold mb-4 px-6 py-1.5 md:col-span-2 lg:col-auto text-white bg-red-600 hover:bg-red-500"
                                    onClick={(e) =>
                                        handleAddModal(
                                            e,
                                            1,
                                            0
                                        )
                                    }
                                >
                                    {"Add Cash Advance"}
                                </Button>
                            </div>
                            <div className="bg-white rounded-md mb-5 lg:mb-0 p-10 mt-5 relative">
                                <fieldset className="pb-10 pt-5 rounded-lg border-slate-100 border-2">
                                    <legend className="ml-8 px-3 text-sm">Search</legend>
                                    <div className="mt-3 px-4">
                                        <div className="mb-5">
                                            <Input
                                                id="cash_advance_requested_by"
                                                name="cash_advance_requested_by"
                                                type="text"
                                                value={searchCA.cash_advance_requested_by}
                                                placeholder="Applicant"
                                                className="focus:ring-red-600"
                                                autoComplete="off"
                                                onChange={(e:any) =>
                                                setSearchCA({
                                                    ...searchCA,
                                                    cash_advance_requested_by: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="mb-5">
                                            <Input
                                                id="cash_advance_used_by"
                                                name="cash_advance_used_by"
                                                type="text"
                                                value={searchCA.cash_advance_used_by}
                                                placeholder="Used By"
                                                className="focus:ring-red-600"
                                                autoComplete="off"
                                                onChange={(e:any) =>
                                                setSearchCA({
                                                    ...searchCA,
                                                    cash_advance_used_by: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 mb-5">
                                            <DatePicker
                                                name="cash_advance_start_date"
                                                selected={searchCA.cash_advance_start_date}
                                                onChange={(date:any) =>
                                                    setSearchCA({...searchCA, cash_advance_start_date: date.toLocaleDateString("en-CA")})
                                                }
                                                dateFormat={"dd-MM-yyyy"}
                                                placeholderText="dd-mm-yyyyy (Start Date)"
                                                className="!block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-2 file:-my-1.5 focus:ring-red-600"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 mb-5">
                                            <DatePicker
                                                name="cash_advance_end_date"
                                                selected={searchCA.cash_advance_end_date}
                                                onChange={(date:any) =>
                                                    setSearchCA({...searchCA, cash_advance_end_date: date.toLocaleDateString("en-CA")})
                                                }
                                                dateFormat={"dd-MM-yyyy"}
                                                placeholderText="dd-mm-yyyyy (End Date)"
                                                className="!block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-2 file:-my-1.5 focus:ring-red-600"
                                            />
                                        </div>
                                        <div className="mb-5">
                                            <Input
                                                id="cash_advance_division"
                                                name="cash_advance_division"
                                                type="text"
                                                value={searchCA.cash_advance_division}
                                                placeholder="Division"
                                                className="focus:ring-red-600"
                                                autoComplete="off"
                                                onChange={(e:any) =>
                                                    setSearchCA({
                                                        ...searchCA,
                                                        cash_advance_division: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="mb-5">
                                            <select name="cash_advance_type" id="cash_advance_type" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-2 file:-my-1.5 focus:ring-red-600"
                                                onChange={(e:any) =>
                                                    setSearchCA({
                                                        ...searchCA,
                                                        cash_advance_type: e.target.value,
                                                    })
                                                }
                                                >
                                                    <option value="1">Cash Advance</option>
                                                    <option value="2">Cash Advance Report</option>
                                            </select>
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                className="mb-4 w-40 py-1.5 px-2 bg-red-600 hover:bg-red-500"
                                                onClick={() => getCA()}
                                            >
                                                Search
                                            </Button>
                                            <Button
                                                className="mb-4 w-40 py-1.5 px-2 bg-red-600 hover:bg-red-500"
                                                onClick={() => clearSearchCA()}
                                            >
                                                Clear Search
                                            </Button>
                                        </div>
                                    </div>
                                </fieldset>
                                <div className="mt-10">
                                    <fieldset className="pb-10 pt-5 rounded-lg border-slate-100 border-2">
                                        <legend className="ml-8 text-sm">Cash Advance Status</legend>
                                        <ArrowPathIcon 
                                            className="w-5 text-gray-600 hover:text-gray-500 cursor-pointer ml-auto mr-3 mb-8"
                                            onClick={() => handleRefresh()}
                                        >
                                        </ArrowPathIcon>
                                        <div className="flex flex-wrap content-between justify-center gap-6 mt-5 text-sm">
                                            <div className="flex relative">
                                                <Button className="w-36 bg-gray-500 px-2 py-1 hover:bg-gray-400" onClick={() => getCA("", "0", "Approve1")}>
                                                    Request
                                                    <span className="flex absolute bg-red-600 -top-2 -right-3 px-2 rounded-full">
                                                        {getCountCARequestStatus}
                                                    </span>
                                                </Button>
                                            </div>
                                            <div className="flex relative">
                                                <Button className="w-36 bg-green-600 px-2 py-1 hover:bg-green-500" onClick={() => getCA("", "1", "Approve1")}>
                                                    Approve 1
                                                    <span className="flex absolute bg-red-600 -top-2 -right-3 px-2 rounded-full">
                                                        {getCountCAApprove1Status}
                                                    </span>
                                                </Button>
                                            </div>
                                            <div className="flex relative">
                                                <Button className="w-36 bg-green-600 px-2 py-1 hover:bg-green-500" onClick={() => getCA("", "1", "Approve2")}>
                                                    Approve 2
                                                    <span className="flex absolute bg-red-600 -top-2 -right-3 px-2 rounded-full">
                                                        {getCountCAApprove2Status}
                                                    </span>
                                                </Button>
                                            </div>
                                            <div className="flex relative">
                                                <Button className="w-36 bg-yellow-400 px-2 py-1 hover:bg-yellow-300" onClick={() => getCA("", "4", "Pending Report")}>
                                                    Pending Report
                                                    <span className="flex absolute bg-red-600 -top-2 -right-3 px-2 rounded-full">
                                                        {getCountCAPendingReportStatus}
                                                    </span>
                                                </Button>
                                            </div>
                                            <div className="flex relative">
                                                <Button className="w-36 bg-yellow-400 px-2 py-1 hover:bg-yellow-300" onClick={() => getCA("", "3", "Need Revision")}>
                                                    Need Revision
                                                    <span className="flex absolute bg-red-600 -top-2 -right-3 px-2 rounded-full">
                                                        {getCountCANeedRevisionStatus}
                                                    </span>
                                                </Button>
                                            </div>
                                            <div className="flex relative">
                                                <Button className="w-36 bg-red-600 px-2 py-1 hover:bg-red-500" onClick={() => getCA("", "2", "Reject")}>
                                                    Reject
                                                    <span className="flex absolute bg-red-600 -top-2 -right-3 px-2 rounded-full">
                                                        {getCountCARejectStatus}
                                                    </span>
                                                </Button>
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>

                                <div className="mt-10">
                                    <fieldset className="pb-10 pt-5 rounded-lg border-slate-100 border-2">
                                        <legend className="ml-8 text-sm">Cash Advance Report Status</legend>
                                        <ArrowPathIcon 
                                            className="w-5 text-gray-600 hover:text-gray-500 cursor-pointer ml-auto mr-3 mb-8"
                                            onClick={() => handleRefresh()}
                                        >
                                        </ArrowPathIcon>
                                        <div className="flex flex-wrap content-between gap-6 justify-center mt-5 text-sm">
                                            <div className="flex relative">
                                                <Button className="w-36 bg-gray-500 px-2 py-1 hover:bg-gray-400" onClick={() => getCA("", "0", "Approve1")}>
                                                    Request
                                                    <span className="flex absolute bg-red-600 -top-2 -right-3 px-2 rounded-full">
                                                        0
                                                    </span>
                                                </Button>
                                            </div>
                                            <div className="flex relative">
                                                <Button className="w-36 bg-green-600 px-2 py-1 hover:bg-green-500" onClick={() => getCA("", "1", "Approve1")}>
                                                    Approve 1
                                                    <span className="flex absolute bg-red-600 -top-2 -right-3 px-2 rounded-full">
                                                        0
                                                    </span>
                                                </Button>
                                            </div>
                                            <div className="flex relative">
                                                <Button className="w-36 bg-green-600 px-2 py-1 hover:bg-green-500" onClick={() => getCA("", "1", "Approve2")}>
                                                    Approve 2
                                                    <span className="flex absolute bg-red-600 -top-2 -right-3 px-2 rounded-full">
                                                        0
                                                    </span>
                                                </Button>
                                            </div>
                                            <div className="flex relative">
                                                <Button className="w-36 bg-yellow-400 px-2 py-1 hover:bg-yellow-300">
                                                    Need Revision
                                                    <span className="flex absolute bg-red-600 -top-2 -right-3 px-2 rounded-full" onClick={() => getCA("", "3", "Need Revision")}>
                                                        0
                                                    </span>
                                                </Button>
                                            </div>
                                            <div className="flex relative">
                                                <Button className="w-36 bg-red-600 px-2 py-1 hover:bg-red-500" onClick={() => getCA("", "2", "Reject")}>
                                                    Reject
                                                    <span className="flex absolute bg-red-600 -top-2 -right-3 px-2 rounded-full">
                                                        0
                                                    </span>
                                                </Button>
                                            </div>
                                            <div className="flex relative">
                                                <Button className="w-36 bg-green-500 px-2 py-1 hover:bg-green-600" onClick={() => getCA("", "6", "Complited")}>
                                                    Complited
                                                </Button>
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-md col-span-2 p-10">
                            <div className={`max-w-full overflow-x-auto ${cashAdvance.data ? "h-[70%]" : "h-auto" } ring-1 ring-stone-200 shadow-xl rounded-lg custom-table overflow-visible`}>
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-100">
                                        <tr className="bg-gray-2 dark:bg-meta-4 text-center">
                                            <TableTH
                                                className="border whitespace-nowrap"
                                                label={"No"}
                                                colSpan=""
                                                rowSpan="2"
                                            />
                                            <TableTH
                                                className="border whitespace-nowrap"
                                                label={"Cash Advance Number"}
                                                colSpan=""
                                                rowSpan="2"
                                            />
                                            <TableTH
                                                className="border whitespace-nowrap"
                                                label={"Cash Advance Report Number"}
                                                colSpan=""
                                                rowSpan="2"
                                            />
                                            <TableTH
                                                className="border whitespace-nowrap"
                                                label={"Request Date"}
                                                colSpan=""
                                                rowSpan="2"
                                            />
                                            <TableTH
                                                className="border whitespace-nowrap"
                                                label={"Amount"}
                                                colSpan=""
                                                rowSpan="2"
                                            />
                                            <TableTH
                                                className="border whitespace-nowrap"
                                                label={"Cash Advance"}
                                                colSpan="3"
                                                rowSpan=""
                                            />
                                            <TableTH
                                                className="border whitespace-nowrap"
                                                label={"Cash Advance Report"}
                                                colSpan="3"
                                                rowSpan=""
                                            />
                                            <TableTH
                                                className={"border whitespace-nowrap"}
                                                label={"Action"}
                                                colSpan=""
                                                rowSpan="2"
                                            />
                                        </tr>
                                        <tr>
                                            <TableTH
                                                className="border whitespace-nowrap"
                                                label={"Approve 1"}
                                                colSpan=""
                                                rowSpan=""
                                            />
                                            <TableTH
                                                className="border whitespace-nowrap"
                                                label={"Approve 2"}
                                                colSpan=""
                                                rowSpan=""
                                            />
                                            <TableTH
                                                className="border whitespace-nowrap"
                                                label={"Approve 3"}
                                                colSpan=""
                                                rowSpan=""
                                            />
                                            <TableTH
                                                className="border whitespace-nowrap"
                                                label={"Approve 1"}
                                                colSpan=""
                                                rowSpan=""
                                            />
                                            <TableTH
                                                className="border whitespace-nowrap"
                                                label={"Approve 2"}
                                                colSpan=""
                                                rowSpan=""
                                            />
                                            <TableTH
                                                className="border whitespace-nowrap"
                                                label={"Approve 3"}
                                                colSpan=""
                                                rowSpan=""
                                            />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cashAdvance.data === undefined && (
                                            <tr>
                                                <TD
                                                    className="leading-10 text-gray-500"
                                                    colSpan="12"
                                                >
                                                    Please Search Cash Advance
                                                </TD>
                                            </tr>
                                        )}
                                        {cashAdvance.data?.length === 0 ? (
                                            <tr>
                                                <TD
                                                    className="leading-10 text-gray-500"
                                                    colSpan="12"
                                                >
                                                    Data not available
                                                </TD>
                                            </tr>
                                        ) : (
                                            cashAdvance.data?.map(
                                                (ca: any, i: number) => (
                                                    <tr
                                                        key={i}
                                                        className={
                                                            i % 2 === 0
                                                                ? "text-center hover:bg-gray-100"
                                                                : "bg-gray-100 text-center"
                                                        }
                                                    >
                                                        <TableTD
                                                            value={i + 1 + "."}
                                                            className="w-px"
                                                        />
                                                        <TableTD
                                                            value={
                                                                ca.CASH_ADVANCE_NUMBER
                                                            }
                                                            className=""
                                                        />
                                                        <TableTD
                                                            value={ca.cash_advance_report?.REPORT_CASH_ADVANCE_NUMBER ? ca.cash_advance_report?.REPORT_CASH_ADVANCE_NUMBER : "-" }
                                                            className=""
                                                        />
                                                        <TableTD
                                                            value={dateFormat(
                                                                ca.CASH_ADVANCE_REQUESTED_DATE,
                                                                "dd-mm-yyyy"
                                                            )}
                                                            className=""
                                                        />
                                                        <TableTD
                                                            value={formatCurrency.format(
                                                                ca.CASH_ADVANCE_TOTAL_AMOUNT
                                                            )}
                                                            className=""
                                                        />
                                                        {ca.CASH_ADVANCE_FIRST_APPROVAL_STATUS ===
                                                            0 && (
                                                            <TableTD
                                                                value={
                                                                    <span className="inline-flex items-center rounded-md bg-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:cursor-pointer" title="Request">
                                                                        {
                                                                            ca.CASH_ADVANCE_FIRST_APPROVAL_USER
                                                                        }
                                                                    </span>
                                                                }
                                                                className=""
                                                            />
                                                        )}
                                                        {ca.CASH_ADVANCE_FIRST_APPROVAL_STATUS ===
                                                            1 && (
                                                            <TableTD
                                                                value={
                                                                    <span className="inline-flex items-center rounded-md bg-green-100 px-3 py-2 text-xs font-medium text-green-700 hover:cursor-pointer" title="Approve">
                                                                        {
                                                                            ca.CASH_ADVANCE_FIRST_APPROVAL_USER
                                                                        }
                                                                    </span>
                                                                }
                                                                className=""
                                                            />
                                                        )}
                                                        {ca.CASH_ADVANCE_FIRST_APPROVAL_STATUS ===
                                                            2 && (
                                                            <TableTD
                                                                value={
                                                                    <span className="inline-flex items-center rounded-md bg-red-100 px-3 py-2 text-xs font-medium text-red-700 hover:cursor-pointer" title="Reject">
                                                                        {
                                                                            ca.CASH_ADVANCE_FIRST_APPROVAL_USER
                                                                        }
                                                                    </span>
                                                                }
                                                                className=""
                                                            />
                                                        )}
                                                        {ca.CASH_ADVANCE_FIRST_APPROVAL_STATUS ===
                                                            3 && (
                                                            <TableTD
                                                                value={
                                                                    <span className="inline-flex items-center rounded-md bg-yellow-300 px-3 py-2 text-xs font-medium text-white hover:cursor-pointer" title="Need Revision">
                                                                        {
                                                                            ca.CASH_ADVANCE_FIRST_APPROVAL_USER
                                                                        }
                                                                    </span>
                                                                }
                                                                className=""
                                                            />
                                                        )}
                                                        {
                                                            ca.CASH_ADVANCE_SECOND_APPROVAL_STATUS === '' || ca.CASH_ADVANCE_SECOND_APPROVAL_STATUS === null &&(
                                                                <TableTD
                                                                    value="-"
                                                                    className=""
                                                                />
                                                            )
                                                        }
                                                        {ca.CASH_ADVANCE_SECOND_APPROVAL_STATUS ===
                                                            1 && (
                                                            <TableTD
                                                                value={
                                                                    <span className="inline-flex items-center rounded-md bg-green-100 px-3 py-2 text-xs font-medium text-green-700 hover:cursor-pointer" title="Approve">
                                                                        {
                                                                            ca.CASH_ADVANCE_SECOND_APPROVAL_USER
                                                                        }
                                                                    </span>
                                                                }
                                                                className=""
                                                            />
                                                        )}
                                                        {ca.CASH_ADVANCE_SECOND_APPROVAL_STATUS ===
                                                            2 && (
                                                            <TableTD
                                                                value={
                                                                    <span className="inline-flex items-center rounded-md bg-red-100 px-3 py-2 text-xs font-medium text-red-700 hover:cursor-pointer" title="Reject">
                                                                        {
                                                                            ca.CASH_ADVANCE_SECOND_APPROVAL_USER
                                                                        }
                                                                    </span>
                                                                }
                                                                className=""
                                                            />
                                                        )}
                                                        {ca.CASH_ADVANCE_SECOND_APPROVAL_STATUS ===
                                                            3 && (
                                                            <TableTD
                                                                value={
                                                                    <span className="inline-flex items-center rounded-md bg-yellow-300 px-3 py-2 text-xs font-medium text-white hover:cursor-pointer" title="Need Revision">
                                                                        {
                                                                            ca.CASH_ADVANCE_SECOND_APPROVAL_USER
                                                                        }
                                                                    </span>
                                                                }
                                                                className=""
                                                            />
                                                        )}
                                                        {ca.CASH_ADVANCE_SECOND_APPROVAL_STATUS ===
                                                            4 && (
                                                            <TableTD
                                                                value={
                                                                    <span className="inline-flex items-center rounded-md bg-green-100 px-3 py-2 text-xs font-medium text-green-700 hover:cursor-pointer" title="Execute">
                                                                        {
                                                                            "-"
                                                                        }
                                                                    </span>
                                                                }
                                                                className=""
                                                            />
                                                        )}
                                                        {
                                                            ca.CASH_ADVANCE_THIRD_APPROVAL_STATUS === '' || ca.CASH_ADVANCE_THIRD_APPROVAL_STATUS === null &&(
                                                                <TableTD
                                                                    value="-"
                                                                    className=""
                                                                />
                                                            )
                                                        }
                                                        {ca.CASH_ADVANCE_THIRD_APPROVAL_STATUS ===
                                                            1 && (
                                                            <TableTD
                                                                value={
                                                                    <span className="inline-flex items-center rounded-md bg-green-100 px-3 py-2 text-xs font-medium text-green-700 hover:cursor-pointer" title="Approve">
                                                                        {
                                                                            ca.CASH_ADVANCE_THIRD_APPROVAL_USER
                                                                        }
                                                                    </span>
                                                                }
                                                                className=""
                                                            />
                                                        )}
                                                        {ca.CASH_ADVANCE_THIRD_APPROVAL_STATUS ===
                                                            2 && (
                                                            <TableTD
                                                                value={
                                                                    <span className="inline-flex items-center rounded-md bg-red-100 px-3 py-2 text-xs font-medium text-red-700 hover:cursor-pointer" title="Reject">
                                                                        {
                                                                            ca.CASH_ADVANCE_THIRD_APPROVAL_USER
                                                                        }
                                                                    </span>
                                                                }
                                                                className=""
                                                            />
                                                        )}
                                                        {ca.CASH_ADVANCE_THIRD_APPROVAL_STATUS ===
                                                            3 && (
                                                            <TableTD
                                                                value={
                                                                    <span className="inline-flex items-center rounded-md bg-yellow-300 px-3 py-2 text-xs font-medium text-white hover:cursor-pointer" title="Need Revision">
                                                                        {
                                                                            ca.CASH_ADVANCE_THIRD_APPROVAL_USER
                                                                        }
                                                                    </span>
                                                                }
                                                                className=""
                                                            />
                                                        )}
                                                        <TableTD
                                                            value={
                                                                    // <span className="inline-flex items-center rounded-md bg-gray-200 px-3 py-2 text-xs font-medium text-gray-700">
                                                                    "-"
                                                                    // </span>
                                                                }
                                                            className=""
                                                        />
                                                        <TableTD
                                                            value={
                                                                    // <span className="inline-flex items-center rounded-md bg-gray-200 px-3 py-2 text-xs font-medium text-gray-700">
                                                                        "-"
                                                                    // </span>
                                                                }
                                                            className=""
                                                        />
                                                        <TableTD
                                                            value={
                                                                    // <span className="inline-flex items-center rounded-md bg-gray-200 px-3 py-2 text-xs font-medium text-gray-700">
                                                                        "-"
                                                                    // </span>
                                                                }
                                                            className=""
                                                        />
                                                        <TableTD
                                                            value={
                                                                <Dropdown
                                                                    title="Actions"
                                                                    children={
                                                                        <>
                                                                            <a
                                                                                href=""
                                                                                className="block px-4 py-2 text-sm hover:bg-gray-100"
                                                                                onClick={(
                                                                                    e
                                                                                ) =>
                                                                                    handleShowModal(
                                                                                        e,
                                                                                        ca.CASH_ADVANCE_ID
                                                                                    )
                                                                                }
                                                                            >
                                                                                Detail
                                                                            </a>
                                                                            <a
                                                                                href=""
                                                                                className="block px-4 py-2 text-sm hover:bg-gray-100"
                                                                                onClick={(
                                                                                    e
                                                                                ) =>
                                                                                    handleApproveModal(
                                                                                        e,
                                                                                        ca.CASH_ADVANCE_ID
                                                                                    )
                                                                                }
                                                                            >
                                                                                Approve
                                                                            </a>
                                                                            <a
                                                                                href=""
                                                                                className="block px-4 py-2 text-sm hover:bg-gray-100"
                                                                                onClick={(
                                                                                    e
                                                                                ) =>
                                                                                    handleExecuteModal(
                                                                                        e,
                                                                                        ca.CASH_ADVANCE_ID
                                                                                    )
                                                                                }
                                                                            >
                                                                                Execute
                                                                            </a>
                                                                            <a
                                                                                href=""
                                                                                className="block px-4 py-2 text-sm hover:bg-gray-100"
                                                                                onClick={(
                                                                                    e
                                                                                ) =>
                                                                                    handleRevisedModal(
                                                                                        e,
                                                                                        ca.CASH_ADVANCE_ID
                                                                                    )
                                                                                }
                                                                            >
                                                                                Revised
                                                                            </a>
                                                                            {ca.CASH_ADVANCE_SECOND_APPROVAL_STATUS === 4 &&(
                                                                                <a
                                                                                    href=""
                                                                                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                                                                                    onClick={(
                                                                                        e
                                                                                    ) =>
                                                                                        handleAddCAReportModal(
                                                                                            e,
                                                                                            ca.CASH_ADVANCE_ID,
                                                                                            ca.CASH_ADVANCE_USED_BY,
                                                                                            ca.CASH_ADVANCE_FIRST_APPROVAL_BY,
                                                                                            ca.CASH_ADVANCE_TOTAL_AMOUNT
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    Create CA Report
                                                                                </a>
                                                                            )}
                                                                            {ca.cash_advance_report !== null &&(
                                                                                <>
                                                                                    <a
                                                                                        href=""
                                                                                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                                                                                        onClick={(
                                                                                            e
                                                                                        ) =>
                                                                                            handleShowReportModal(
                                                                                                e,
                                                                                                ca.cash_advance_report?.REPORT_CASH_ADVANCE_ID
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        Detail CA Report
                                                                                    </a>
                                                                                    <a
                                                                                        href=""
                                                                                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                                                                                        onClick={(
                                                                                            e
                                                                                        ) =>
                                                                                            handleApproveReportModal(
                                                                                                e,
                                                                                                ca.cash_advance_report?.REPORT_CASH_ADVANCE_ID
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        Approve CA Report
                                                                                    </a>
                                                                                    <a
                                                                                        href=""
                                                                                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                                                                                        onClick={(
                                                                                            e
                                                                                        ) =>
                                                                                            handleRevisedReportModal(
                                                                                                e,
                                                                                                ca.cash_advance_report?.REPORT_CASH_ADVANCE_ID
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        Revised CA Report
                                                                                    </a>
                                                                                    <a
                                                                                        href=""
                                                                                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                                                                                        onClick={(
                                                                                            e
                                                                                        ) =>
                                                                                            handleExecuteReportModal(
                                                                                                e,
                                                                                                ca.cash_advance_report?.REPORT_CASH_ADVANCE_ID
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        Execute CA Report
                                                                                    </a>
                                                                                </>
                                                                            )}
                                                                        </>
                                                                    }
                                                                />
                                                            }
                                                            className="text-center"
                                                        />
                                                    </tr>
                                                )
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination
                                links={cashAdvance.links}
                                fromData={cashAdvance.from}
                                toData={cashAdvance.to}
                                totalData={cashAdvance.total}
                                clickHref={(url: string) =>
                                    getCA(url.split("?").pop())
                                }
                            />
                        </div>
                    </div>
                </div>
            {/* </div> */}
            {/* Content End */}
        </AuthenticatedLayout>
    );
}