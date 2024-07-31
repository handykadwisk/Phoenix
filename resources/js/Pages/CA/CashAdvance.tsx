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
import { Textarea } from "flowbite-react";
import Dropdown from "@/Components/Dropdown";
import ModalToAction from "@/Components/Modal/ModalToAction";
import TH from "@/Components/TH";
import TD from "@/Components/TD";
import ToastMessage from "@/Components/ToastMessage";
import Pagination from "@/Components/Pagination";
import {
    ArrowDownTrayIcon,
    HandThumbUpIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import dateFormat, { masks } from "dateformat";
import ModalSearch from "@/Components/Modal/ModalSearch";
import Input from "@/Components/Input";
import DatePicker from "react-date-picker";
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';


export default function CashAdvance({ auth }: PageProps) {
    useEffect(() => {
        getCANumber();
    }, []);

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
        add_files_report: false,
        index: "",
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
        cash_advance_transfer_date: "",
        cash_advance_from_bank_account: "",
        cash_advance_receive_date: "",
        cash_advance_receive_name: "",
        refund_amount: "",
        refund_type: "",
        refund_proof: "",
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
        cash_advance_transfer_date: "",
        cash_advance_from_bank_account: "",
        cash_advance_receive_date: "",
        cash_advance_receive_name: "",
        refund_amount: "",
        refund_type: "",
        refund_proof: "",
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
            cash_advance_transfer_date: "",
            cash_advance_from_bank_account: "",
            cash_advance_receive_date: "",
            cash_advance_receive_name: "",
            amount_approve: "",
            refund_amount: "",
            refund_type: "",
            refund_proof: "",
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
    };
    // Handle Success End

    const [dataById, setDataById] = useState<any>({
        // CASH_ADVANCE_NUMBER: "",
        // CASH_ADVANCE_TYPE: "",
        // DIVISION: "",
        // USED_BY: "",
        // CASH_ADVANCE_REQUESTED_BY: "",
        // CASH_ADVANCE_REQUESTED_DATE: "",
        // FIRST_APPROVAL_USER: "",
        // CASH_ADVANCE_REQUEST_NOTE: "",
        // CASH_ADVANCE_TOTAL_AMOUNT: "",
        // CASH_ADVANCE_TRANSFER_DATE: "",
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
    };
    // Handle Change Add End

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
    console.log("Button index : ", modalFiles.index);
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

    const handleUploadFile = (e: any, i: number) => {
        const { name, files } = e.target;

        const onchangeFile: any = [...data.CashAdvanceDetail];

        onchangeFile[i][name] = files[0];

        setData("CashAdvanceDetail", onchangeFile);
    };

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

    const handleUploadFileRevised = (e: any, i: number) => {
        const { name, files } = e.target;

        const onchangeFile: any = [...dataById.cash_advance_detail];

        onchangeFile[i][name] = files[0];

        // setData("CashAdvanceDetail", onchangeFile);

        setDataById({ ...dataById, cash_advance_detail: onchangeFile });
    };

    // Handle Remove Row Revised Start
    const handleRemoveRowRevised = (i: number) => {
        const deleteRow = [...dataById.cash_advance_detail];

        deleteRow.splice(i, 1);

        setDataById({ ...dataById, cash_advance_detail: deleteRow });
    };
    // Handle Remove Row Revised End

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

    // Handle Remove Row Report CA Start
    const handleRemoveReportRow = (i: number) => {
        const deleteRow = [...dataCAReport.CashAdvanceDetail];

        deleteRow.splice(i, 1);

        setDataReportRow(deleteRow);

        setDataCAReport({...dataCAReport, CashAdvanceDetail: deleteRow});
    };
    // Handle Remove Row Report CA End

    // Handle Change Approve Report Start
    const handleChangeApproveReport = (e: any, i: number) => {
        const { name, value } = e.target;

        const onchangeVal: any = [...dataReportById.cash_advance_detail_report];

        onchangeVal[i][name] = value;

        setDataReportById({ ...dataReportById, cash_advance_detail_report: onchangeVal });
    };
    // Handle Change Approve Report End

    // Handle Change Revised Report Start
    const handleChangeRevisedReport = (e: any, i: number) => {
        const { name, value } = e.target;

        const onchangeVal: any = [...dataReportById.cash_advance_detail_report];

        onchangeVal[i][name] = value;

        setDataReportById({ ...dataReportById, cash_advance_detail_report: onchangeVal });
    };
    // Handle Change Revised Report End

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
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getCA = async (pageNumber = "page=1", status:number) => {
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
                cash_advance_first_approval_status: status,
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
    const {
        users,
        cash_advance_purpose,
        cash_advance_cost_classification,
        relations,
        coa
    }: any = usePage().props;

    const purposes = [
        {
            id: 1,
            purpose: "Peruntukan A",
        },
        {
            id: 2,
            purpose: "Peruntukan B",
        },
        {
            id: 3,
            purpose: "Peruntukan C",
        },
    ];

    const companies = [
        {
            id: 1,
            nama_perusahaan: "Perusahaan A",
        },
        {
            id: 2,
            nama_perusahaan: "Perusahaan B",
        },
        {
            id: 3,
            nama_perusahaan: "Perusahaan C",
        },
    ];

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

    const payments = [
        {
            id: 1,
            name: "Cash",
        },
        {
            id: 2,
            name: "Transfer",
        },
    ];

    const approval = [
        {
            id: 0,
            name: "Approve",
        },
        {
            id: 1,
            name: "Reject",
        },
    ];

    const tabs = [
        {
            index: 1,
            name: "Cash Advance",
        },
        {
            index: 2,
            name: "Cash Advance Report",
        },
    ];

    const cost_classification = [
        {
            index: 1,
            name: "Fully Approve",
        },
        {
            index: 2,
            name: "Partialy Approve",
        },
        {
            index: 3,
            name: "Reject",
        },
        {
            index: 4,
            name: "Request Explanation",
        },
    ]
    // Data End

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
    const handleAddCAReportModal = async (e: FormEvent, id: number, used_by: number, first_approval_by: number) => {
        e.preventDefault();

        setDataCAReport(
            {...dataCAReport, 
                cash_advance_id: id, 
                cash_advance_used_by: used_by, 
                cash_advance_first_approval_by: first_approval_by
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

    const handleFileDownload = async (id: number) => {
        await axios({
            url: `/cashAdvanceDownload/${id}`,
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
    });

    let total_amount_report = 0;

    DataReportRow.forEach((item) => {
        total_amount_report += Number(item.cash_advance_detail_amount);
    });

    let revised_total_amount = 0;

    dataById.cash_advance_detail.forEach((item: any) => {
        revised_total_amount += Number(item.CASH_ADVANCE_DETAIL_AMOUNT);
    });

    let total_amount_approve = 0;

    dataReportById?.cash_advance_detail_report.forEach((item: any) => {
        total_amount_approve += Number(item.REPORT_CASH_ADVANCE_DETAIL_AMOUNT_APPROVE);
    });

    let count_approve = 0;

    dataById.cash_advance_detail.forEach((item: any) => {
        count_approve += Number(item.CASH_ADVANCE_DETAIL_STATUS);
    });

    const [toggleState, setToggleState] = useState(1);

    const toggleTab = (i: number) => {
        setToggleState(i);
    };

    const [checkedTransfer, setCheckedTransfer] = useState(false);
    const handleCheckedTransfer = (e:any) => {
        setData("cash_advance_delivery_method_transfer", e.target.value)
        setDataById({
            ...dataById,
            CASH_ADVANCE_DELIVERY_METHOD_TRANSFER: e.target.value,
        })
        setCheckedTransfer(!checkedTransfer);
    };

    const [checkedCash, setCheckedCash] = useState(false);
    const handleCheckedCash = (e:any) => {
        setData("cash_advance_delivery_method_cash", e.target.value)
        setDataById({
            ...dataById,
            CASH_ADVANCE_DELIVERY_METHOD_CASH: e.target.value,
        })
        setCheckedCash(!checkedCash);
    };

    const [checkedTransferEdit, setCheckedTransferEdit] = useState(true);
    const handleCheckedTransferEdit = (e:any) => {
        setDataById({
            ...dataById,
            CASH_ADVANCE_DELIVERY_METHOD_TRANSFER: e.target.value,
        })
        setCheckedTransferEdit(!checkedTransferEdit);
    };

    const [checkedCashEdit, setCheckedCashEdit] = useState(true);
    const handleCheckedCashEdit = (e:any) => {
        setDataById({
            ...dataById,
            CASH_ADVANCE_DELIVERY_METHOD_CASH: e.target.value,
        })
        setCheckedCashEdit(!checkedCashEdit);
    };

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

    function classNames(...classes:any) {
        return classes.filter(Boolean).join(' ')
    }

    // const [files, setFiles] = useState<any>();

    // const handleAddFiles = () => {

    // };
    // console.log("Data", data);
    // console.log("Data Files", DataFilesRow);
    // console.log(files);
    // console.log(DataReportRow);
    console.log("Cash Advance", cashAdvance.data);
    // console.log("Cash Advance Report", cashAdvanceReport.data);
    console.log("Data CA By Id", dataById);
    console.log("Data Report By Id", dataReportById);
    console.log("Data CA Report", dataCAReport);
    // console.log("Search CA", searchCA);

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
                                    add_files_report: false,
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
                                                    {/* <Input
                                                        name="cash_advance_detail_document_id"
                                                        type="file"
                                                        className="w-full"
                                                        // value={val.cash_advance_detail_document_id}
                                                        onChange={(e) =>
                                                            handleChangeAddFiles(e, i)
                                                        }
                                                    />  */}

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
                            {/* <div className="w-full p-2">
                                <InputLabel htmlFor="tipe" className="mb-2">
                                    Type<span className="text-red-600">*</span>
                                </InputLabel>
                                <select
                                    id="tipe"
                                    name="tipe"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    onChange={(e) =>
                                        setData("tipe", e.target.value)
                                    }
                                    required
                                >
                                    <option value="">-- Choose Type --</option>
                                    {types.map((type: any) => (
                                        <option key={type.id} value={type.id}>
                                            {type.type}
                                        </option>
                                    ))}
                                </select>
                            </div> */}
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
                                    value={auth.user.name}
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
                                <select
                                    id="namaPemohon"
                                    name="namaPemohon"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    onChange={(e) =>
                                        setData("cash_advance_used_by", e.target.value)
                                    }
                                    required
                                >
                                    <option value="">
                                        -- Choose Used By --
                                    </option>
                                    {users.map((user: any) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="cash_advance_division"
                                    value="Division"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="cash_advance_division"
                                    type="text"
                                    name="cash_advance_division"
                                    value="IT"
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="namaPemberiApproval"
                                    className="mb-2"
                                >
                                    Request for Approval
                                    <span className="text-red-600">*</span>
                                </InputLabel>
                                <select
                                    id="namaPemberiApproval"
                                    name="namaPemberiApproval"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    onChange={(e) =>
                                        setData(
                                            "cash_advance_first_approval_by",
                                            e.target.value
                                        )
                                    }
                                    required
                                >
                                    <option value="">
                                        -- Choose Request To --
                                    </option>
                                    {users.map((user: any) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name}
                                        </option>
                                    ))}
                                </select>
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
                                                <TextInput
                                                    id="cash_advance_detail_start_date"
                                                    type="date"
                                                    name="cash_advance_detail_start_date"
                                                    value={val.cash_advance_detail_start_date}
                                                    className="w-1/2"
                                                    autoComplete="cash_advance_detail_start_date"
                                                    onChange={(e) =>
                                                        handleChangeAdd(e, i)
                                                    }
                                                    required
                                                />
                                            </TD>
                                            <TD className="border">
                                                <TextInput
                                                    id="cash_advance_detail_end_date"
                                                    type="date"
                                                    name="cash_advance_detail_end_date"
                                                    value={val.cash_advance_detail_end_date}
                                                    className="w-1/2"
                                                    autoComplete="cash_advance_detail_end_date"
                                                    onChange={(e) =>
                                                        handleChangeAdd(e, i)
                                                    }
                                                    required
                                                />
                                            </TD>
                                            <TD className="border">
                                                {/* <TextInput
                                                    id="cash_advance_detail_purpose"
                                                    type="text"
                                                    name="cash_advance_detail_purpose"
                                                    value={val.cash_advance_detail_purpose}
                                                    className="w-1/2"
                                                    autoComplete="off"
                                                    onChange={(e) =>
                                                        handleChangeAdd(e, i)
                                                    }
                                                /> */}
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
                                                <select
                                                    id="cash_advance_detail_relation_organization_id"
                                                    name="cash_advance_detail_relation_organization_id"
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                    onChange={(e) =>
                                                        handleChangeAdd(e, i)
                                                    }
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
                                                <TextInput
                                                    id="cash_advance_detail_amount"
                                                    type="number"
                                                    name="cash_advance_detail_amount"
                                                    value={val.cash_advance_detail_amount}
                                                    className="w-1/2 text-right"
                                                    autoComplete="off"
                                                    onChange={(e) =>
                                                        handleChangeAdd(e, i)
                                                    }
                                                    placeholder="0"
                                                    required
                                                />
                                            </TD>
                                            <TD className="border px-2">
                                                <div className="">
                                                    <button type="button"
                                                        className="bg-black hover:bg-slate-800 text-sm text-white py-2 px-3"
                                                        onClick={() => {
                                                            setModalFiles({
                                                                add_files: true,
                                                                add_files_report: false,
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
                                                {/* <input
                                                    type="file"
                                                    id="cash_advance_detail_document_id"
                                                    name="cash_advance_detail_document_id"
                                                    className="bg-white leading-4"
                                                    multiple
                                                    onChange={(e) =>
                                                        handleUploadFile(e, i)
                                                    }
                                                /> */}
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

                        {/* <p className="mt-5">{JSON.stringify(DataRow)}</p> */}

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
                                            {checkedTransfer === true ? (
                                                <TextInput
                                                    id="cash_advance_transfer_amount"
                                                    type="number"
                                                    name="cash_advance_transfer_amount"
                                                    value={data.cash_advance_transfer_amount}
                                                    className="w-full lg:w-1/4 text-right"
                                                    placeholder="0"
                                                    onChange={(e) =>
                                                        setData("cash_advance_transfer_amount", e.target.value)
                                                    }
                                                    required
                                                />
                                            ) : (
                                                <TextInput
                                                    id="cash_advance_transfer_amount"
                                                    type="number"
                                                    name="cash_advance_transfer_amount"
                                                    value={""}
                                                    className="w-full lg:w-1/4 text-right"
                                                    placeholder="0"
                                                    // required
                                                    readOnly
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
                                            value={2}
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
                                                <TextInput
                                                    id="cash_advance_cash_amount"
                                                    type="number"
                                                    name="cash_advance_cash_amount"
                                                    value={data.cash_advance_cash_amount}
                                                    className="w-5/12 lg:w-1/4 text-right ml-9"
                                                    placeholder="0"
                                                    onChange={(e) =>
                                                        setData("cash_advance_cash_amount", e.target.value)
                                                    }
                                                    required
                                                />
                                            ) : (
                                                <TextInput
                                                    id="cash_advance_cash_amount"
                                                    type="number"
                                                    name="cash_advance_cash_amount"
                                                    value={""}
                                                    className="w-5/12 lg:w-1/4 text-right ml-9"
                                                    placeholder="0"
                                                    // onChange={(e) =>
                                                    //     handleChangeAdd(e, i)
                                                    // }
                                                    // required
                                                    readOnly
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
                                    className=""
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
                            {/* <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="tipe"
                                    value="Type"
                                    className="mb-2"
                                />
                                {dataById.CASH_ADVANCE_TYPE === 1 && (
                                    <TextInput
                                        id="tipe"
                                        type="text"
                                        name="tipe"
                                        value={"Cash Advance"}
                                        className=""
                                        autoComplete="tipe"
                                        onChange={(e) =>
                                            setDataById({
                                                ...dataById,
                                                DIVISION: e.target.value,
                                            })
                                        }
                                        readOnly
                                    />
                                )}
                                {dataById.CASH_ADVANCE_TYPE === 2 && (
                                    <TextInput
                                        id="tipe"
                                        type="text"
                                        name="tipe"
                                        value={"Reimburse"}
                                        className=""
                                        autoComplete="tipe"
                                        onChange={(e) =>
                                            setDataById({
                                                ...dataById,
                                                DIVISION: e.target.value,
                                            })
                                        }
                                        readOnly
                                    />
                                )}
                            </div> */}
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
                                    value={dataById.user_used_by.name}
                                    className=""
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
                                    value={dataById.user.name}
                                    className=""
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
                                    className=""
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
                                    value={dataById.CASH_ADVANCE_DIVISION}
                                    className=""
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
                                    value={dataById.user_approval.name}
                                    className=""
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
                                                {cad.CASH_ADVANCE_DETAIL_DOCUMENT_ID !== null ? (
                                                <TD className="border px-3 py-2">
                                                    <button
                                                        type="button"
                                                        title="Download File"
                                                        onClick={() =>
                                                            handleFileDownload(
                                                                cad.CASH_ADVANCE_DETAIL_ID
                                                            )
                                                        }
                                                    >
                                                        <ArrowDownTrayIcon className="w-6 m-auto" />
                                                    </button>
                                                </TD>
                                                ) : (
                                                    <TD className="border px-3 py-2">-</TD>
                                                )}
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

                        {/* <p className="mt-5">{JSON.stringify(DataRow)}</p> */}

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
                                            checked={dataById?.CASH_ADVANCE_DELIVERY_METHOD_TRANSFER !== null && true}
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
                                                placeholder="0"
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
                                            checked={dataById?.CASH_ADVANCE_DELIVERY_METHOD_CASH !== null && true}
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
                                                placeholder="0"
                                                readOnly
                                                required
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
                                onChange={(e) =>
                                    setData("cash_advance_request_note", e.target.value)
                                }
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
                                    className=""
                                    autoComplete="cashAdvanceNumber"
                                    readOnly
                                />
                            </div>
                            {/* <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="tipe"
                                    value="Type"
                                    className="mb-2"
                                />
                                {dataById.CASH_ADVANCE_TYPE === 1 && (
                                    <TextInput
                                        id="tipe"
                                        type="text"
                                        name="tipe"
                                        value={"Cash Advance"}
                                        className=""
                                        autoComplete="tipe"
                                        readOnly
                                    />
                                )}
                                {dataById.CASH_ADVANCE_TYPE === 2 && (
                                    <TextInput
                                        id="tipe"
                                        type="text"
                                        name="tipe"
                                        value={"Reimburse"}
                                        className=""
                                        autoComplete="tipe"
                                        readOnly
                                    />
                                )}
                            </div> */}
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
                                    value={dataById.user_used_by.name}
                                    className=""
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
                                    value={dataById.user.name}
                                    className=""
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
                                    className=""
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
                                    value={dataById.CASH_ADVANCE_DIVISION}
                                    className=""
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
                                    value={dataById.user_approval.name}
                                    className=""
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
                                        {/* <TH
                                            label="Approval"
                                            className="border px-3 py-2"
                                            rowSpan={2}
                                        /> */}
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
                                                {cad.CASH_ADVANCE_DETAIL_DOCUMENT_ID !== null ? (
                                                    <TD className="border px-3 py-2">
                                                        <button
                                                            type="button"
                                                            title="Download File"
                                                            onClick={() =>
                                                                handleFileDownload(
                                                                    cad.CASH_ADVANCE_DETAIL_ID
                                                                )
                                                            }
                                                        >
                                                            <ArrowDownTrayIcon className="w-6 m-auto" />
                                                        </button>
                                                    </TD>
                                                ) : (
                                                    <TD className="border px-3 py-2">-</TD>
                                                )}
                                                {/* <TD className="border">
                                                    <select
                                                        name="CASH_ADVANCE_DETAIL_STATUS"
                                                        id="CASH_ADVANCE_DETAIL_STATUS"
                                                        value={
                                                            cad.CASH_ADVANCE_DETAIL_STATUS
                                                        }
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                        onChange={(e) =>
                                                            handleChangeApprove(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                        required
                                                    >
                                                        <option value="">
                                                            Choose Approval
                                                        </option>
                                                        {approval.map(
                                                            (approve) => (
                                                                <option
                                                                    key={
                                                                        approve.id
                                                                    }
                                                                    value={
                                                                        approve.id
                                                                    }
                                                                >
                                                                    {
                                                                        approve.name
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </TD> */}
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
                                            defaultChecked={dataById?.CASH_ADVANCE_DELIVERY_METHOD_TRANSFER !== null && true}
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
                                                <TextInput
                                                    id="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                    type="number"
                                                    name="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                    value={dataById.CASH_ADVANCE_TRANSFER_AMOUNT}
                                                    className="w-full lg:w-1/4 text-right"
                                                    placeholder="0"
                                                    defaultChecked={true}
                                                    onChange={(e) =>
                                                        setDataById({
                                                            ...dataById,
                                                            CASH_ADVANCE_TRANSFER_AMOUNT: e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                            ) : (
                                                <TextInput
                                                    id="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                    type="number"
                                                    name="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                    value={dataById.CASH_ADVANCE_TRANSFER_AMOUNT}
                                                    className="w-full lg:w-1/4 text-right"
                                                    placeholder="0"
                                                    readOnly
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
                                            defaultChecked={dataById?.CASH_ADVANCE_DELIVERY_METHOD_CASH !== null && true}
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
                                                <TextInput
                                                    id="CASH_ADVANCE_CASH_AMOUNT"
                                                    type="number"
                                                    name="CASH_ADVANCE_CASH_AMOUNT"
                                                    value={dataById.CASH_ADVANCE_CASH_AMOUNT}
                                                    className="w-5/12 lg:w-1/4 text-right ml-9"
                                                    placeholder="0"
                                                    onChange={(e) =>
                                                        setDataById({
                                                            ...dataById,
                                                            CASH_ADVANCE_CASH_AMOUNT: e.target.value,
                                                        })
                                                    }
                                                    // required
                                                />
                                            ) : (
                                                <TextInput
                                                    id="CASH_ADVANCE_CASH_AMOUNT"
                                                    type="number"
                                                    name="CASH_ADVANCE_CASH_AMOUNT"
                                                    value={dataById.CASH_ADVANCE_CASH_AMOUNT}
                                                    className="w-5/12 lg:w-1/4 text-right ml-9"
                                                    placeholder="0"
                                                    // onChange={(e) =>
                                                    //     handleChangeAdd(e, i)
                                                    // }
                                                    required
                                                    readOnly
                                                />
                                            )}
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
                                                placeholder="0"
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
                                                placeholder="0"
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
                                            value={dataById.user_used_by.name}
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
                method="patch"
                onSuccess={handleSuccess}
                headers={null}
                submitButtonName={"Save"}
                // panelWidth={"70%"}
                body={
                    <>
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
                                    className=""
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
                            {/* <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="tipe"
                                    value="Type"
                                    className="mb-2"
                                />
                                {dataById.CASH_ADVANCE_TYPE === 1 && (
                                    <TextInput
                                        id="tipe"
                                        type="text"
                                        name="tipe"
                                        value={"Cash Advance"}
                                        className=""
                                        autoComplete="tipe"
                                        onChange={(e) =>
                                            setDataById({
                                                ...dataById,
                                                DIVISION: e.target.value,
                                            })
                                        }
                                        readOnly
                                    />
                                )}
                                {dataById.CASH_ADVANCE_TYPE === 2 && (
                                    <TextInput
                                        id="tipe"
                                        type="text"
                                        name="tipe"
                                        value={"Reimburse"}
                                        className=""
                                        autoComplete="tipe"
                                        onChange={(e) =>
                                            setDataById({
                                                ...dataById,
                                                DIVISION: e.target.value,
                                            })
                                        }
                                        readOnly
                                    />
                                )}
                            </div> */}
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
                                    value={dataById.user_used_by.name}
                                    className=""
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
                                    value={dataById.user.name}
                                    className=""
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
                                    className=""
                                    autoComplete="tanggalPengajuan"
                                    // onChange={(e) =>
                                    //     setData(
                                    //         "tanggal_pengajuan",
                                    //         e.target.value
                                    //     )
                                    // }
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
                                    value={dataById.CASH_ADVANCE_DIVISION}
                                    className=""
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
                                    value={dataById.user_approval.name}
                                    className=""
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
                                                    <TextInput
                                                        id="CASH_ADVANCE_DETAIL_START_DATE"
                                                        type="date"
                                                        name="CASH_ADVANCE_DETAIL_START_DATE"
                                                        value={
                                                            cad.CASH_ADVANCE_DETAIL_START_DATE
                                                        }
                                                        className="w-1/2"
                                                        autoComplete="CASH_ADVANCE_DETAIL_START_DATE"
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
                                                        id="CASH_ADVANCE_DETAIL_END_DATE"
                                                        type="date"
                                                        name="CASH_ADVANCE_DETAIL_END_DATE"
                                                        value={
                                                            cad.CASH_ADVANCE_DETAIL_END_DATE
                                                        }
                                                        className="w-1/2"
                                                        autoComplete="CASH_ADVANCE_DETAIL_END_DATE"
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
                                                    {/* <TextInput
                                                        id="CASH_ADVANCE_DETAIL_PURPOSE"
                                                        type="text"
                                                        name="CASH_ADVANCE_DETAIL_PURPOSE"
                                                        value={cad.CASH_ADVANCE_DETAIL_PURPOSE}
                                                        className="w-1/2"
                                                        autoComplete="off"
                                                        onChange={(e) =>
                                                            handleChangeRevised(e, i)
                                                        }
                                                    /> */}
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
                                                        autoComplete="CASH_ADVANCE_DETAIL_RELATION_NAME"
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
                                                        autoComplete="CASH_ADVANCE_DETAIL_RELATION_POSITION"
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
                                                        autoComplete="CASH_ADVANCE_DETAIL_LOCATION"
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
                                                        id="CASH_ADVANCE_DETAIL_AMOUNT"
                                                        type="number"
                                                        name="CASH_ADVANCE_DETAIL_AMOUNT"
                                                        value={
                                                            cad.CASH_ADVANCE_DETAIL_AMOUNT
                                                        }
                                                        className="w-1/2 text-right"
                                                        autoComplete="CASH_ADVANCE_DETAIL_AMOUNT"
                                                        onChange={(e) =>
                                                            handleChangeRevised(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                        placeholder="0"
                                                        required
                                                    />
                                                </TD>
                                                <TD className="border">
                                                    <input
                                                        type="file"
                                                        id="cash_advance_detail_document_id"
                                                        name="cash_advance_detail_document_id"
                                                        className="bg-white leading-4"
                                                        onChange={(e) =>
                                                            handleUploadFileRevised(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                    />
                                                </TD>
                                                {/* <TD className="border px-3">
                                                    {cad.CASH_ADVANCE_DETAIL_STATUS ===
                                                        0 && (
                                                        <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                                            Approve
                                                        </span>
                                                    )}
                                                    {cad.CASH_ADVANCE_DETAIL_STATUS ===
                                                        1 && (
                                                        <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                                                            Reject
                                                        </span>
                                                    )}
                                                </TD> */}
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
                                        <TD
                                            className="border text-right pr-5 py-2"
                                            colSpan={8}
                                        >
                                            TOTAL AMOUNT
                                        </TD>
                                        <TD className="border py-2">
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
                                            defaultChecked={dataById?.CASH_ADVANCE_DELIVERY_METHOD_TRANSFER !== null && true}
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
                                                <TextInput
                                                    id="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                    type="number"
                                                    name="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                    value={dataById.CASH_ADVANCE_TRANSFER_AMOUNT}
                                                    className="w-full lg:w-1/4 text-right"
                                                    placeholder="0"
                                                    defaultChecked={true}
                                                    onChange={(e) =>
                                                        setDataById({
                                                            ...dataById,
                                                            CASH_ADVANCE_TRANSFER_AMOUNT: e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                            ) : (
                                                <TextInput
                                                    id="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                    type="number"
                                                    name="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                    value={dataById.CASH_ADVANCE_TRANSFER_AMOUNT}
                                                    className="w-full lg:w-1/4 text-right"
                                                    placeholder="0"
                                                    // required
                                                    readOnly
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
                                            defaultChecked={dataById?.CASH_ADVANCE_DELIVERY_METHOD_CASH !== null && true}
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
                                                <TextInput
                                                    id="CASH_ADVANCE_CASH_AMOUNT"
                                                    type="number"
                                                    name="CASH_ADVANCE_CASH_AMOUNT"
                                                    value={dataById.CASH_ADVANCE_CASH_AMOUNT}
                                                    className="w-5/12 lg:w-1/4 text-right ml-9"
                                                    placeholder="0"
                                                    onChange={(e) =>
                                                        setDataById({
                                                            ...dataById,
                                                            CASH_ADVANCE_CASH_AMOUNT: e.target.value,
                                                        })
                                                    }
                                                    // required
                                                />
                                            ) : (
                                                <TextInput
                                                    id="CASH_ADVANCE_CASH_AMOUNT"
                                                    type="number"
                                                    name="CASH_ADVANCE_CASH_AMOUNT"
                                                    value={dataById.CASH_ADVANCE_CASH_AMOUNT}
                                                    className="w-5/12 lg:w-1/4 text-right ml-9"
                                                    placeholder="0"
                                                    // onChange={(e) =>
                                                    //     handleChangeAdd(e, i)
                                                    // }
                                                    // required
                                                    readOnly
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
                                    className=""
                                    autoComplete="cashAdvanceNumber"
                                    readOnly
                                />
                            </div>
                            {/* <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="tipe"
                                    value="Type"
                                    className="mb-2"
                                />
                                {dataReportById?.CASH_ADVANCE_TYPE === 1 && (
                                    <TextInput
                                        id="tipe"
                                        type="text"
                                        name="tipe"
                                        value={"Cash Advance"}
                                        className=""
                                        autoComplete="tipe"
                                        readOnly
                                    />
                                )}
                                {dataReportById?.CASH_ADVANCE_TYPE === 2 && (
                                    <TextInput
                                        id="tipe"
                                        type="text"
                                        name="tipe"
                                        value={"Reimburse"}
                                        className=""
                                        autoComplete="tipe"
                                        readOnly
                                    />
                                )}
                            </div> */}
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
                                    value={dataById.user_used_by.name}
                                    className=""
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
                                    value={dataById.user.name}
                                    className=""
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
                                    className=""
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
                                    value={dataById.CASH_ADVANCE_DIVISION}
                                    className=""
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
                                    value={dataById.user_approval.name}
                                    className=""
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
                                                {cad.CASH_ADVANCE_DETAIL_DOCUMENT_ID !== null ? (
                                                    <TD className="border px-3 py-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleFileDownload(
                                                                    cad.CASH_ADVANCE_DETAIL_ID
                                                                )
                                                            }
                                                        >
                                                            <ArrowDownTrayIcon className="w-6 m-auto" />
                                                        </button>
                                                    </TD>
                                                ) : (
                                                    <TD className="border px-3 py-2">-</TD>
                                                )}
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
                                            defaultChecked={dataById.CASH_ADVANCE_DELIVERY_METHOD_TRANSFER !== null && true}
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
                                                placeholder="0"
                                                onChange={(e) =>
                                                    setDataById({
                                                        ...dataById,
                                                        CASH_ADVANCE_TRANSFER_AMOUNT: e.target.value,
                                                    })
                                                }
                                                required
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
                                                // required
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
                                            <TextInput
                                                id="CASH_ADVANCE_TRANSFER_DATE"
                                                type="date"
                                                name="CASH_ADVANCE_TRANSFER_DATE"
                                                value={dataById.CASH_ADVANCE_TRANSFER_DATE}
                                                className="w-full lg:w-7/12"
                                                onChange={(e) =>
                                                    setDataById({
                                                        ...dataById,
                                                        CASH_ADVANCE_TRANSFER_DATE: e.target.value,
                                                    })
                                                }
                                                required
                                            />
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
                                            required
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
                                            defaultChecked={dataById.CASH_ADVANCE_DELIVERY_METHOD_CASH !== null  && true}
                                            // required
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
                                                className="w-full lg:w-6/12 text-right ml-9"
                                                placeholder="0"
                                                onChange={(e) =>
                                                    setDataById({
                                                        ...dataById,
                                                        CASH_ADVANCE_CASH_AMOUNT: e.target.value,
                                                    })
                                                }
                                                // required
                                            />
                                        </div>
                                    </div>
                                    {checkedCashEdit === false || dataById.CASH_ADVANCE_CASH_AMOUNT > 0 &&(
                                    <div className="ml-7">
                                        <div className="mb-5">
                                            <InputLabel
                                                htmlFor="CASH_ADVANCE_RECEIVE_DATE"
                                                className="mb-2"
                                            >
                                                Receive Date
                                                {/* <span className="text-red-600">*</span> */}
                                            </InputLabel>
                                            <TextInput
                                                id="CASH_ADVANCE_RECEIVE_DATE"
                                                type="date"
                                                name="CASH_ADVANCE_RECEIVE_DATE"
                                                value={dataById.CASH_ADVANCE_RECEIVE_DATE}
                                                className="w-full lg:w-7/12"
                                                placeholder="Bank Account Name - Bank Account - Account Number"
                                                onChange={(e) =>
                                                    setDataById({
                                                        ...dataById,
                                                        CASH_ADVANCE_RECEIVE_DATE: e.target.value,
                                                    })
                                                }
                                                // required
                                            />
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
                                                // required
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
                                            value={dataById.user_used_by.name}
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
                title={"Cash Advance Report"}
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
                                    className=""
                                    readOnly
                                />
                                {/* <select
                                    id="cashAdvanceNumber"
                                    name="cashAdvanceNumber"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    onChange={(e) =>
                                        setDataCAReport({
                                            ...dataCAReport, cash_advance_id: e.target.value
                                        })
                                    }
                                    required
                                >
                                    <option value="">-- Choose CA --</option>
                                    {CANumber.map((ca: any) => (
                                        <option
                                            key={ca.CASH_ADVANCE_ID}
                                            value={ca.CASH_ADVANCE_ID}
                                        >
                                            {ca.CASH_ADVANCE_NUMBER}
                                        </option>
                                    ))}
                                </select> */}
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
                                    value={dataById.user_used_by.name}
                                    className=""
                                    readOnly
                                />
                                {/* <select
                                    id="namaPemohon"
                                    name="namaPemohon"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    onChange={(e) =>
                                        setDataCAReport({
                                            ...dataCAReport, cash_advance_used_by: e.target.value
                                        })
                                    }
                                    required
                                >
                                    <option value="">
                                        -- Choose Used By --
                                    </option>
                                    {users.map((user: any) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name}
                                        </option>
                                    ))}
                                </select> */}
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
                                    value={auth.user.name}
                                    className=""
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
                                    className=""
                                    autoComplete="tanggalPengajuan"
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
                                    value={dataById.user_approval.name}
                                    className=""
                                    readOnly
                                />
                                {/* <select
                                    id="namaPemberiApproval"
                                    name="namaPemberiApproval"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    onChange={(e) =>
                                        setDataCAReport({
                                            ...dataCAReport, cash_advance_first_approval_by: e.target.value
                                        })
                                    }
                                    required
                                >
                                    <option value="">
                                        -- Choose Request To --
                                    </option>
                                    {users.map((user: any) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name}
                                        </option>
                                    ))}
                                </select> */}
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
                                    value="IT"
                                    className=""
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
                                                <TextInput
                                                    id="cash_advance_detail_start_date"
                                                    type="date"
                                                    name="cash_advance_detail_start_date"
                                                    value={val.cash_advance_detail_start_date}
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
                                                    id="cash_advance_detail_end_date"
                                                    type="date"
                                                    name="cash_advance_detail_end_date"
                                                    value={val.cash_advance_detail_end_date}
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
                                                {/* <select
                                                    id="cash_advance_detail_purpose"
                                                    name="cash_advance_detail_purpose"
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                    required
                                                    onChange={(e) =>
                                                        handleChangeAddReport(
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
                                                </select> */}
                                            </TD>
                                            <TD className="border">
                                                <select
                                                    id="cash_advance_detail_relation_organization_id"
                                                    name="cash_advance_detail_relation_organization_id"
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                    onChange={(e) =>
                                                        handleChangeAddReport(
                                                            e,
                                                            i
                                                        )
                                                    }
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
                                                <TextInput
                                                    id="cash_advance_detail_amount"
                                                    type="number"
                                                    name="cash_advance_detail_amount"
                                                    value={val.cash_advance_detail_amount}
                                                    className="w-1/2 text-right"
                                                    autoComplete="off"
                                                    placeholder="0"
                                                    onChange={(e) =>
                                                        handleChangeAddReport(
                                                            e,
                                                            i
                                                        )
                                                    }
                                                />
                                            </TD>
                                            <TD className="border">
                                                <div className="">
                                                    <button type="button"
                                                        className="bg-black hover:bg-slate-800 text-sm text-white py-2 px-3"
                                                        onClick={() => {
                                                            setModalFiles({
                                                                add_files: false,
                                                                add_files_report: true,
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
                                    <tr className="text-center">
                                        <TD></TD>
                                        <TD>
                                            <Button
                                                className="mt-5 px-2 py-1 text-black bg-none shadow-none hover:underline text-sm"
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
                                </tfoot>
                            </table>
                        </div>
                        {/* Table form end */}

                        {/* <p className="mt-5">{JSON.stringify(DataRow)}</p> */}

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
                                                onChange={(e) => handleCheckedTransferReport(e)}
                                                required
                                            />
                                        </div>
                                        <div className="flex w-full gap-4">
                                            <div className="ml-3 text-sm leading-9">
                                                <label htmlFor="transfer" className="font-medium text-gray-900">
                                                Transfer
                                                </label>
                                            </div>
                                            {checkedTransferReport === true ? (
                                                <TextInput
                                                    id="cash_advance_transfer_amount"
                                                    type="number"
                                                    name="cash_advance_transfer_amount"
                                                    value={dataCAReport.cash_advance_transfer_amount}
                                                    className="w-full lg:w-1/4 text-right"
                                                    placeholder="0"
                                                    onChange={(e) =>
                                                        setDataCAReport({...dataCAReport, cash_advance_transfer_amount: e.target.value})
                                                    }
                                                    required
                                                />
                                            ) : (
                                                <TextInput
                                                    id="cash_advance_transfer_amount"
                                                    type="number"
                                                    name="cash_advance_transfer_amount"
                                                    value={""}
                                                    className="w-full lg:w-1/4 text-right"
                                                    placeholder="0"
                                                    // required
                                                    readOnly
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
                                            value={2}
                                            onChange={(e) => handleCheckedCashReport(e)}
                                            />
                                        </div>
                                        <div className="flex w-full">
                                            <div className="ml-3 text-sm leading-9">
                                                <label htmlFor="cash" className="font-medium text-gray-900">
                                                Cash
                                                </label>
                                            </div>
                                            {checkedCashReport === true ? (
                                                <TextInput
                                                    id="cash_advance_cash_amount"
                                                    type="number"
                                                    name="cash_advance_cash_amount"
                                                    value={dataCAReport.cash_advance_cash_amount}
                                                    className="w-5/12 lg:w-1/4 text-right ml-9"
                                                    placeholder="0"
                                                    onChange={(e) =>
                                                        setDataCAReport({...dataCAReport, cash_advance_cash_amount: e.target.value})
                                                    }
                                                    // required
                                                />
                                            ) : (
                                                <TextInput
                                                    id="cash_advance_cash_amount"
                                                    type="number"
                                                    name="cash_advance_cash_amount"
                                                    value={""}
                                                    className="w-5/12 lg:w-1/4 text-right ml-9"
                                                    placeholder="0"
                                                    // onChange={(e) =>
                                                    //     handleChangeAdd(e, i)
                                                    // }
                                                    // required
                                                    readOnly
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
                                    add_files_report: false,
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
                                    value={dataReportById?.REPORT_CASH_ADVANCE_NUMBER}
                                    className=""
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
                                    value={dataReportById?.user_used_by.name}
                                    className=""
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
                                    value={dataReportById?.user.name}
                                    className=""
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
                                        dataReportById?.REPORT_CASH_ADVANCE_REQUESTED_DATE,
                                        "dd-mm-yyyy"
                                    )}
                                    className=""
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
                                    value={dataReportById?.REPORT_CASH_ADVANCE_DIVISION}
                                    className=""
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
                                    value={dataReportById?.user_approval.name}
                                    className=""
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
                                                {cad.REPORT_CASH_ADVANCE_DETAIL_DOCUMENT_ID !== null ? (
                                                <TD className="border px-3 py-2">
                                                    <button
                                                        type="button"
                                                        title="Download File"
                                                        onClick={() =>
                                                            handleFileDownload(
                                                                cad.REPORT_CASH_ADVANCE_DETAIL_ID
                                                            )
                                                        }
                                                    >
                                                        <ArrowDownTrayIcon className="w-6 m-auto" />
                                                    </button>
                                                </TD>
                                                ) : (
                                                    <TD className="border px-3 py-2">-</TD>
                                                )}
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
                                </tfoot>
                            </table>
                        </div>
                        {/* Table form end */}

                        {/* <p className="mt-5">{JSON.stringify(DataRow)}</p> */}

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
                                            checked={dataReportById?.REPORT_CASH_ADVANCE_DELIVERY_METHOD_TRANSFER !== null && true}
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
                                                placeholder="0"
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
                                            checked={dataReportById?.REPORT_CASH_ADVANCE_DELIVERY_METHOD_CASH !== null && true}
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
                                                placeholder="0"
                                                readOnly
                                                required
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
                                    value={dataReportById?.cash_advance.CASH_ADVANCE_NUMBER}
                                    className=""
                                    autoComplete="cashAdvanceNumber"
                                    readOnly
                                />
                            </div>
                            {/* <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="tipe"
                                    value="Type"
                                    className="mb-2"
                                />
                                {dataReportById.CASH_ADVANCE_TYPE === 1 && (
                                    <TextInput
                                        id="tipe"
                                        type="text"
                                        name="tipe"
                                        value={"Cash Advance"}
                                        className=""
                                        autoComplete="tipe"
                                        readOnly
                                    />
                                )}
                                {dataReportById.CASH_ADVANCE_TYPE === 2 && (
                                    <TextInput
                                        id="tipe"
                                        type="text"
                                        name="tipe"
                                        value={"Reimburse"}
                                        className=""
                                        autoComplete="tipe"
                                        readOnly
                                    />
                                )}
                            </div> */}
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
                                    value={dataReportById?.user_used_by.name}
                                    className=""
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
                                    value={dataReportById?.user.name}
                                    className=""
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
                                        dataReportById?.REPORT_CASH_ADVANCE_REQUESTED_DATE,
                                        "dd-mm-yyyy"
                                    )}
                                    className=""
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
                                    value={dataReportById?.REPORT_CASH_ADVANCE_DIVISION}
                                    className=""
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
                                    value={dataReportById?.user_approval.name}
                                    className=""
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
                                                {cad.REPORT_CASH_ADVANCE_DETAIL_DOCUMENT_ID !== null ? (
                                                    <TD className="border px-3 py-2">
                                                        <button
                                                            type="button"
                                                            title="Download File"
                                                            onClick={() =>
                                                                handleFileDownload(
                                                                    cad.REPORT_CASH_ADVANCE_DETAIL_ID
                                                                )
                                                            }
                                                        >
                                                            <ArrowDownTrayIcon className="w-6 m-auto" />
                                                        </button>
                                                    </TD>
                                                ) : (
                                                    <TD className="border px-3 py-2">
                                                        -
                                                    </TD>
                                                )}
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
                                                    <select
                                                        name="REPORT_CASH_ADVANCE_DETAIL_COST_CLASSIFICATION"
                                                        id="REPORT_CASH_ADVANCE_DETAIL_COST_CLASSIFICATION"
                                                        value={
                                                            cad.REPORT_CASH_ADVANCE_DETAIL_COST_CLASSIFICATION
                                                        }
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                        onChange={(e) =>
                                                            handleChangeApproveReport(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                        required
                                                    >
                                                        <option value="">
                                                            Choose Cost Classification
                                                        </option>
                                                        {coa.map(
                                                            (coa_item: any) => (
                                                                <option
                                                                    key={
                                                                        coa_item.COA_ID
                                                                    }
                                                                    value={
                                                                        coa_item.COA_ID
                                                                    }
                                                                >
                                                                    {
                                                                        coa_item.COA_CODE + '-' + coa_item.COA_TITLE
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </TD>
                                                <TD className="border">
                                                    <TextInput
                                                        id="REPORT_CASH_ADVANCE_DETAIL_AMOUNT_APPROVE"
                                                        type="number"
                                                        name="REPORT_CASH_ADVANCE_DETAIL_AMOUNT_APPROVE"
                                                        value={cad.REPORT_CASH_ADVANCE_DETAIL_AMOUNT_APPROVE}
                                                        className="w-1/2 text-right"
                                                        autoComplete="off"
                                                        placeholder="0"
                                                        onChange={(e) =>
                                                            handleChangeApproveReport(
                                                                e,
                                                                i
                                                            )
                                                        }
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
                                            {/* <TD className="border">
                                                <TextInput
                                                    id="REPORT_CASH_ADVANCE_DETAIL_NOTE"
                                                    type="text"
                                                    name="REPORT_CASH_ADVANCE_DETAIL_NOTE"
                                                    value={
                                                        cad.REPORT_CASH_ADVANCE_DETAIL_NOTE
                                                    }
                                                    className="w-1/2"
                                                    autoComplete="REPORT_CASH_ADVANCE_DETAIL_NOTE"
                                                    onChange={(e) =>
                                                        handleChangeApproveReport(
                                                            e,
                                                            i
                                                        )
                                                    }
                                                />
                                            </TD> */}
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
                                                dataReportById?.REPORT_CASH_ADVANCE_TOTAL_AMOUNT
                                            )}
                                        </TD>
                                    </tr>
                                    <tr className="text-center text-black text-sm leading-7">
                                        <TD
                                            className="border text-right pr-5 py-2"
                                            colSpan={8}
                                        >
                                            TOTAL REQUEST AMOUNT
                                        </TD>
                                        <TD className="border text-center py-2">
                                            {formatCurrency.format(
                                                dataReportById?.cash_advance.CASH_ADVANCE_TOTAL_AMOUNT
                                            )}
                                        </TD>
                                    </tr>
                                    <tr className="text-center text-black text-sm leading-7">
                                        <TD
                                            className="border text-right pr-5 py-2"
                                            colSpan={8}
                                        >
                                            TOTAL DIFFERENT
                                        </TD>
                                        <TD className="border text-center py-2">
                                            {formatCurrency.format(
                                                dataReportById?.cash_advance.CASH_ADVANCE_TOTAL_AMOUNT - dataReportById?.REPORT_CASH_ADVANCE_TOTAL_AMOUNT
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
                                            defaultChecked={dataReportById?.REPORT_CASH_ADVANCE_DELIVERY_METHOD_TRANSFER !== null && true}
                                            onChange={(e) => handleCheckedTransferEditReport(e)}
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
                                                <TextInput
                                                    id="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                    type="number"
                                                    name="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                    value={dataReportById?.REPORT_CASH_ADVANCE_TRANSFER_AMOUNT}
                                                    className="w-full lg:w-1/4 text-right"
                                                    placeholder="0"
                                                    defaultChecked={true}
                                                    onChange={(e) =>
                                                        setDataReportById({
                                                            ...dataReportById,
                                                            REPORT_CASH_ADVANCE_TRANSFER_AMOUNT: e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                            ) : (
                                                <TextInput
                                                    id="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                    type="number"
                                                    name="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                    value={dataReportById?.REPORT_CASH_ADVANCE_TRANSFER_AMOUNT}
                                                    className="w-full lg:w-1/4 text-right"
                                                    placeholder="0"
                                                    readOnly
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
                                            defaultChecked={dataReportById?.REPORT_CASH_ADVANCE_DELIVERY_METHOD_CASH !== null && true}
                                            onChange={(e) => handleCheckedCashEditReport(e)}
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
                                                <TextInput
                                                    id="CASH_ADVANCE_CASH_AMOUNT"
                                                    type="number"
                                                    name="CASH_ADVANCE_CASH_AMOUNT"
                                                    value={dataReportById?.REPORT_CASH_ADVANCE_CASH_AMOUNT}
                                                    className="w-5/12 lg:w-1/4 text-right ml-9"
                                                    placeholder="0"
                                                    onChange={(e) =>
                                                        setDataReportById({
                                                            ...dataReportById,
                                                            REPORT_CASH_ADVANCE_CASH_AMOUNT: e.target.value,
                                                        })
                                                    }
                                                    // required
                                                />
                                            ) : (
                                                <TextInput
                                                    id="CASH_ADVANCE_CASH_AMOUNT"
                                                    type="number"
                                                    name="CASH_ADVANCE_CASH_AMOUNT"
                                                    value={dataReportById?.REPORT_CASH_ADVANCE_CASH_AMOUNT}
                                                    className="w-5/12 lg:w-1/4 text-right ml-9"
                                                    placeholder="0"
                                                    // onChange={(e) =>
                                                    //     handleChangeAdd(e, i)
                                                    // }
                                                    required
                                                    readOnly
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
                                value={dataReportById?.REPORT_CASH_ADVANCE_REQUEST_NOTE}
                                readOnly
                            />
                        </div>

                        {/* <div className="w-1/2 p-2 mt-5">
                            <InputLabel
                                htmlFor="DELIVERY_METHOD"
                                value="Delivery Method"
                                className="mb-2"
                            />
                            {dataById.DELIVERY_METHOD === 1 &&(
                                <TextInput
                                    id="DELIVERY_METHOD"
                                    type="text"
                                    name="DELIVERY_METHOD"
                                    value="Cash"
                                    readOnly
                                />
                            )}
                            {dataById.DELIVERY_METHOD === 2 &&(
                                <TextInput
                                    id="DELIVERY_METHOD"
                                    type="text"
                                    name="DELIVERY_METHOD"
                                    value="Transfer"
                                    readOnly
                                />
                            )}
                        </div> */}

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
                                            value={dataById.user_used_by.name}
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
                                    value={dataReportById?.cash_advance.CASH_ADVANCE_NUMBER}
                                    className=""
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
                                    value={dataReportById?.user_used_by.name}
                                    className=""
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
                                    value={dataReportById?.user.name}
                                    className=""
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
                                        dataReportById?.REPORT_CASH_ADVANCE_REQUESTED_DATE,
                                        "dd-mm-yyyy"
                                    )}
                                    className=""
                                    autoComplete="tanggalPengajuan"
                                    // onChange={(e) =>
                                    //     setData(
                                    //         "tanggal_pengajuan",
                                    //         e.target.value
                                    //     )
                                    // }
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
                                    value={dataReportById?.REPORT_CASH_ADVANCE_DIVISION}
                                    className=""
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
                                    value={dataReportById?.user_approval.name}
                                    className=""
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
                                        {/* <TH
                                            label="Status"
                                            className="border px-3 py-2"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Note"
                                            className="border px-3 py-2"
                                            rowSpan={2}
                                        /> */}
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
                                                    <TextInput
                                                        id="REPORT_CASH_ADVANCE_DETAIL_START_DATE"
                                                        type="date"
                                                        name="REPORT_CASH_ADVANCE_DETAIL_START_DATE"
                                                        value={
                                                            cad.REPORT_CASH_ADVANCE_DETAIL_START_DATE
                                                        }
                                                        className="w-1/2"
                                                        autoComplete="REPORT_CASH_ADVANCE_DETAIL_START_DATE"
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
                                                        id="REPORT_CASH_ADVANCE_DETAIL_END_DATE"
                                                        type="date"
                                                        name="REPORT_CASH_ADVANCE_DETAIL_END_DATE"
                                                        value={
                                                            cad.REPORT_CASH_ADVANCE_DETAIL_END_DATE
                                                        }
                                                        className="w-1/2"
                                                        autoComplete="REPORT_CASH_ADVANCE_DETAIL_END_DATE"
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
                                                    {/* <select
                                                        id="REPORT_CASH_ADVANCE_DETAIL_PURPOSE"
                                                        name="REPORT_CASH_ADVANCE_DETAIL_PURPOSE"
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                        value={cad.REPORT_CASH_ADVANCE_DETAIL_PURPOSE}
                                                        required
                                                        onChange={(e) =>
                                                            handleChangeRevisedReport(
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
                                                    </select> */}
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
                                                        autoComplete="REPORT_CASH_ADVANCE_DETAIL_RELATION_NAME"
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
                                                        autoComplete="REPORT_CASH_ADVANCE_DETAIL_RELATION_POSITION"
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
                                                        autoComplete="REPORT_CASH_ADVANCE_DETAIL_LOCATION"
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
                                                        id="REPORT_CASH_ADVANCE_DETAIL_AMOUNT"
                                                        type="number"
                                                        name="REPORT_CASH_ADVANCE_DETAIL_AMOUNT"
                                                        value={
                                                            cad.REPORT_CASH_ADVANCE_DETAIL_AMOUNT
                                                        }
                                                        className="w-1/2 text-right"
                                                        autoComplete="REPORT_CASH_ADVANCE_DETAIL_AMOUNT"
                                                        onChange={(e) =>
                                                            handleChangeRevisedReport(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                        placeholder="0"
                                                        required
                                                    />
                                                </TD>
                                                <TD className="border whitespace-nowrap">
                                                    <input
                                                        type="file"
                                                        id="cash_advance_detail_document_id"
                                                        name="cash_advance_detail_document_id"
                                                        className="bg-white leading-4"
                                                        onChange={(e) =>
                                                            handleUploadFileRevised(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                    />
                                                </TD>
                                                {/* <TD className="border px-3">
                                                    {cad.REPORT_CASH_ADVANCE_DETAIL_STATUS ===
                                                        0 && (
                                                        <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                                            Approve
                                                        </span>
                                                    )}
                                                    {cad.REPORT_CASH_ADVANCE_DETAIL_STATUS ===
                                                        1 && (
                                                        <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                                                            Reject
                                                        </span>
                                                    )}
                                                </TD>
                                                <TD className="border text-left px-3">
                                                    {cad.REPORT_CASH_ADVANCE_DETAIL_NOTE}
                                                </TD> */}
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
                                            defaultChecked={dataReportById?.REPORT_CASH_ADVANCE_DELIVERY_METHOD_TRANSFER !== null && true}
                                            onChange={(e) => handleCheckedTransferEditReport(e)}
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
                                                <TextInput
                                                    id="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                    type="number"
                                                    name="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                    value={dataReportById?.REPORT_CASH_ADVANCE_TRANSFER_AMOUNT}
                                                    className="w-full lg:w-1/4 text-right"
                                                    placeholder="0"
                                                    defaultChecked={true}
                                                    onChange={(e) =>
                                                        setDataReportById({
                                                            ...dataReportById,
                                                            REPORT_CASH_ADVANCE_TRANSFER_AMOUNT: e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                            ) : (
                                                <TextInput
                                                    id="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                    type="number"
                                                    name="CASH_ADVANCE_TRANSFER_AMOUNT"
                                                    value={dataReportById?.REPORT_CASH_ADVANCE_TRANSFER_AMOUNT}
                                                    className="w-full lg:w-1/4 text-right"
                                                    placeholder="0"
                                                    readOnly
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
                                            defaultChecked={dataReportById?.REPORT_CASH_ADVANCE_DELIVERY_METHOD_CASH !== null && true}
                                            onChange={(e) => handleCheckedCashEditReport(e)}
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
                                                <TextInput
                                                    id="CASH_ADVANCE_CASH_AMOUNT"
                                                    type="number"
                                                    name="CASH_ADVANCE_CASH_AMOUNT"
                                                    value={dataReportById?.REPORT_CASH_ADVANCE_CASH_AMOUNT}
                                                    className="w-5/12 lg:w-1/4 text-right ml-9"
                                                    placeholder="0"
                                                    onChange={(e) =>
                                                        setDataReportById({
                                                            ...dataReportById,
                                                            REPORT_CASH_ADVANCE_CASH_AMOUNT: e.target.value,
                                                        })
                                                    }
                                                    // required
                                                />
                                            ) : (
                                                <TextInput
                                                    id="CASH_ADVANCE_CASH_AMOUNT"
                                                    type="number"
                                                    name="CASH_ADVANCE_CASH_AMOUNT"
                                                    value={dataReportById?.REPORT_CASH_ADVANCE_CASH_AMOUNT}
                                                    className="w-5/12 lg:w-1/4 text-right ml-9"
                                                    placeholder="0"
                                                    // onChange={(e) =>
                                                    //     handleChangeAdd(e, i)
                                                    // }
                                                    required
                                                    readOnly
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
                                value={dataReportById?.REPORT_CASH_ADVANCE_REQUEST_NOTE}
                                onChange={(e) => setDataReportById({
                                    ...dataReportById,
                                    REPORT_CASH_ADVANCE_REQUEST_NOTE: e.target.value,
                                })}
                                // readOnly
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
                title="Cash Advance Execute Report"
                url={`/cashAdvanceExecuteReport/${dataById.CASH_ADVANCE_ID}`}
                data={dataReportById}
                method="patch"
                onSuccess={handleSuccess}
                headers={null}
                submitButtonName={""}
                // panelWidth={"70%"}
                body={
                    <>
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
                                    value={dataReportById?.cash_advance.CASH_ADVANCE_NUMBER}
                                    className=""
                                    autoComplete="cashAdvanceNumber"
                                    readOnly
                                />
                            </div>
                            {/* <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="tipe"
                                    value="Type"
                                    className="mb-2"
                                />
                                {dataReportById.CASH_ADVANCE_TYPE === 1 && (
                                    <TextInput
                                        id="tipe"
                                        type="text"
                                        name="tipe"
                                        value={"Cash Advance"}
                                        className=""
                                        autoComplete="tipe"
                                        readOnly
                                    />
                                )}
                                {dataReportById.CASH_ADVANCE_TYPE === 2 && (
                                    <TextInput
                                        id="tipe"
                                        type="text"
                                        name="tipe"
                                        value={"Reimburse"}
                                        className=""
                                        autoComplete="tipe"
                                        readOnly
                                    />
                                )}
                            </div> */}
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
                                    value={dataReportById?.user_used_by.name}
                                    className=""
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
                                    value={dataReportById?.user.name}
                                    className=""
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
                                        dataReportById?.REPORT_CASH_ADVANCE_REQUESTED_DATE,
                                        "dd-mm-yyyy"
                                    )}
                                    className=""
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
                                    value={dataReportById?.REPORT_CASH_ADVANCE_DIVISION}
                                    className=""
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
                                    value={dataReportById?.user_approval.name}
                                    className=""
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
                                                {cad.REPORT_CASH_ADVANCE_DETAIL_DOCUMENT_ID !== null ? (
                                                    <TD className="border px-3 py-2">
                                                        <button
                                                            type="button"
                                                            title="Download File"
                                                            onClick={() =>
                                                                handleFileDownload(
                                                                    cad.REPORT_CASH_ADVANCE_DETAIL_ID
                                                                )
                                                            }
                                                        >
                                                            <ArrowDownTrayIcon className="w-6 m-auto" />
                                                        </button>
                                                    </TD>
                                                ) : (
                                                    <TD className="border px-3 py-2">-</TD>
                                                )}
                                                <TD className="border">
                                                    {cad.cost_classification?.CASH_ADVANCE_COST_CLASSIFICATION_NAME}
                                                </TD>
                                                <TD className="border">
                                                    {cad.coa?.COA_CODE + ' - ' + cad.coa?.COA_TITLE}
                                                </TD>
                                            <TD className="border">
                                                {formatCurrency.format(
                                                    cad.REPORT_CASH_ADVANCE_DETAIL_AMOUNT_APPROVE
                                                )}
                                            </TD>
                                            <TD className="border">
                                                {cad.REPORT_CASH_ADVANCE_DETAIL_REMARKS}
                                            </TD>
                                            {/* <TD className="border">
                                                <TextInput
                                                    id="REPORT_CASH_ADVANCE_DETAIL_NOTE"
                                                    type="text"
                                                    name="REPORT_CASH_ADVANCE_DETAIL_NOTE"
                                                    value={
                                                        cad.REPORT_CASH_ADVANCE_DETAIL_NOTE
                                                    }
                                                    className="w-1/2"
                                                    autoComplete="REPORT_CASH_ADVANCE_DETAIL_NOTE"
                                                    onChange={(e) =>
                                                        handleChangeExecuteReport(
                                                            e,
                                                            i
                                                        )
                                                    }
                                                />
                                            </TD> */}
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
                                                dataReportById?.REPORT_CASH_ADVANCE_TOTAL_AMOUNT
                                            )}
                                        </TD>
                                    </tr>
                                    <tr className="text-center text-black text-sm leading-7">
                                        <TD
                                            className="border text-right pr-5 py-2"
                                            colSpan={8}
                                        >
                                            TOTAL APPROVED
                                        </TD>
                                        <TD className="border text-center py-2">
                                        {formatCurrency.format(
                                                dataReportById?.REPORT_CASH_ADVANCE_TOTAL_AMOUNT_APPROVE
                                            )}
                                        </TD>
                                    </tr>
                                    <tr className="text-center text-black text-sm leading-7">
                                        <TD
                                            className="border text-right pr-5 py-2"
                                            colSpan={8}
                                        >
                                            TOTAL DIFFERENT
                                        </TD>
                                        <TD className="border text-center py-2">
                                        {formatCurrency.format(
                                                dataReportById?.REPORT_CASH_ADVANCE_TOTAL_AMOUNT_DIFFERENT
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
                                            checked={dataReportById?.cash_advance.CASH_ADVANCE_TRANSFER_AMOUNT && true}
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
                                                value={dataReportById?.cash_advance.CASH_ADVANCE_TRANSFER_AMOUNT}
                                                className="w-full lg:w-1/4 text-right"
                                                placeholder="0"
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
                                            checked={dataReportById?.cash_advance.CASH_ADVANCE_CASH_AMOUNT && true}
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
                                                value={dataReportById?.cash_advance.CASH_ADVANCE_CASH_AMOUNT}
                                                className="w-5/12 lg:w-1/4 text-right ml-9"
                                                placeholder="0"
                                                readOnly
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                        </div>

                        <div className="grid md:grid-cols-2 my-10">
                        <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="type"
                                    className="mb-2"
                                >
                                    Type
                                    <span className="text-red-600">*</span>
                                </InputLabel>
                                <select
                                    id="type"
                                    name="type"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    onChange={(e) =>
                                        setDataCAReport({...dataCAReport, refund_type: e.target.value})
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
                                    htmlFor="refundType"
                                    className="mb-2"
                                >
                                    Refund Amount
                                    {/* <span className="text-red-600">*</span> */}
                                </InputLabel>
                                <TextInput
                                    id="refund_amount"
                                    type="number"
                                    name="refund_amount"
                                    value={dataCAReport.refund_amount}
                                    className="w-1/2 text-right"
                                    autoComplete="off"
                                    placeholder="0"
                                    // required
                                    onChange={(e) =>
                                        setDataCAReport({...dataCAReport, refund_amount: e.target.value})
                                    }
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="refundType"
                                    className="mb-2"
                                >
                                    Refund Type
                                    {/* <span className="text-red-600">*</span> */}
                                </InputLabel>
                                <select
                                    id="refundType"
                                    name="refundType"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    onChange={(e) =>
                                        setDataCAReport({...dataCAReport, refund_type: e.target.value})
                                    }
                                    // required
                                >
                                    <option value="">
                                        -- Choose Refund Type --
                                    </option>
                                    {payments.map((refund: any) => (
                                        <option
                                            key={refund.id}
                                            value={refund.id}
                                        >
                                            {refund.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="refundProof"
                                    className="mb-2"
                                >
                                    Refund Proof
                                    {/* <span className="text-red-600">*</span> */}
                                </InputLabel>
                                <input
                                    type="file"
                                    id="refundProof"
                                    name="refundProof"
                                    className="w-full bg-white leading-4"
                                    onChange={(e) =>
                                        setDataCAReport({...dataCAReport, refund_proof: e.target.value})
                                    }
                                    // required
                                />
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

                        {/* <div className="w-1/2 p-2 mt-5">
                            <InputLabel
                                htmlFor="DELIVERY_METHOD"
                                value="Delivery Method"
                                className="mb-2"
                            />
                            {dataById.DELIVERY_METHOD === 1 &&(
                                <TextInput
                                    id="DELIVERY_METHOD"
                                    type="text"
                                    name="DELIVERY_METHOD"
                                    value="Cash"
                                    readOnly
                                />
                            )}
                            {dataById.DELIVERY_METHOD === 2 &&(
                                <TextInput
                                    id="DELIVERY_METHOD"
                                    type="text"
                                    name="DELIVERY_METHOD"
                                    value="Transfer"
                                    readOnly
                                />
                            )}
                        </div> */}

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
                                            value={dataById.user_used_by.name}
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
                
                <div className={toggleState === 1 ? "" : "hidden"}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-4 mb-5 mt-5">
                        <div className="flex flex-col">
                            <div className="rounded-tr-md rounded-br-md rounded-bl-md bg-white pt-5 pb-1 px-10 shadow-default dark:border-strokedark dark:bg-boxdark">
                                <Button
                                    className="text-sm font-semibold mb-4 px-6 py-1.5 md:col-span-2 lg:col-auto text-white bg-red-600 hover:bg-red-500"
                                    onClick={() => {
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
                                    }}
                                >
                                    {"Add Cash Advance"}
                                </Button>
                                    {/* {toggleState === 1 && ( */}
                                        
                                    {/* )} */}
                                    {/* {toggleState === 2 && (
                                        <Button
                                            className="text-sm font-semibold mb-4 px-6 py-1.5 md:col-span-2 lg:col-auto text-white bg-red-600 hover:bg-red-500"
                                            onClick={() => {
                                                setModal({
                                                    add: false,
                                                    delete: false,
                                                    edit: false,
                                                    view: false,
                                                    document: false,
                                                    search: false,
                                                    search_ca_report: false,
                                                    approve: false,
                                                    report: true,
                                                    execute: false,
                                                    view_report: false,
                                                    approve_report: false,
                                                    revised_report: false,
                                                    execute_report: false,
                                                });
                                            }}
                                        >
                                            {"Add CA Report"}
                                        </Button>
                                    )} */}
                            </div>
                            <div className="bg-white rounded-md mb-5 lg:mb-0 p-10 mt-5">
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
                                        <div className="mb-5">
                                            <Input
                                                id="cash_advance_start_date"
                                                name="cash_advance_start_date"
                                                type="date"
                                                value={searchCA.cash_advance_start_date}
                                                className="focus:ring-red-600"
                                                onChange={(e:any) =>
                                                setSearchCA({
                                                    ...searchCA,
                                                    cash_advance_start_date: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="mb-5">
                                            {/* <DatePicker
                                                className="w-full"
                                                format="dd-MM-y"
                                                dayPlaceholder="dd"
                                                monthPlaceholder="mm"
                                                yearPlaceholder="yyyy"
                                                onChange={onChange}
                                                value={value}
                                            /> */}
                                            <Input
                                                id="cash_advance_end_date"
                                                name="cash_advance_end_date"
                                                type="date"
                                                value={searchCA.cash_advance_end_date}
                                                className="focus:ring-red-600"
                                                onChange={(e:any) =>
                                                setSearchCA({
                                                    ...searchCA,
                                                    cash_advance_end_date: e.target.value,
                                                    })
                                                }
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
                                                required
                                                >
                                                    <option value="1">Cash Advace</option>
                                                    <option value="2">CashAdvance Report</option>
                                            </select>
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                className="mb-4 w-40 py-1.5 px-2 bg-red-600 hover:bg-red-500"
                                                onClick={() => getCA()}
                                            >
                                                Submit
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
                                        <legend className="ml-8 px-3 text-sm">Cash Advance Status</legend>
                                        <div className="flex flex-wrap content-between gap-10 justify-center mt-5 mx-1">
                                            <div className="flex relative">
                                                <Button className="bg-gray-500 px-2 py-1 hover:bg-gray-400" onClick={() => getCA("", 0)}>
                                                    Request
                                                    <span className="flex absolute bg-red-600 -top-3 -right-4 px-2 rounded-full">
                                                        0
                                                    </span>
                                                </Button>
                                            </div>
                                            <div className="flex relative">
                                                <Button className="bg-green-600 px-2 py-1 hover:bg-green-500" onClick={() => getCA("", 1)}>
                                                    Approve 1
                                                    <span className="flex absolute bg-red-600 -top-3 -right-4 px-2 rounded-full">
                                                        0
                                                    </span>
                                                </Button>
                                            </div>
                                            <div className="flex relative">
                                                <Button className="bg-green-600 px-2 py-1 hover:bg-green-500">
                                                    Approve 2
                                                    <span className="flex absolute bg-red-600 -top-3 -right-4 px-2 rounded-full">
                                                        0
                                                    </span>
                                                </Button>
                                            </div>
                                            <div className="flex relative">
                                                <Button className="bg-yellow-400 px-2 py-1 hover:bg-yellow-300">
                                                    Pending Report
                                                    <span className="flex absolute bg-red-600 -top-3 -right-4 px-2 rounded-full">
                                                        0
                                                    </span>
                                                </Button>
                                            </div>
                                            <div className="flex relative">
                                                <Button className="bg-yellow-400 px-2 py-1 hover:bg-yellow-300">
                                                    Need Revision
                                                    <span className="flex absolute bg-red-600 -top-3 -right-4 px-2 rounded-full">
                                                        0
                                                    </span>
                                                </Button>
                                            </div>
                                            <div className="flex relative">
                                                <Button className="bg-red-600 px-2 py-1 hover:bg-red-500">
                                                    Reject
                                                    <span className="flex absolute bg-red-600 -top-3 -right-4 px-2 rounded-full">
                                                        0
                                                    </span>
                                                </Button>
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>

                                <div className="mt-10">
                                    <fieldset className="pb-10 pt-5 rounded-lg border-slate-100 border-2">
                                        <legend className="ml-8 px-3 text-sm">Cash Advance Report Status</legend>
                                        <div className="flex flex-wrap content-between gap-10 justify-center mt-5 mx-1">
                                            <div className="flex relative">
                                                <Button className="bg-gray-500 px-2 py-1 hover:bg-gray-400" onClick={() => getCA("", 0)}>
                                                    Request
                                                    <span className="flex absolute bg-red-600 -top-3 -right-4 px-2 rounded-full">
                                                        0
                                                    </span>
                                                </Button>
                                            </div>
                                            <div className="flex relative">
                                                <Button className="bg-green-600 px-2 py-1 hover:bg-green-500" onClick={() => getCA("", 1)}>
                                                    Approve 1
                                                    <span className="flex absolute bg-red-600 -top-3 -right-4 px-2 rounded-full">
                                                        0
                                                    </span>
                                                </Button>
                                            </div>
                                            <div className="flex relative">
                                                <Button className="bg-green-600 px-2 py-1 hover:bg-green-500">
                                                    Approve 2
                                                    <span className="flex absolute bg-red-600 -top-3 -right-4 px-2 rounded-full">
                                                        0
                                                    </span>
                                                </Button>
                                            </div>
                                            <div className="flex relative">
                                                <Button className="bg-yellow-400 px-2 py-1 hover:bg-yellow-300">
                                                    Need Revision
                                                    <span className="flex absolute bg-red-600 -top-3 -right-4 px-2 rounded-full">
                                                        0
                                                    </span>
                                                </Button>
                                            </div>
                                            <div className="flex relative">
                                                <Button className="bg-red-600 px-2 py-1 hover:bg-red-500">
                                                    Reject
                                                    <span className="flex absolute bg-red-600 -top-3 -right-4 px-2 rounded-full">
                                                        0
                                                    </span>
                                                </Button>
                                            </div>
                                            <div className="flex relative">
                                                <Button className="bg-green-500 px-2 py-1 hover:bg-green-600">
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
                                                            value="-"
                                                            className=""
                                                        />
                                                        <TableTD
                                                            value={dateFormat(
                                                                ca.CASH_ADVANCE_REQUESTED_DATE,
                                                                "dd mmmm yyyy"
                                                            )}
                                                            className=""
                                                        />
                                                        <TableTD
                                                            value={formatCurrency.format(
                                                                ca.CASH_ADVANCE_TOTAL_AMOUNT
                                                            )}
                                                            className=""
                                                        />
                                                        {ca.approval_status
                                                            .CA_STATUS_ID ===
                                                            0 && (
                                                            <TableTD
                                                                value={
                                                                    <span className="inline-flex items-center rounded-md bg-gray-200 px-3 py-2 text-xs font-medium text-gray-700">
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
                                                                    <span className="inline-flex items-center rounded-md bg-green-100 px-3 py-2 text-xs font-medium text-green-700">
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
                                                                    <span className="inline-flex items-center rounded-md bg-red-100 px-3 py-2 text-xs font-medium text-red-700">
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
                                                                    <span className="inline-flex items-center rounded-md bg-yellow-300 px-3 py-2 text-xs font-medium text-white">
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
                                                                    <span className="inline-flex items-center rounded-md bg-green-100 px-3 py-2 text-xs font-medium text-green-700">
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
                                                                    <span className="inline-flex items-center rounded-md bg-red-100 px-3 py-2 text-xs font-medium text-red-700">
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
                                                                    <span className="inline-flex items-center rounded-md bg-yellow-300 px-3 py-2 text-xs font-medium text-white">
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
                                                                    <span className="inline-flex items-center rounded-md bg-green-100 px-3 py-2 text-xs font-medium text-green-700">
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
                                                                    <span className="inline-flex items-center rounded-md bg-green-100 px-3 py-2 text-xs font-medium text-green-700">
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
                                                                    <span className="inline-flex items-center rounded-md bg-red-100 px-3 py-2 text-xs font-medium text-red-700">
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
                                                                    <span className="inline-flex items-center rounded-md bg-yellow-300 px-3 py-2 text-xs font-medium text-white">
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
                                                                        "Approve 1"
                                                                    // </span>
                                                                }
                                                            className=""
                                                        />
                                                        <TableTD
                                                            value={
                                                                    // <span className="inline-flex items-center rounded-md bg-gray-200 px-3 py-2 text-xs font-medium text-gray-700">
                                                                        "Approve 2"
                                                                    // </span>
                                                                }
                                                            className=""
                                                        />
                                                        <TableTD
                                                            value={
                                                                    // <span className="inline-flex items-center rounded-md bg-gray-200 px-3 py-2 text-xs font-medium text-gray-700">
                                                                        "Approve 3"
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
                                                                                            ca.CASH_ADVANCE_FIRST_APPROVAL_BY
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    Create CA Report
                                                                                </a>
                                                                            )}
                                                                            <a
                                                                                href=""
                                                                                className="block px-4 py-2 text-sm hover:bg-gray-100"
                                                                                onClick={(
                                                                                    e
                                                                                ) =>
                                                                                    handleShowReportModal(
                                                                                        e,
                                                                                        ca.CASH_ADVANCE_ID
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
                                                                                        ca.CASH_ADVANCE_ID
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
                                                                                        ca.CASH_ADVANCE_ID
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
                                                                                        ca.CASH_ADVANCE_ID
                                                                                    )
                                                                                }
                                                                            >
                                                                                Execute CA Report
                                                                            </a>
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

                {/* <div className={toggleState === 2 ? "" : "hidden"}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-4 mb-5 mt-5">
                        <div className="bg-white rounded-md mb-5 lg:mb-0 p-10">
                            <div className="grid grid-cols-3 gap-2">
                                <div className="col-span-2">
                                    <button
                                        className="w-full inline-flex rounded-md text-left border-0 py-1.5 text-gray-400 ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6 lg:col-span-5 md:col-span-4"
                                        onClick={() => {
                                            setModal({
                                                add: false,
                                                delete: false,
                                                edit: false,
                                                view: false,
                                                document: false,
                                                search: false,
                                                search_ca_report: !modal.search_ca_report,
                                                approve: false,
                                                report: false,
                                                view_report: false,
                                                approve_report: false,
                                                revised_report: false,
                                                execute_report: false,
                                                execute: false,
                                            });
                                        }}
                                    >
                                        <MagnifyingGlassIcon
                                            className="mx-2 h-5 w-5 text-gray-400"
                                            aria-hidden="true"
                                        />
                                        Search Cash Advance Report
                                    </button>
                                </div>
                                <div className="flex justify-center items-center">
                                    <Button
                                        className="mb-4 w-40 py-1.5 px-2"
                                        onClick={() => clearSearchCA()}
                                    >
                                        Clear Search
                                    </Button>
                                </div>
                                <div className="flex flex-wrap col-span-3 gap-12 justify-center mt-5">
                                    <div className="flex relative">
                                        <Button className="bg-gray-500 px-2 py-1 hover:bg-gray-400">
                                            Request
                                            <span className="flex absolute bg-red-600 -top-3 -right-4 px-2 rounded-full">
                                                0
                                            </span>
                                        </Button>
                                    </div>
                                    <div className="flex relative">
                                        <Button className="bg-green-600 px-2 py-1 hover:bg-green-500">
                                            Approve 1
                                            <span className="flex absolute bg-red-600 -top-3 -right-4 px-2 rounded-full">
                                                0
                                            </span>
                                        </Button>
                                    </div>
                                    <div className="flex relative">
                                        <Button className="bg-green-600 px-2 py-1 hover:bg-green-500">
                                            Approve 2
                                            <span className="flex absolute bg-red-600 -top-3 -right-4 px-2 rounded-full">
                                                0
                                            </span>
                                        </Button>
                                    </div>
                                    <div className="flex relative">
                                        <Button className="bg-green-600 px-2 py-1 hover:bg-green-500">
                                            Approve 3
                                            <span className="flex absolute bg-red-600 -top-3 -right-4 px-2 rounded-full">
                                                0
                                            </span>
                                        </Button>
                                    </div>
                                    <div className="flex relative">
                                        <Button className="bg-yellow-400 px-2 py-1 hover:bg-yellow-300">
                                            Need Revision
                                            <span className="flex absolute bg-red-600 -top-3 -right-4 px-2 rounded-full">
                                                0
                                            </span>
                                        </Button>
                                    </div>
                                    <div className="flex relative">
                                        <Button className="bg-red-600 px-2 py-1 hover:bg-red-500">
                                            Reject
                                            <span className="flex absolute bg-red-600 -top-3 -right-4 px-2 rounded-full">
                                                0
                                            </span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-md col-span-2 p-10">
                            <div className="max-w-full overflow-x-auto h-auto h-75 ring-1 ring-stone-200 shadow-xl rounded-lg custom-table overflow-visible">
                                <table className="w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-100">
                                        <tr className="bg-gray-2 dark:bg-meta-4 text-center">
                                            <TableTH
                                                className="max-w-[0px]"
                                                label={"No"}
                                            />
                                            <TableTH
                                                className="min-w-[50px]"
                                                label={"CA Number"}
                                            />
                                            <TableTH
                                                className="min-w-[50px]"
                                                label={"Request Date"}
                                            />
                                            <TableTH
                                                className="min-w-[50px]"
                                                label={"Amount"}
                                            />
                                            <TableTH
                                                className="min-w-[50px]"
                                                label={"Status"}
                                            />
                                            <TableTH
                                                className="min-w-[50px]"
                                                label={"Approve 1"}
                                            />
                                            <TableTH
                                                className="min-w-[50px]"
                                                label={"Approve 2"}
                                            />
                                            <TableTH
                                                className="min-w-[50px]"
                                                label={"Approve 3"}
                                            />
                                            <TableTH
                                                className={"min-w-[50px]"}
                                                label={"Action"}
                                            />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cashAdvanceReport.data === undefined && (
                                            <tr>
                                                <TD
                                                    className="leading-10 text-gray-500"
                                                    colSpan="9"
                                                >
                                                    Please Search Cash Advance
                                                    Report
                                                </TD>
                                            </tr>
                                        )}
                                        {cashAdvanceReport.data?.length === 0 ? (
                                            <tr>
                                                <TD
                                                    className="leading-10 text-gray-500"
                                                    colSpan="9"
                                                >
                                                    Data not available
                                                </TD>
                                            </tr>
                                        ) : (
                                            cashAdvanceReport.data?.map(
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
                                                                ca.cash_advance.CASH_ADVANCE_NUMBER
                                                            }
                                                            className=""
                                                        />
                                                        <TableTD
                                                            value={dateFormat(
                                                                ca.REPORT_CASH_ADVANCE_REQUESTED_DATE,
                                                                "dd mmmm yyyy"
                                                            )}
                                                            className=""
                                                        />
                                                        <TableTD
                                                            value={formatCurrency.format(
                                                                ca.REPORT_CASH_ADVANCE_TOTAL_AMOUNT
                                                            )}
                                                            className=""
                                                        />
                                                        {ca.approval_status
                                                            .CA_STATUS_ID ===
                                                            0 && (
                                                            <TableTD
                                                                value={
                                                                    <span className="inline-flex items-center rounded-md bg-gray-200 px-3 py-2 text-xs font-medium text-gray-700">
                                                                        {
                                                                            ca
                                                                                .approval_status
                                                                                .CA_STATUS_NAME
                                                                        }
                                                                    </span>
                                                                }
                                                                className=""
                                                            />
                                                        )}
                                                        {ca.approval_status
                                                            .CA_STATUS_ID ===
                                                            1 && (
                                                            <TableTD
                                                                value={
                                                                    <span className="inline-flex items-center rounded-md bg-green-100 px-3 py-2 text-xs font-medium text-green-700">
                                                                        {
                                                                            ca
                                                                                .approval_status
                                                                                .CA_STATUS_NAME
                                                                        }
                                                                    </span>
                                                                }
                                                                className=""
                                                            />
                                                        )}
                                                        {ca.approval_status
                                                            .CA_STATUS_ID ===
                                                            2 && (
                                                            <TableTD
                                                                value={
                                                                    <span className="inline-flex items-center rounded-md bg-red-100 px-3 py-2 text-xs font-medium text-red-700">
                                                                        {
                                                                            ca
                                                                                .approval_status
                                                                                .CA_STATUS_NAME
                                                                        }
                                                                    </span>
                                                                }
                                                                className=""
                                                            />
                                                        )}
                                                        {ca.approval_status
                                                            .CA_STATUS_ID ===
                                                            3 && (
                                                            <TableTD
                                                                value={
                                                                    <span className="inline-flex items-center rounded-md bg-yellow-300 px-3 py-2 text-xs font-medium text-white">
                                                                        {
                                                                            ca
                                                                                .approval_status
                                                                                .CA_STATUS_NAME
                                                                        }
                                                                    </span>
                                                                }
                                                                className=""
                                                            />
                                                        )}
                                                        {ca.approval_status
                                                            .CA_STATUS_ID ===
                                                            4 && (
                                                            <TableTD
                                                                value={
                                                                    <span className="inline-flex items-center rounded-md bg-yellow-300 px-3 py-2 text-xs font-medium text-white">
                                                                        {
                                                                            ca
                                                                                .approval_status
                                                                                .CA_STATUS_NAME
                                                                        }
                                                                    </span>
                                                                }
                                                                className=""
                                                            />
                                                        )}
                                                        <TableTD value="Approve 1" className=""></TableTD>
                                                        <TableTD value="Approve 2" className=""></TableTD>
                                                        <TableTD value="Approve 3" className=""></TableTD>
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
                                                                                    handleApproveReportModal(
                                                                                        e,
                                                                                        ca.REPORT_CASH_ADVANCE_ID
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
                                                                                    handleShowReportModal(
                                                                                        e,
                                                                                        ca.REPORT_CASH_ADVANCE_ID
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
                                                                                    handleRevisedReportModal(
                                                                                        e,
                                                                                        ca.REPORT_CASH_ADVANCE_ID
                                                                                    )
                                                                                }
                                                                            >
                                                                                Revised
                                                                            </a>
                                                                            <a
                                                                                href=""
                                                                                className="block px-4 py-2 text-sm hover:bg-gray-100"
                                                                                onClick={(
                                                                                    e
                                                                                ) =>
                                                                                    handleExecuteModal(
                                                                                        e,
                                                                                        ca.REPORT_CASH_ADVANCE_ID
                                                                                    )
                                                                                }
                                                                            >
                                                                                Execute
                                                                            </a>
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
                                links={cashAdvanceReport.links}
                                fromData={cashAdvanceReport.from}
                                toData={cashAdvanceReport.to}
                                totalData={cashAdvanceReport.total}
                                clickHref={(url: string) =>
                                    getCA(url.split("?").pop())
                                }
                            />
                        </div>
                    </div>
                </div> */}
            </div>
            {/* </div> */}
            {/* Content End */}
        </AuthenticatedLayout>
    );
}
