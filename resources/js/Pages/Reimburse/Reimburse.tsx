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
import {
    ArrowDownTrayIcon,
    ArrowPathIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import dateFormat from "dateformat";
import ModalSearch from "@/Components/Modal/ModalSearch";
import Input from "@/Components/Input";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-tailwindcss-select";
import CurrencyInput from "react-currency-input-field";
import Swal from "sweetalert2";
import BadgeCustom from "@/Components/BadgeFlat";
import BadgeFlat from "@/Components/BadgeFlat";

export default function Reimburse({ auth }: PageProps) {
    useEffect(() => {
        getReimburseNumber();
        getReimburseRequestStatus();
        getReimburseApprove1Status();
        getReimburseApprove2Status();
        getReimburseApprove3Status();
        getReimburseNeedRevisionStatus();
        getReimburseRejectStatus();
        getReimburseApproval();
    }, []);

    const handleRefresh = () => {
        getReimburse();
        getReimburseRequestStatus();
        getReimburseApprove1Status();
        getReimburseApprove2Status();
        getReimburseApprove3Status();
        getReimburseNeedRevisionStatus();
        getReimburseRejectStatus();
        getReimburseApproval();
    };

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
    });
    // Modal Add End

    // Modal Add Files Start
    const [modalFiles, setModalFiles] = useState<any>({
        add_files: false,
        show_files: false,
        index: "",
        index_show: "",
    });
    // Modal Add Files End

    const { data, setData, errors, reset } = useForm({
        reimburse_number: "",
        reimburse_used_by: "",
        reimburse_requested_by: "",
        reimburse_division: "",
        reimburse_branch: "",
        reimburse_first_approval_by: "",
        reimburse_request_note: "",
        reimburse_delivery_method_transfer: "",
        reimburse_transfer_amount: "",
        reimburse_delivery_method_cash: "",
        reimburse_cash_amount: "",
        reimburse_total_amount: "",
        reimburse_transfer_date: "",
        reimburse_from_bank_account: "",
        reimburse_receive_date: "",
        reimburse_receive_name: "",
        refund_type: "",
        refund_proof: "",
        ReimburseDetail: [
            {
                reimburse_detail_date: "",
                reimburse_detail_purpose: "",
                reimburse_detail_relation_name: "",
                reimburse_detail_relation_position: "",
                reimburse_detail_relation_organization_id: "",
                reimburse_detail_location: "",
                reimburse_detail_amount: "",
                reimburse_detail_note: "",
                reimburse_detail_document: [],
            },
        ],
    });

    // Handle Success Start
    const [isSuccess, setIsSuccess] = useState<string>("");

    const handleSuccess = (message: string) => {
        setIsSuccess("");
        reset();
        setData({
            reimburse_number: "",
            reimburse_used_by: "",
            reimburse_requested_by: "",
            reimburse_division: "",
            reimburse_branch: "",
            reimburse_first_approval_by: "",
            reimburse_request_note: "",
            reimburse_delivery_method_transfer: "",
            reimburse_transfer_amount: "",
            reimburse_delivery_method_cash: "",
            reimburse_cash_amount: "",
            reimburse_total_amount: "",
            reimburse_transfer_date: "",
            reimburse_from_bank_account: "",
            reimburse_receive_date: "",
            reimburse_receive_name: "",
            refund_type: "",
            refund_proof: "",
            ReimburseDetail: [
                {
                    reimburse_detail_date: "",
                    reimburse_detail_purpose: "",
                    reimburse_detail_relation_name: "",
                    reimburse_detail_relation_position: "",
                    reimburse_detail_relation_organization_id: "",
                    reimburse_detail_location: "",
                    reimburse_detail_amount: "",
                    reimburse_detail_note: "",
                    reimburse_detail_document: [],
                },
            ],
        });

        setIsSuccess(message);
        getReimburse();
        getReimburseNumber();
        getReimburseRequestStatus();
        getReimburseApprove1Status();
        getReimburseApprove2Status();
        getReimburseApprove3Status();
        getReimburseNeedRevisionStatus();
        getReimburseRejectStatus();
        getReimburseApproval();
    };
    // Handle Success End

    const [dataById, setDataById] = useState<any>({
        REIMBURSE_REQUEST_NOTE: "",
        reimburse_detail: [
            {
                REIMBURSE_DETAIL_ID: "",
                REIMBURSE_DETAIL_PURPOSE: "",
                REIMBURSE_DETAIL_LOCATION: "",
                REIMBURSE_DETAIL_AMOUNT: "",
                REIMBURSE_DETAIL_NOTE: "",
                REIMBURSE_DETAIL_DOCUMENT_ID: "",
            },
        ],
        // user: [
        //     {
        //         id: "",
        //         name: "",
        //         email: "",
        //         role_id: "",
        //     },
        // ],
        // user_used_by: [
        //     {
        //         id: "",
        //         name: "",
        //         email: "",
        //         role_id: "",
        //     },
        // ],
        // user_approval: [
        //     {
        //         id: "",
        //         name: "",
        //         email: "",
        //         role_id: "",
        //     },
        // ],
    });

    // Handle Add Row Start
    const [DataRow, setDataRow] = useState([
        {
            reimburse_detail_date: "",
            reimburse_detail_purpose: "",
            reimburse_detail_relation_name: "",
            reimburse_detail_relation_position: "",
            reimburse_detail_relation_organization_id: "",
            reimburse_detail_location: "",
            reimburse_detail_amount: "",
            reimburse_detail_note: "",
            reimburse_detail_document: [],
        },
    ]);

    const handleAddRow = (e: FormEvent) => {
        e.preventDefault();

        setDataRow([
            ...DataRow,
            {
                reimburse_detail_date: "",
                reimburse_detail_purpose: "",
                reimburse_detail_relation_name: "",
                reimburse_detail_relation_position: "",
                reimburse_detail_relation_organization_id: "",
                reimburse_detail_location: "",
                reimburse_detail_amount: "",
                reimburse_detail_note: "",
                reimburse_detail_document: [],
            },
        ]);

        setData("ReimburseDetail", [
            ...data.ReimburseDetail,
            {
                reimburse_detail_date: "",
                reimburse_detail_purpose: "",
                reimburse_detail_relation_name: "",
                reimburse_detail_relation_position: "",
                reimburse_detail_relation_organization_id: "",
                reimburse_detail_location: "",
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

        setDataRow(deleteRow);

        setData("ReimburseDetail", deleteRow);
    };
    // Handle Remove Row End

    // Handle Change Add Start
    const handleChangeAdd = (e: any, i: number) => {
        const { name, value } = e.target;

        const onchangeVal: any = [...data.ReimburseDetail];

        onchangeVal[i][name] = value;

        setDataRow(onchangeVal);

        setData("ReimburseDetail", onchangeVal);
    };
    // Handle Change Add End

    // Handle Change Add Date Start
    const handleChangeAddDate = (date: any, name: any, i: number) => {
        const onchangeVal: any = [...data.ReimburseDetail];

        onchangeVal[i][name] = date.toLocaleDateString("en-CA");

        setDataRow(onchangeVal);

        setData("ReimburseDetail", onchangeVal);
    };
    // Handle Change Add Date End

    // Handle Change Add Custom Start
    const handleChangeAddCustom = (value: any, name: any, i: number) => {
        const onchangeVal: any = [...data.ReimburseDetail];

        onchangeVal[i][name] = value;

        setDataRow(onchangeVal);

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

    const handleUploadFile = (e: any, i: number) => {
        const { name, files } = e.target;

        const onchangeFile: any = [...data.ReimburseDetail];

        onchangeFile[i][name] = files[0];

        setData("ReimburseDetail", onchangeFile);
    };

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

    // Handle Change Revised Start
    const handleChangeRevised = (e: any, i: number) => {
        const { name, value } = e.target;

        const onchangeVal: any = [...dataById.reimburse_detail];

        onchangeVal[i][name] = value;

        setDataById({ ...dataById, reimburse_detail: onchangeVal });
    };
    // Handle Change Revised End

    const handleUploadFileRevised = (e: any, i: number) => {
        const { name, files } = e.target;

        const onchangeFile: any = [...dataById.reimburse_detail];

        onchangeFile[i][name] = files[0];

        // setData("ReimburseDetail", onchangeFile);

        setDataById({ ...dataById, reimburse_detail: onchangeFile });
    };

    // Handle Remove Row Revised Start
    const handleRemoveRowRevised = (i: number) => {
        const deleteRow = [...dataById.reimburse_detail];

        deleteRow.splice(i, 1);

        setDataById({ ...dataById, reimburse_detail: deleteRow });
    };
    // Handle Remove Row Revised End

    // Handle Add Row Report Reimburse Start
    const [DataReportRow, setDataReportRow] = useState([
        {
            reimburse_detail_date: "",
            reimburse_detail_purpose: "",
            reimburse_detail_relation_name: "",
            reimburse_detail_relation_position: "",
            reimburse_detail_relation_organization_id: "",
            reimburse_detail_location: "",
            reimburse_detail_amount: "",
            reimburse_detail_note: "",
            reimburse_detail_document: [],
        },
    ]);

    const handleAddReportRow = (e: FormEvent) => {
        e.preventDefault();

        setDataReportRow([
            ...DataReportRow,
            {
                reimburse_detail_date: "",
                reimburse_detail_purpose: "",
                reimburse_detail_relation_name: "",
                reimburse_detail_relation_position: "",
                reimburse_detail_relation_organization_id: "",
                reimburse_detail_location: "",
                reimburse_detail_amount: "",
                reimburse_detail_note: "",
                reimburse_detail_document: [],
            },
        ]);

        setData("ReimburseDetail", [
            ...data.ReimburseDetail,
            {
                reimburse_detail_date: "",
                reimburse_detail_purpose: "",
                reimburse_detail_relation_name: "",
                reimburse_detail_relation_position: "",
                reimburse_detail_relation_organization_id: "",
                reimburse_detail_location: "",
                reimburse_detail_amount: "",
                reimburse_detail_note: "",
                reimburse_detail_document: [],
            },
        ]);
    };
    // Handle Add Row Report Reimburse End

    // Handle Change Add Report Reimburse Start
    const handleChangeAddReport = (e: any, i: number) => {
        const { name, value } = e.target;

        const onchangeVal: any = [...data.ReimburseDetail];

        onchangeVal[i][name] = value;

        setDataReportRow(onchangeVal);

        setData("ReimburseDetail", onchangeVal);
    };
    // Handle Change Add Report Reimburse End

    // Handle Remove Row Report Reimburse Start
    const handleRemoveReportRow = (i: number) => {
        const deleteRow = [...data.ReimburseDetail];

        deleteRow.splice(i, 1);

        setDataReportRow(deleteRow);

        setData("ReimburseDetail", deleteRow);
    };
    // Handle Remove Row Report Reimburse End

    const [reimburse, setReimburse] = useState<any>([]);
    const [CANumber, setReimburseNumber] = useState<any>([]);

    const getReimburseNumber = async () => {
        await axios
            .get(`/getReimburseNumber`)
            .then(function (response) {
                setReimburseNumber(response.data);
                console.log("xxx", response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    // Search Start
    const [searchReimburse, setSearchReimburse] = useState<any>({
        REIMBURSE_NUMBER: "",
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getReimburse = async (
        pageNumber = "page=1",
        status = "",
        status_type = ""
    ) => {
        await axios
            .post(`/getReimburse?${pageNumber}`, {
                reimburse_requested_by: searchReimburse.reimburse_requested_by,
                reimburse_used_by: searchReimburse.reimburse_used_by,
                reimburse_start_date: searchReimburse.reimburse_start_date,
                reimburse_end_date: searchReimburse.reimburse_end_date,
                reimburse_division: searchReimburse.reimburse_division,
                status: status,
                status_type: status_type,
            })
            .then((res) => {
                setReimburse(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // Clear Search Start
    const clearSearchReimburse = async (pageNumber = "page=1") => {
        await axios
            .post(`/getReimburse?${pageNumber}`)
            .then((res) => {
                setReimburse(res.data);
                setSearchReimburse({
                    reimburse_requested_by: "",
                    reimburse_used_by: "",
                    reimburse_start_date: "",
                    reimburse_end_date: "",
                    reimburse_division: "",
                    reimburse_branch: "",
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };
    // Clear Search End

    // Data Start
    const { relations, coa, persons, office }: any = usePage().props;
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

    const [getCashAdvanceMethod, setCashAdvanceMethod] = useState<any>([]);
    const getReimburseMethod = async () => {
        await axios
            .get(`/getCashAdvanceMethod`)
            .then((res) => {
                setCashAdvanceMethod(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // Handle Add Start
    const handleAddModal = async (e: FormEvent) => {
        e.preventDefault();

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
        });
    };
    // Handle Revised End

    // Handle Execute Start
    const handleExecuteModal = async (e: FormEvent, id: number) => {
        e.preventDefault();

        await axios
            .get(`/getReimburseById/${id}`)
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
        });
    };
    // Handle Execute End

    // Handle Show Start
    const handleShowModal = async (e: FormEvent, id: number) => {
        e.preventDefault();

        await axios
            .get(`/getReimburseById/${id}`)
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
        });
    };
    // Handle Show End

    const handleBtnStatus = async (status: number) => {
        setDataById({
            ...dataById,
            REIMBURSE_FIRST_APPROVAL_STATUS: status,
        });

        // console.log(dataById);

        await axios
            .patch(`/reimburseApprove/${dataById.REIMBURSE_ID}`, dataById, {
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

    const handleBtnRevised = async () => {
        await axios
            .patch(`/reimburseRevised/${dataById.REIMBURSE_ID}`, dataById, {
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

    const [
        getCountReimburseReportRequestStatus,
        setCountReimburseReportRequestStatus,
    ] = useState<any>([]);
    const getReimburseReportRequestStatus = async () => {
        await axios
            .get(`/getCountReimburseReportRequestStatus`)
            .then((res) => {
                setCountReimburseReportRequestStatus(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [
        getCountReimburseReportApprove1Status,
        setCountReimburseReportApprove1Status,
    ] = useState<any>([]);
    const getReimburseReportApprove1Status = async () => {
        await axios
            .get(`/getCountReimburseReportApprove1Status`)
            .then((res) => {
                setCountReimburseReportApprove1Status(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [
        getCountReimburseReportApprove2Status,
        setCountReimburseReportApprove2Status,
    ] = useState<any>([]);
    const getReimburseReportApprove2Status = async () => {
        await axios
            .get(`/getCountReimburseReportApprove2Status`)
            .then((res) => {
                setCountReimburseReportApprove2Status(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [
        getCountReimburseReportExecuteStatus,
        setCountReimburseReportExecuteStatus,
    ] = useState<any>([]);
    const getReimburseReportExecuteStatus = async () => {
        await axios
            .get(`/getCountReimburseReportExecuteStatus`)
            .then((res) => {
                setCountReimburseReportExecuteStatus(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [
        getCountReimburseReportNeedRevisionStatus,
        setCountReimburseReportNeedRevisionStatus,
    ] = useState<any>([]);
    const getReimburseReportNeedRevisionStatus = async () => {
        await axios
            .get(`/getCountReimburseReportNeedRevisionStatus`)
            .then((res) => {
                setCountReimburseReportNeedRevisionStatus(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [
        getCountReimburseReportRejectStatus,
        setCountReimburseReportRejectStatus,
    ] = useState<any>([]);
    const getReimburseReportRejectStatus = async () => {
        await axios
            .get(`/getCountReimburseReportRejectStatus`)
            .then((res) => {
                setCountReimburseReportRejectStatus(res.data);
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

    let total = 0;

    DataRow.forEach((item) => {
        total += Number(item.reimburse_detail_amount);
    });

    let revised_total_amount = 0;

    dataById.reimburse_detail.forEach((item: any) => {
        revised_total_amount += Number(item.REIMBURSE_DETAIL_AMOUNT);
    });

    let reimburse_total_amount_approve = 0;

    dataById?.reimburse_detail.forEach((item: any) => {
        reimburse_total_amount_approve += Number(
            item.REIMBURSE_DETAIL_AMOUNT_APPROVE
        );
        if (isNaN(reimburse_total_amount_approve)) {
            reimburse_total_amount_approve = 0;
        }
    });

    const selectPerson = persons
        ?.filter(
            (m: any) =>
                m.DIVISION_ID === auth.user.person?.DIVISION_ID &&
                m.STRUCTURE_ID === 4
        )
        .map((query: any) => {
            return {
                value: query.PERSON_ID,
                label: query.PERSON_FIRST_NAME,
            };
        });

    const selectApproval = persons
        ?.filter(
            (m: any) =>
                m.DIVISION_ID === auth.user.person?.DIVISION_ID &&
                (m.STRUCTURE_ID === 2 || m.STRUCTURE_ID === 3)
        )
        .map((query: any) => {
            return {
                value: query.PERSON_ID,
                label: query.PERSON_FIRST_NAME,
            };
        });

    const selectOffice = office
        ?.filter(
            (m: any) =>
                m.RELATION_ORGANIZATION_ID ===
                auth.user.person?.RELATION_ORGANIZATION_ID
        )
        .map((query: any) => {
            return {
                value: query.RELATION_OFFICE_ID,
                label: query.RELATION_OFFICE_ALIAS,
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

    console.log(data);
    // console.log(DataRow);
    console.log("Reimburse", reimburse.data);
    console.log("Data By Id", dataById);

    return (
        <AuthenticatedLayout user={auth.user} header={"Reimburse"}>
            <Head title="Reimburse" />

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
                    })
                }
                title={"Add Reimburse"}
                url={`/reimburse`}
                data={data}
                onSuccess={handleSuccess}
                buttonAddOns={null}
                body={
                    <>
                        <ModalToAction
                            classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 sm:min-w-full lg:min-w-[35%]`}
                            show={modalFiles.add_files}
                            closeable={true}
                            onClose={() =>
                                setModalFiles({
                                    add_files: false,
                                    show_files: false,
                                    index: "",
                                    index_show: "",
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
                                    <div className="grid grid-cols-12 my-5">
                                        {data.ReimburseDetail[
                                            modalFiles.index
                                        ]?.reimburse_detail_document.map(
                                            (val: any, i: number) => (
                                                <>
                                                    <div
                                                        key={i}
                                                        className={`w-full col-span-11`}
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
                                                </>
                                            )
                                        )}
                                    </div>
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
                                    value={auth.user.person.PERSON_FIRST_NAME}
                                    className="bg-gray-100"
                                    readOnly
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
                                    options={selectPerson}
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
                                <InputLabel
                                    htmlFor="reimburse_division"
                                    value="Cost Center"
                                    className="mb-4"
                                />
                                <TextInput
                                    id="reimburse_division"
                                    type="text"
                                    name="reimburse_division"
                                    value={
                                        auth.user.person.division
                                            ?.RELATION_DIVISION_ALIAS
                                    }
                                    className="bg-gray-100"
                                    readOnly
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
                                    options={selectOffice}
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
                                <thead className="">
                                    <tr className="bg-gray-2 text-center dark:bg-meta-4">
                                        <TH
                                            label="No."
                                            className="border"
                                            rowSpan="2"
                                        />
                                        <TH className="border px-5" rowSpan="2">
                                            Date Intended Activity{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
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
                                        <TH label="Name" className="border" />
                                        <TH label="Person" className="border" />
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
                                                    dateFormat={"dd-MM-yyyy"}
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
                                                        handleChangeAdd(e, i)
                                                    }
                                                    autoComplete="off"
                                                    required
                                                />
                                            </TD>
                                            <TD className="border">
                                                <Select
                                                    classNames={{
                                                        menuButton: () =>
                                                            `flex text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400 ring-1 ring-gray-300`,
                                                        menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
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
                                                    primaryColor={"bg-red-500"}
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
                                                        handleChangeAdd(e, i)
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
                                                        handleChangeAdd(e, i)
                                                    }
                                                    autoComplete="off"
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
                                                        handleChangeAdd(e, i)
                                                    }
                                                    autoComplete="off"
                                                    required
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
                                                    onValueChange={(val: any) =>
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
                                                    className="bg-black hover:bg-slate-800 text-sm text-white py-2 px-3"
                                                    onClick={() => {
                                                        setModalFiles({
                                                            add_files: true,
                                                            show_files: false,
                                                            index: i,
                                                            index_show: "",
                                                        });
                                                    }}
                                                >
                                                    {val
                                                        .reimburse_detail_document
                                                        ?.length > 0
                                                        ? val
                                                              ?.reimburse_detail_document
                                                              .length + " Files"
                                                        : "Add Files"}
                                                </button>
                                            </TD>
                                            <TD className="border">
                                                {DataRow.length > 1 && (
                                                    <Button
                                                        className="my-1.5 px-3 py-1"
                                                        onClick={() =>
                                                            handleRemoveRow(i)
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
                                            colSpan={5}
                                        >
                                            TOTAL AMOUNT
                                        </TD>
                                        <TD>{formatCurrency.format(total)}</TD>
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
                title="Detail Reimburse"
                url=""
                data=""
                method=""
                onSuccess=""
                headers={null}
                submitButtonName=""
                body={
                    <>
                        <ModalToAction
                            classPanel={
                                "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 sm:min-w-full lg:min-w-[35%]"
                            }
                            show={modalFiles.show_files}
                            closeable={true}
                            onClose={() =>
                                setModalFiles({
                                    add_files: false,
                                    show_files: false,
                                    index: "",
                                    index_show: "",
                                })
                            }
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
                                                        <p>
                                                            {
                                                                file?.document
                                                                    .DOCUMENT_ORIGINAL_NAME
                                                            }
                                                        </p>
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
                                    htmlFor="cashAdvanceNumber"
                                    value="Reimburse Number"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="cashAdvanceNumber"
                                    type="text"
                                    name="cashAdvanceNumber"
                                    value={dataById.REIMBURSE_NUMBER}
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
                                        dataById.person_used_by
                                            ?.PERSON_FIRST_NAME
                                    }
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
                                    htmlFor="branch"
                                    value="Branch"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="branch"
                                    type="text"
                                    name="branch"
                                    value={
                                        dataById.office?.RELATION_OFFICE_ALIAS
                                    }
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="divisi"
                                    value="Cost Center"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="divisi"
                                    type="text"
                                    name="divisi"
                                    value={
                                        auth.user.person.division
                                            ?.RELATION_DIVISION_ALIAS
                                    }
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
                                        dataById.REIMBURSE_REQUETED_DATE,
                                        "dd-mm-yyyy"
                                    )}
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
                                        dataById.person_approval
                                            ?.PERSON_FIRST_NAME
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
                                    <tr className="text-center text-gray-700 dark:bg-meta-4 leading-7">
                                        <TH
                                            label="No."
                                            className="border px-3 py-2"
                                            rowSpan="2"
                                        />
                                        <TH
                                            label="Date Intended Activity"
                                            className="border px-3 py-2"
                                            rowSpan="2"
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
                                                <TD className="border px-3">
                                                    {
                                                        rd.REIMBURSE_DETAIL_PURPOSE
                                                    }
                                                </TD>
                                                <TD className="border px-3">
                                                    {
                                                        rd.relation_organization
                                                            ?.RELATION_ORGANIZATION_ALIAS
                                                    }
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {
                                                        rd.REIMBURSE_DETAIL_RELATION_NAME
                                                    }
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {
                                                        rd.REIMBURSE_DETAIL_RELATION_POSITION
                                                    }
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {
                                                        rd.REIMBURSE_DETAIL_LOCATION
                                                    }
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
                                                                    show_files:
                                                                        true,
                                                                    index: "",
                                                                    index_show:
                                                                        i,
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
                                    <tr className="text-center text-black text-sm leading-7">
                                        <TD
                                            className="border text-right pr-5 py-2"
                                            colSpan={7}
                                        >
                                            TOTAL AMOUNT
                                        </TD>
                                        <TD className="border py-2">
                                            {formatCurrency.format(
                                                dataById.REIMBURSE_TOTAL_AMOUNT
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
                                value={dataById.REIMBURSE_REQUEST_NOTE}
                                readOnly
                            />
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
                title="Approve Reimburse"
                url={`/reimburseApprove/${dataById.reimburse_detail.REIMBURSE_DETAIL_ID}`}
                data={dataById}
                method="patch"
                onSuccess={handleSuccess}
                headers={null}
                submitButtonName={""}
                body={
                    <>
                        <ModalToAction
                            classPanel={
                                "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 sm:min-w-full lg:min-w-[35%]"
                            }
                            show={modalFiles.show_files}
                            closeable={true}
                            onClose={() =>
                                setModalFiles({
                                    add_files: false,
                                    show_files: false,
                                    index: "",
                                    index_show: "",
                                })
                            }
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
                                                        <p>
                                                            {
                                                                file?.document
                                                                    .DOCUMENT_ORIGINAL_NAME
                                                            }
                                                        </p>
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
                                    htmlFor="cashAdvanceNumber"
                                    value="Reimburse Number"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="cashAdvanceNumber"
                                    type="text"
                                    name="cashAdvanceNumber"
                                    value={dataById.REIMBURSE_NUMBER}
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
                                        dataById.person_used_by
                                            ?.PERSON_FIRST_NAME
                                    }
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
                                    htmlFor="branch"
                                    value="Branch"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="branch"
                                    type="text"
                                    name="branch"
                                    value={
                                        dataById.office?.RELATION_OFFICE_ALIAS
                                    }
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="divisi"
                                    value="Cost Center"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="divisi"
                                    type="text"
                                    name="divisi"
                                    value={
                                        auth.user.person.division
                                            ?.RELATION_DIVISION_ALIAS
                                    }
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
                                        dataById.REIMBURSE_REQUETED_DATE,
                                        "dd-mm-yyyy"
                                    )}
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
                                        dataById.person_approval
                                            ?.PERSON_FIRST_NAME
                                    }
                                    className="bg-gray-100"
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
                                            label="Date Intended Activity"
                                            className="border px-3 py-2"
                                            rowSpan={2}
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
                                                <TD className="border px-3">
                                                    {
                                                        rd.REIMBURSE_DETAIL_PURPOSE
                                                    }
                                                </TD>
                                                <TD className="border px-3">
                                                    {
                                                        rd.relation_organization
                                                            ?.RELATION_ORGANIZATION_ALIAS
                                                    }
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {
                                                        rd.REIMBURSE_DETAIL_RELATION_NAME
                                                    }
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {
                                                        rd.REIMBURSE_DETAIL_RELATION_POSITION
                                                    }
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {
                                                        rd.REIMBURSE_DETAIL_LOCATION
                                                    }
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
                                                                    show_files:
                                                                        true,
                                                                    index: "",
                                                                    index_show:
                                                                        i,
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
                                                            rd.REIMBURSE_DETAIL_APPROVAL
                                                        }
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
                                                            menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
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
                                                        value={
                                                            rd.REIMBURSE_DETAIL_COST_CLASSIFICATION
                                                        }
                                                        onChange={(val: any) =>
                                                            handleChangeApproveReportCustom(
                                                                val,
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
                                                            "3"
                                                                ? "bg-gray-100"
                                                                : ""
                                                        }`}
                                                        disabled={
                                                            rd.REIMBURSE_DETAIL_APPROVAL ===
                                                                "3" && true
                                                        }
                                                        required
                                                        placeholder="0.00"
                                                        autoComplete="off"
                                                    />
                                                </TD>
                                                <TD className="border">
                                                    <TextInput
                                                        id="REIMBURSE_DETAIL_REMARKS"
                                                        type="text"
                                                        name="REIMBURSE_DETAIL_REMARKS"
                                                        value={
                                                            rd.REIMBURSE_DETAIL_REMARKS
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
                                            colSpan={11}
                                        >
                                            APPROVE AMOUNT
                                        </TD>
                                        <TD className="border text-center py-2">
                                            {formatCurrency.format(
                                                reimburse_total_amount_approve
                                            )}
                                        </TD>
                                    </tr>
                                    <tr className="text-center text-black text-sm leading-7">
                                        <TD
                                            className="border text-right pr-5 py-2"
                                            colSpan={11}
                                        >
                                            PROPOSE AMOUNT
                                        </TD>
                                        <TD className="border text-center py-2">
                                            {formatCurrency.format(
                                                dataById.REIMBURSE_TOTAL_AMOUNT
                                            )}
                                        </TD>
                                    </tr>
                                    {/* <tr className="text-center text-black text-sm leading-7">
                                        <TD
                                            className="border text-right pr-5 py-2"
                                            colSpan={11}
                                        >
                                            SURPLUS / DEFICIT
                                        </TD>
                                        <TD className="border text-center py-2">
                                            {formatCurrency.format(
                                                dataById.REIMBURSE_TOTAL_AMOUNT -
                                                    reimburse_total_amount_approve
                                            )}
                                        </TD>
                                    </tr> */}
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
                                value={dataById.REIMBURSE_REQUEST_NOTE}
                                readOnly
                            />
                        </div>

                        <div className="md:absolute mt-7">
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
                title="Revised Reimburse"
                url={`/reimburseRevised/${dataById.REIMBURSE_ID}`}
                data={dataById}
                method="patch"
                onSuccess={handleSuccess}
                headers={null}
                submitButtonName={"Save"}
                body={
                    <>
                        <div className="grid md:grid-cols-2 my-10">
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="cashAdvanceNumber"
                                    value="Reimburse Number"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="cashAdvanceNumber"
                                    type="text"
                                    name="cashAdvanceNumber"
                                    value="PV/REIM/2024/8/00001"
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
                                    value="Fadhlan"
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
                                    value="12-08-2024"
                                    className="bg-gray-100"
                                    autoComplete="tanggalPengajuan"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="divisi"
                                    value="Cost Center"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="divisi"
                                    type="text"
                                    name="divisi"
                                    value="Information Technology"
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
                                    value="Apep"
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
                                        <TH className="border" rowSpan="2">
                                            Date Intended <br /> Activity{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
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
                                                        name="REIMBURSE_DETAIL_DATE"
                                                        // selected={
                                                        //     val.REIMBURSE_DETAIL_DATE
                                                        // }
                                                        // onChange={(date: any) =>
                                                        //     handleChangeAddDate(
                                                        //         date,
                                                        //         "REIMBURSE_DETAIL_DATE",
                                                        //         i
                                                        //     )
                                                        // }
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
                                                            cad.REIMBURSE_DETAIL_PURPOSE
                                                        }
                                                        className="w-1/2"
                                                        autoComplete="REIMBURSE_DETAIL_PURPOSE"
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
                                                    <Select
                                                        classNames={{
                                                            menuButton: () =>
                                                                `flex text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400 ring-1 ring-gray-300`,
                                                            menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
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
                                                        // value={
                                                        //     val.reimburse_detail_relation_organization_id
                                                        // }
                                                        // onChange={(val: any) =>
                                                        //     handleChangeAddCustom(
                                                        //         val,
                                                        //         "reimburse_detail_relation_organization_id",
                                                        //         i
                                                        //     )
                                                        // }
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
                                                            cad.REIMBURSE_DETAIL_RELATION_NAME
                                                        }
                                                        className="w-1/2"
                                                        autoComplete="REIMBURSE_DETAIL_RELATION_NAME"
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
                                                        id="REIMBURSE_DETAIL_RELATION_POSITION"
                                                        type="text"
                                                        name="REIMBURSE_DETAIL_RELATION_POSITION"
                                                        value={
                                                            cad.REIMBURSE_DETAIL_RELATION_POSITION
                                                        }
                                                        className="w-1/2"
                                                        autoComplete="REIMBURSE_DETAIL_RELATION_POSITION"
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
                                                            cad.REIMBURSE_DETAIL_LOCATION
                                                        }
                                                        className="w-1/2"
                                                        autoComplete="REIMBURSE_DETAIL_LOCATION"
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
                                                        id="REIMBURSE_CASH_ADVANCE_DETAIL_AMOUNT"
                                                        name="REIMBURSE_CASH_ADVANCE_DETAIL_AMOUNT"
                                                        // value={
                                                        //     cad.REIMBURSE_CASH_ADVANCE_DETAIL_AMOUNT
                                                        // }
                                                        decimalScale={2}
                                                        decimalsLimit={2}
                                                        // onValueChange={(val: any) =>
                                                        //     handleChangeApproveReportCustom(
                                                        //         val,
                                                        //         "REIMBURSE_CASH_ADVANCE_DETAIL_AMOUNT",
                                                        //         i
                                                        //     )
                                                        // }
                                                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right`}
                                                        required
                                                        placeholder="0.00"
                                                        autoComplete="off"
                                                    />
                                                </TD>
                                                <TD className="border">
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
                                                                index_show: "",
                                                                index_show_report:
                                                                    "",
                                                            });
                                                        }}
                                                    >
                                                        Show Files
                                                    </button>
                                                </TD>
                                                <TD className="border text-left px-3">
                                                    {cad.REIMBURSE_DETAIL_NOTE}
                                                </TD>
                                                {dataById.reimburse_detail
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
                                            colSpan={7}
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
                                value={dataById.REIMBURSE_REQUEST_NOTE}
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
                title="Execute Reimburse"
                url={`/reimburseApprove/${dataById.REIMBURSE_ID}`}
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
                                <InputLabel htmlFor="type" className="mb-2">
                                    Advanced Amount
                                    {/* <span className="text-red-600">*</span> */}
                                </InputLabel>
                                <CurrencyInput
                                    // value={
                                    //     dataReportById?.REIMBURSE_TOTAL_AMOUNT_REQUEST
                                    // }
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
                                    // value={
                                    //     dataReportById?.REIMBURSE_TOTAL_AMOUNT_APPROVE
                                    // }
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
                                    // value={
                                    //     dataReportById?.REIMBURSE_TOTAL_AMOUNT_DIFFERENT
                                    // }
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
                                    // value={
                                    //     dataReportById?.reimburse_differents
                                    //         .CASH_ADVANCE_DIFFERENTS_NAME
                                    // }
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
                                    // onChange={(e) =>
                                    //     setDataCAReport({
                                    //         ...dataCAReport,
                                    //         method: e.target.value,
                                    //     })
                                    // }
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
                                    // selected={dataCAReport.transaction_date}
                                    // onChange={(date: any) =>
                                    //     setDataCAReport({
                                    //         ...dataCAReport,
                                    //         transaction_date:
                                    //             date.toLocaleDateString(
                                    //                 "en-CA"
                                    //             ),
                                    //     })
                                    // }
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
                                        Add Files
                                    </button>
                                </div>
                                {/* <ModalToAction
                                    classPanel={
                                        "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 sm:min-w-full lg:min-w-[35%]"
                                    }
                                    show={modalFiles.add_files_execute_report}
                                    closeable={true}
                                    onClose={() =>
                                        setModalFiles({
                                            add_files: false,
                                            show_files: false,
                                            add_files_report: false,
                                            show_files_report: false,
                                            show_files_proof_of_document: false,
                                            add_files_execute_report: false,
                                            index: "",
                                        })
                                    }
                                    title="Proof of Document"
                                    url=""
                                    data=""
                                    method=""
                                    onSuccess=""
                                    headers={null}
                                    submitButtonName=""
                                    panelWidth=""
                                    body={
                                        <>
                                            {dataCAReport.proof_of_document.map(
                                                (val: any, i: number) => (
                                                    <div
                                                        className="grid grid-cols-12 my-5"
                                                        key={i}
                                                    >
                                                        {dataCAReport
                                                            .proof_of_document[
                                                            i
                                                        ].proof_of_document
                                                            ?.name ? (
                                                            <div className="w-full col-span-11">
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
                                                            className="text-center self-center bg-red-600 hover:bg-red-500 text-white mx-2 py-1 rounded-lg"
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
                                                className="text-sm cursor-pointer hover:underline"
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
                                /> */}
                            </div>
                        </div>
                    </>
                }
            />
            {/* Modal Execute End */}

            {/* Content Start */}
            <div className="p-6 text-gray-900 mb-60">
                <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-4 mb-5 mt-5">
                    <div className="flex flex-col">
                        <div className="rounded-tr-md rounded-br-md rounded-bl-md bg-white pt-5 pb-1 px-10 shadow-default dark:border-strokedark dark:bg-boxdark">
                            <Button
                                className="text-sm font-semibold mb-4 px-6 py-1.5 md:col-span-2 lg:col-auto text-white bg-red-600 hover:bg-red-500"
                                onClick={(e) => handleAddModal(e)}
                            >
                                {"Add Reimburse"}
                            </Button>
                        </div>
                        <div className="bg-white rounded-md mb-5 lg:mb-0 p-10 mt-5 relative">
                            <fieldset className="pb-10 pt-5 rounded-lg border-slate-100 border-2">
                                <legend className="ml-8 text-sm">Search</legend>
                                <div className="mt-3 px-4">
                                    <div className="mb-5">
                                        <Input
                                            id="reimburse_requested_by"
                                            name="reimburse_requested_by"
                                            type="text"
                                            value={
                                                searchReimburse.reimburse_requested_by
                                            }
                                            placeholder="Applicant"
                                            className="focus:ring-red-600"
                                            autoComplete="off"
                                            onChange={(e: any) =>
                                                setSearchReimburse({
                                                    ...searchReimburse,
                                                    reimburse_requested_by:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <Input
                                            id="reimburse_used_by"
                                            name="reimburse_used_by"
                                            type="text"
                                            value={
                                                searchReimburse.reimburse_used_by
                                            }
                                            placeholder="Used By"
                                            className="focus:ring-red-600"
                                            autoComplete="off"
                                            onChange={(e: any) =>
                                                setSearchReimburse({
                                                    ...searchReimburse,
                                                    reimburse_used_by:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 mb-5">
                                        <DatePicker
                                            name="reimburse_start_date"
                                            selected={
                                                searchReimburse.reimburse_start_date
                                            }
                                            onChange={(date: any) =>
                                                setSearchReimburse({
                                                    ...searchReimburse,
                                                    reimburse_start_date:
                                                        date.toLocaleDateString(
                                                            "en-CA"
                                                        ),
                                                })
                                            }
                                            dateFormat={"dd-MM-yyyy"}
                                            placeholderText="dd-mm-yyyyy (Start Date)"
                                            className="!block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-2 file:-my-1.5 focus:ring-red-600"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 mb-5">
                                        <DatePicker
                                            name="reimburse_end_date"
                                            selected={
                                                searchReimburse.reimburse_end_date
                                            }
                                            onChange={(date: any) =>
                                                setSearchReimburse({
                                                    ...searchReimburse,
                                                    reimburse_end_date:
                                                        date.toLocaleDateString(
                                                            "en-CA"
                                                        ),
                                                })
                                            }
                                            dateFormat={"dd-MM-yyyy"}
                                            placeholderText="dd-mm-yyyyy (End Date)"
                                            className="!block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-2 file:-my-1.5 focus:ring-red-600"
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <Input
                                            id="reimburse_division"
                                            name="reimburse_division"
                                            type="text"
                                            value={
                                                searchReimburse.reimburse_division
                                            }
                                            placeholder="Cost Center"
                                            className="focus:ring-red-600"
                                            autoComplete="off"
                                            onChange={(e: any) =>
                                                setSearchReimburse({
                                                    ...searchReimburse,
                                                    reimburse_division:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            className="mb-4 w-40 py-1.5 px-2 bg-red-600 hover:bg-red-500"
                                            onClick={() => getReimburse()}
                                        >
                                            Search
                                        </Button>
                                        <Button
                                            className="mb-4 w-40 py-1.5 px-2 bg-red-600 hover:bg-red-500"
                                            onClick={() =>
                                                clearSearchReimburse()
                                            }
                                        >
                                            Clear Search
                                        </Button>
                                    </div>
                                </div>
                            </fieldset>
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
                                                onClick={() =>
                                                    getReimburse(
                                                        "",
                                                        "1",
                                                        "Approve1"
                                                    )
                                                }
                                            >
                                                Request
                                                <span className="flex absolute bg-red-600 -top-2 -right-3 px-2 rounded-full">
                                                    {
                                                        getCountReimburseRequestStatus
                                                    }
                                                </span>
                                            </Button>
                                        </div>
                                        <div className="flex relative">
                                            <Button
                                                className="w-36 bg-green-600 px-2 py-1 hover:bg-green-500"
                                                onClick={() =>
                                                    getReimburse(
                                                        "",
                                                        "2",
                                                        "Approve1"
                                                    )
                                                }
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
                                                onClick={() =>
                                                    getReimburse(
                                                        "",
                                                        "2",
                                                        "Approve2"
                                                    )
                                                }
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
                                                onClick={() =>
                                                    getReimburse(
                                                        "",
                                                        "2",
                                                        "Approve3"
                                                    )
                                                }
                                            >
                                                Approve 3
                                                <span className="flex absolute bg-red-600 -top-2 -right-3 px-2 rounded-full">
                                                    {
                                                        getCountReimburseApprove1Status
                                                    }
                                                </span>
                                            </Button>
                                        </div>
                                        <div className="flex relative">
                                            <Button
                                                className="w-36 bg-yellow-400 px-2 py-1 hover:bg-yellow-300"
                                                onClick={() =>
                                                    getReimburse(
                                                        "",
                                                        "3",
                                                        "Need Revision"
                                                    )
                                                }
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
                                                onClick={() =>
                                                    getReimburse(
                                                        "",
                                                        "4",
                                                        "Reject"
                                                    )
                                                }
                                            >
                                                Reject
                                                <span className="flex absolute bg-red-600 -top-2 -right-3 px-2 rounded-full">
                                                    {
                                                        getCountReimburseRejectStatus
                                                    }
                                                </span>
                                            </Button>
                                        </div>
                                        <div className="flex relative">
                                            <Button
                                                className="w-36 bg-green-500 px-2 py-1 hover:bg-green-400"
                                                onClick={() =>
                                                    getReimburse(
                                                        "",
                                                        "6",
                                                        "Complited"
                                                    )
                                                }
                                            >
                                                Complited
                                            </Button>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-md col-span-2 p-10">
                        <div
                            className={`max-w-full overflow-x-auto ${
                                reimburse.data ? "h-[70%]" : "h-auto"
                            } ring-1 ring-stone-200 shadow-xl rounded-lg custom-table overflow-visible`}
                        >
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
                                            label={"Reimburse Number"}
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
                                            label={"Approve"}
                                            colSpan="3"
                                            rowSpan=""
                                        />
                                        <TableTH
                                            className={
                                                "border whitespace-nowrap"
                                            }
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {reimburse.data === undefined && (
                                        <tr>
                                            <TD
                                                className="leading-10 text-gray-500"
                                                colSpan="12"
                                            >
                                                Please Search Reimburse
                                            </TD>
                                        </tr>
                                    )}
                                    {reimburse.data?.length === 0 ? (
                                        <tr>
                                            <TD
                                                className="leading-10 text-gray-500"
                                                colSpan="12"
                                            >
                                                Data not available
                                            </TD>
                                        </tr>
                                    ) : (
                                        reimburse.data?.map(
                                            (dataReimburse: any, i: number) => (
                                                <tr
                                                    key={i}
                                                    className={
                                                        i % 2 === 0
                                                            ? "text-center hover:bg-gray-100"
                                                            : "bg-gray-100 text-center"
                                                    }
                                                >
                                                    <TableTD
                                                        value={i + 1}
                                                        className="w-px"
                                                    />
                                                    <TableTD
                                                        value={
                                                            dataReimburse.REIMBURSE_NUMBER
                                                        }
                                                        className=""
                                                    />
                                                    <TableTD
                                                        value={dateFormat(
                                                            dataReimburse.REIMBURSE_REQUETED_DATE,
                                                            "dd-mm-yyyy"
                                                        )}
                                                        className=""
                                                    />
                                                    <TableTD
                                                        value={formatCurrency.format(
                                                            dataReimburse.REIMBURSE_TOTAL_AMOUNT
                                                        )}
                                                        className=""
                                                    />
                                                    <TableTD
                                                        value={
                                                            <>
                                                                {dataReimburse.REIMBURSE_FIRST_APPROVAL_STATUS ===
                                                                    1 && (
                                                                    <BadgeFlat
                                                                        className=" bg-gray-200 text-gray-700"
                                                                        title="Request"
                                                                        body={
                                                                            dataReimburse.REIMBURSE_FIRST_APPROVAL_USER
                                                                        }
                                                                    />
                                                                )}
                                                                {dataReimburse.REIMBURSE_FIRST_APPROVAL_STATUS ===
                                                                    2 && (
                                                                    <BadgeFlat
                                                                        className=" bg-green-100 text-green-700"
                                                                        title="Approve"
                                                                        body={
                                                                            dataReimburse.REIMBURSE_FIRST_APPROVAL_USER
                                                                        }
                                                                    />
                                                                )}
                                                                {dataReimburse.REIMBURSE_FIRST_APPROVAL_STATUS ===
                                                                    3 && (
                                                                    <BadgeFlat
                                                                        className=" bg-yellow-300 text-white"
                                                                        title="Need Revision"
                                                                        body={
                                                                            dataReimburse.REIMBURSE_FIRST_APPROVAL_USER
                                                                        }
                                                                    />
                                                                )}
                                                                {dataReimburse.REIMBURSE_FIRST_APPROVAL_STATUS ===
                                                                    4 && (
                                                                    <BadgeFlat
                                                                        className=" bg-red-100 text-red-700"
                                                                        title="Reject"
                                                                        body={
                                                                            dataReimburse.REIMBURSE_FIRST_APPROVAL_USER
                                                                        }
                                                                    />
                                                                )}
                                                            </>
                                                        }
                                                        className=""
                                                    />
                                                    <TableTD
                                                        value={
                                                            <>
                                                                {dataReimburse.REIMBURSE_SECOND_APPROVAL_STATUS ===
                                                                    "" ||
                                                                    (dataReimburse.REIMBURSE_SECOND_APPROVAL_STATUS ===
                                                                        null && (
                                                                        <span>
                                                                            -
                                                                        </span>
                                                                    ))}
                                                                {dataReimburse.REIMBURSE_SECOND_APPROVAL_STATUS ===
                                                                    1 && (
                                                                    <BadgeFlat
                                                                        className=" bg-gray-200 text-gray-700"
                                                                        title="Request"
                                                                        body={
                                                                            dataReimburse.REIMBURSE_SECOND_APPROVAL_USER
                                                                        }
                                                                    />
                                                                )}
                                                                {dataReimburse.REIMBURSE_SECOND_APPROVAL_STATUS ===
                                                                    2 && (
                                                                    <BadgeFlat
                                                                        className=" bg-green-100 text-green-700"
                                                                        title="Approve"
                                                                        body={
                                                                            dataReimburse.REIMBURSE_SECOND_APPROVAL_USER
                                                                        }
                                                                    />
                                                                )}
                                                                {dataReimburse.REIMBURSE_SECOND_APPROVAL_STATUS ===
                                                                    3 && (
                                                                    <BadgeFlat
                                                                        className=" bg-yellow-300 text-white"
                                                                        title="Need Revision"
                                                                        body={
                                                                            dataReimburse.REIMBURSE_SECOND_APPROVAL_USER
                                                                        }
                                                                    />
                                                                )}
                                                                {dataReimburse.REIMBURSE_SECOND_APPROVAL_STATUS ===
                                                                    4 && (
                                                                    <BadgeFlat
                                                                        className=" bg-red-100 text-red-700"
                                                                        title="Reject"
                                                                        body={
                                                                            dataReimburse.REIMBURSE_SECOND_APPROVAL_USER
                                                                        }
                                                                    />
                                                                )}
                                                                {dataReimburse.REIMBURSE_SECOND_APPROVAL_STATUS ===
                                                                    5 && (
                                                                    <BadgeFlat
                                                                        className=" bg-green-100 text-green-700"
                                                                        title="Execute"
                                                                        body={
                                                                            dataReimburse.REIMBURSE_SECOND_APPROVAL_USER
                                                                        }
                                                                    />
                                                                )}
                                                            </>
                                                        }
                                                        className=""
                                                    />
                                                    <TableTD
                                                        value={
                                                            <>
                                                                {dataReimburse.REIMBURSE_THIRD_APPROVAL_STATUS ===
                                                                    "" ||
                                                                    (dataReimburse.REIMBURSE_THIRD_APPROVAL_STATUS ===
                                                                        null && (
                                                                        <span>
                                                                            -
                                                                        </span>
                                                                    ))}
                                                                {dataReimburse.REIMBURSE_THIRD_APPROVAL_STATUS ===
                                                                    1 && (
                                                                    <BadgeFlat
                                                                        className=" bg-gray-200 text-gray-700"
                                                                        title="Request"
                                                                        body={
                                                                            dataReimburse.REIMBURSE_THIRD_APPROVAL_USER
                                                                        }
                                                                    />
                                                                )}
                                                                {dataReimburse.REIMBURSE_THIRD_APPROVAL_STATUS ===
                                                                    2 && (
                                                                    <BadgeFlat
                                                                        className=" bg-green-100 text-green-700"
                                                                        title="Approve"
                                                                        body={
                                                                            dataReimburse.REIMBURSE_THIRD_APPROVAL_USER
                                                                        }
                                                                    />
                                                                )}
                                                                {dataReimburse.REIMBURSE_THIRD_APPROVAL_STATUS ===
                                                                    3 && (
                                                                    <BadgeFlat
                                                                        className=" bg-yellow-300 text-white"
                                                                        title="Need Revision"
                                                                        body={
                                                                            dataReimburse.REIMBURSE_THIRD_APPROVAL_USER
                                                                        }
                                                                    />
                                                                )}
                                                                {dataReimburse.REIMBURSE_THIRD_APPROVAL_STATUS ===
                                                                    4 && (
                                                                    <BadgeFlat
                                                                        className=" bg-red-100 text-red-700"
                                                                        title="Reject"
                                                                        body={
                                                                            dataReimburse.REIMBURSE_THIRD_APPROVAL_USER
                                                                        }
                                                                    />
                                                                )}
                                                            </>
                                                        }
                                                        className=""
                                                    />
                                                    <TableTD
                                                        value={
                                                            <Dropdown
                                                                title="Actions"
                                                                className="text-center"
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
                                                                                    dataReimburse.REIMBURSE_ID
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
                                                                                    dataReimburse.REIMBURSE_ID
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
                                                                                handleRevisedModal(
                                                                                    e,
                                                                                    dataReimburse.REIMBURSE_ID
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
                                                                                    dataReimburse.REIMBURSE_ID
                                                                                )
                                                                            }
                                                                        >
                                                                            Execute
                                                                        </a>
                                                                    </>
                                                                }
                                                            />
                                                        }
                                                    />
                                                </tr>
                                            )
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            links={reimburse.links}
                            fromData={reimburse.from}
                            toData={reimburse.to}
                            totalData={reimburse.total}
                            clickHref={(url: string) =>
                                getReimburse(url.split("?").pop())
                            }
                        />
                    </div>
                </div>
            </div>
            {/* Content End */}
        </AuthenticatedLayout>
    );
}
