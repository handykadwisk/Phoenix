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
import { ArrowDownTrayIcon } from "@heroicons/react/20/solid";
import dateFormat from "dateformat";
import InputSearch from "@/Components/InputSearch";
import Content from "@/Components/Content";
import { ArrowPathIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-tailwindcss-select";
import CurrencyInput from "react-currency-input-field";
import ModalToDocument from "@/Components/Modal/ModalToDocument";
import Input from "@/Components/Input";
import BadgeFlat from "@/Components/BadgeFlat";
import Swal from "sweetalert2";
import AGGrid from "@/Components/AgGrid";

export default function CashAdvance({ auth }: PageProps) {
    useEffect(() => {
        getExpensesApproval();
        getExpensesNotes();
        getExpensesMethod();
        getPaymentType();
        getCurrency();
        getExpensesRequestStatus();
        getExpensesApprove1Status();
        getExpensesApprove2Status();
        // getExpensesApprove3Status();
        getExpensesNeedRevisionStatus();
        getExpensesRejectStatus();
    }, []);

    const handleRefresh = () => {
        getExpensesApproval();
        getExpensesNotes();
        getExpensesMethod();
        getPaymentType();
        getCurrency();
        getExpensesRequestStatus();
        getExpensesApprove1Status();
        getExpensesApprove2Status();
        // getExpensesApprove3Status();
        getExpensesNeedRevisionStatus();
        getExpensesRejectStatus();

        setRefreshSuccess("success");
        setTimeout(() => {
            setRefreshSuccess("");
        }, 1000);
    };

    // Modal Add Start
    const [modal, setModal] = useState<any>({
        add: false,
        detail: false,
        approve: false,
        revised: false,
        execute: false,
    });
    // Modal Add End

    // Modal Add Files Start
    const [modalFilesAdd, setModalFilesAdd] = useState<any>({
        add: false,
        index: "",
    });
    // Modal Add Files End

    // Modal Detail Files Start
    const [modalFilesDetail, setModalFilesDetail] = useState<any>({
        detail: false,
        index: "",
    });
    // Modal Detail Files End

    // Modal Approve Files Start
    const [modalFilesApprove, setModalFilesApprove] = useState<any>({
        approve: false,
        index: "",
    });
    // Modal Approve Files End

    // Modal Revised Files Start
    const [modalFilesRevised, setModalFilesRevised] = useState<any>({
        revised: false,
        index: "",
    });
    // Modal Revised Files End

    // Modal Proof of Document Start
    const [modalProofOfDocument, setModalProofOfDocument] = useState<any>({
        add: false,
    });
    // Modal Proof of Document End

    // Modal Proof of Document Show Start
    const [modalProofOfDocumentDetail, setModalProofOfDocumentDetail] =
        useState<any>({
            detail: false,
        });
    // Modal Proof of Document Show End

    const [data, setData] = useState<any>({
        expenses_requested_date: "",
        expenses_requested_by: "",
        expenses_division: "",
        expenses_branch: "",
        expenses_request_for_approval: "",
        expenses_reff_number: "",
        expenses_request_note: "",
        expenses_method: "",
        expenses_settlement_date: "",
        expenses_total_amount: "",
        proof_of_document: [],
        expensesDetail: [
            {
                expenses_detail_due_date: "",
                expenses_detail_type: "",
                expenses_detail_currency: "",
                expenses_detail_amount_value: "",
                expenses_detail_relation_organization_id: "",
                expenses_detail_cost_classification: "",
                expenses_detail_description: "",
                expenses_detail_document: [],
            },
        ],
    });

    // Handle Success Start
    const [isSuccess, setIsSuccess] = useState<string>("");

    const handleSuccess = (message: string) => {
        setIsSuccess("");
        setData({
            expenses_requested_date: "",
            expenses_requested_by: "",
            expenses_division: "",
            expenses_branch: "",
            expenses_request_for_approval: "",
            expenses_reff_number: "",
            expenses_request_note: "",
            expenses_method: "",
            expenses_settlement_date: "",
            expenses_total_amount: "",
            proof_of_document: [],
            expensesDetail: [
                {
                    expenses_detail_due_date: "",
                    expenses_detail_type: "",
                    expenses_detail_currency: "",
                    expenses_detail_amount_value: "",
                    expenses_detail_relation_organization_id: "",
                    expenses_detail_cost_classification: "",
                    expenses_detail_description: "",
                    expenses_detail_document: [],
                },
            ],
        });

        setIsSuccess(message[0]);
        getExpensesRequestStatus();
        getExpensesApprove1Status();
        getExpensesApprove2Status();
        // getExpensesApprove3Status();
        getExpensesNeedRevisionStatus();
        getExpensesRejectStatus();
        setTimeout(() => {
            setIsSuccess("");
        }, 5000);

        setRefreshSuccess("success");
        setTimeout(() => {
            setRefreshSuccess("");
        }, 1000);
    };
    // Handle Success End

    const [dataById, setDataById] = useState<any>({});

    const handleAddRow = () => {
        setData({
            ...data,
            expensesDetail: [
                ...data.expensesDetail,
                {
                    expenses_detail_due_date: "",
                    expenses_detail_type: 2,
                    expenses_detail_currency: 1,
                    expenses_detail_amount_value: "",
                    expenses_detail_relation_organization_id: "",
                    expenses_detail_cost_classification: "",
                    expenses_detail_description: "",
                    expenses_detail_document: [],
                },
            ],
        });
    };
    // Handle Add Row End

    // Handle Remove Row Start
    const handleRemoveRow = (i: number) => {
        const deleteRow = [...data.expensesDetail];

        deleteRow.splice(i, 1);

        setData({ ...data, expensesDetail: deleteRow });
    };
    // Handle Remove Row End

    // Handle Change Add Start
    const handleChangeRow = (val: any, name: any, i: number) => {
        // const { name, value } = e.target;

        const onchangeVal: any = [...data.expensesDetail];

        onchangeVal[i][name] = val;

        setData({ ...data, expensesDetail: onchangeVal });
    };
    // Handle Change Add End

    const handleAddRowFiles = () => {
        const expensesDetail: any = [...data.expensesDetail];

        expensesDetail[modalFilesAdd.index].expenses_detail_document = [
            ...(expensesDetail[modalFilesAdd.index].expenses_detail_document ||
                []),
            {
                expenses_detail_document: "",
            },
        ];

        setData({
            ...data,
            expensesDetail: expensesDetail,
        });
    };

    // Handle Add Row Files Start
    const handleChangeAddFiles = (e: any, i: number) => {
        const { name, files } = e.target;

        const onchangeFileData: any = [...data.expensesDetail];

        onchangeFileData[modalFilesAdd.index][name][i] = files[0];

        setData({ ...data, expensesDetail: onchangeFileData });
    };
    // Handle Add Row Files End

    // Handle Remove Files Row Start
    const handleRemoveFilesRow = (i: number) => {
        const deleteFilesData: any = [...data.expensesDetail];

        deleteFilesData[modalFilesAdd.index].expenses_detail_document.splice(
            i,
            1
        );

        setData({ ...data, expensesDetail: deleteFilesData });
    };
    // Handle Remove Files Row End

    // Handle Change Approval Start
    const handleChangeApproval = (val: any, name: any, i: number) => {
        const onchangeVal = [...dataById.expenses_detail];

        onchangeVal[i][name] = val;

        const ExpensesDetailAmountApprove = [...onchangeVal];

        ExpensesDetailAmountApprove[i]["EXPENSES_DETAIL_AMOUNT_VALUE_APPROVE"] =
            onchangeVal[i]["EXPENSES_DETAIL_AMOUNT_VALUE"];

        if (parseInt(val, 10) === 1) {
            setDataById({
                ...dataById,
                expenses_detail: ExpensesDetailAmountApprove,
            });
        } else {
            onchangeVal[i]["EXPENSES_DETAIL_AMOUNT_VALUE_APPROVE"] = 0;
            setDataById({
                ...dataById,
                expenses_detail: onchangeVal,
            });
        }

        setDataById({
            ...dataById,
            expenses_detail: onchangeVal,
        });
    };
    // Handle Change Approval End

    // Handle Change Approve Start
    const handleChangeApprove = (val: any, name: any, i: number) => {
        const onchangeVal: any = [...dataById.expenses_detail];

        onchangeVal[i][name] = val;

        setDataById({ ...dataById, expenses_detail: onchangeVal });
    };
    // Handle Change Approve End

    // Handle Add Row Revised Start
    const handleAddRowRevised = () => {
        setDataById({
            ...dataById,
            expenses_detail: [
                ...dataById.expenses_detail,
                {
                    EXPENSES_DETAIL_AMOUNT_VALUE: "",
                    EXPENSES_DETAIL_AMOUNT_VALUE_APPROVE: "",
                    EXPENSES_DETAIL_APPROVAL: "",
                    EXPENSES_DETAIL_COST_CLASSIFICATION: "",
                    EXPENSES_DETAIL_CURRENCY: 1,
                    EXPENSES_DETAIL_DESCRIPTION: "",
                    EXPENSES_DETAIL_DUE_DATE: "",
                    EXPENSES_DETAIL_ID: "",
                    EXPENSES_DETAIL_REFF_NUMBER: "",
                    EXPENSES_DETAIL_RELATION_ORGANIZATION_ID: "",
                    EXPENSES_DETAIL_REMARKS: "",
                    EXPENSES_DETAIL_TYPE: 2,
                    EXPENSES_ID: "",
                },
            ],
        });
    };
    // Handle Add Row Revised End

    // Handle Change Revised Start
    const handleChangeRevised = (val: any, name: any, i: number) => {
        const onchangeVal: any = [...dataById.expenses_detail];

        onchangeVal[i][name] = val;

        setDataById({ ...dataById, expenses_detail: onchangeVal });
    };
    // Handle Change Revised End

    // Handle Remove Row Revised Start
    const handleRemoveRowRevised = (i: number, expenses_detail_id: number) => {
        const deleteRow = [...dataById.expenses_detail];

        deleteRow.splice(i, 1);

        setDataById({
            ...dataById,
            expenses_detail: deleteRow,
            deletedRow: [
                ...(dataById.deletedRow || []),
                {
                    EXPENSES_DETAIL_ID: expenses_detail_id,
                },
            ],
        });
    };
    // Handle Remove Row Revised End

    // Handle Add Row Revised Files Start
    const handleAddRowRevisedFiles = (expenses_detail_id: number) => {
        const addFiles = [...dataById.expenses_detail];

        addFiles[modalFilesRevised.index].filesDocument = [
            ...(addFiles[modalFilesRevised.index].filesDocument || []),
            {
                EXPENSES_DETAIL_DOCUMENT: "",
                EXPENSES_DETAIL_ID: expenses_detail_id,
            },
        ];

        setDataById({
            ...dataById,
            expenses_detail: addFiles,
        });
    };
    // Handle Add Row Revised Files End

    // Handle Change Revised Files Start
    const handleChangeRevisedFiles = (e: any, i: number) => {
        const { name, files } = e.target;

        const onchangeFileData: any = [...dataById.expenses_detail];

        onchangeFileData[modalFilesRevised.index].filesDocument[i][name] =
            files[0];

        setDataById({ ...dataById, expenses_detail: onchangeFileData });
    };
    // Handle Change Revised Files End

    // Handle Remove Row Revised Files Start
    const handleRemoveRowRevisedFiles = (i: number) => {
        const deleteRow = [...dataById.expenses_detail];

        deleteRow[modalFilesRevised.index].filesDocument.splice(i, 1);

        setDataById({ ...dataById, expenses_detail: deleteRow });
    };
    // Handle Remove Row Revised Files End

    // Handle Remove Row Revised Show Files Start
    const handleRemoveRowRevisedShowFiles = (
        i: number,
        document_id: number,
        expenses_detail_id: number
    ) => {
        const deleteRow = [...dataById.expenses_detail];

        deleteRow[modalFilesRevised.index].m_expenses_document.splice(i, 1);

        setDataById({
            ...dataById,
            expenses_detail: deleteRow,
            deletedDocument: [
                ...(dataById.deletedDocument || []),
                {
                    DOCUMENT_ID: document_id,
                    EXPENSES_DETAIL_ID: expenses_detail_id,
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
    const [searchExpenses, setSearchExpenses] = useState<any>({
        expenses_search: [
            {
                EXPENSES_ID: "",
                EXPENSES_NUMBER: "",
                EXPENSES_VENDOR: "",
                EXPENSES_REQUESTED_BY: "",
                EXPENSES_DIVISION: "",
                EXPENSES_START_DATE: "",
                EXPENSES_END_DATE: "",
                EXPENSES_DETAIL_TYPE: "",
                EXPENSES_APPROVAL_STATUS: "",
                flag: "flag",
            },
        ],
    });

    // console.log("Search", searchExpenses);
    // Search End

    // OnChange Input Search Start
    const inputDataSearch = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...searchExpenses.expenses_search];
        changeVal[i][name] = value;
        setSearchExpenses({
            ...searchExpenses,
            expenses_search: changeVal,
        });
    };
    // OnChange Input Search End

    // Clear Search Start
    const clearSearchExpenses = () => {
        inputDataSearch("EXPENSES_ID", "", 0);
        inputDataSearch("EXPENSES_NUMBER", "", 0);
        inputDataSearch("EXPENSES_VENDOR", "", 0);
        inputDataSearch("EXPENSES_REQUESTED_BY", "", 0);
        inputDataSearch("EXPENSES_DIVISION", "", 0);
        inputDataSearch("EXPENSES_START_DATE", "", 0);
        inputDataSearch("EXPENSES_END_DATE", "", 0);
        inputDataSearch("EXPENSES_DETAIL_TYPE", "", 0);
        inputDataSearch("EXPENSES_APPROVAL_STATUS", "", 0);
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

    // Handle Add Start
    const handleAddModal = () => {
        setData({
            ...data,
            expenses_division:
                auth.user.employee?.division?.COMPANY_DIVISION_ID,
            expenses_requested_by: auth.user.employee?.EMPLOYEE_ID,
            expensesDetail: [
                {
                    expenses_detail_due_date: "",
                    expenses_detail_type: 2,
                    expenses_detail_currency: 1,
                    expenses_detail_amount_value: "",
                    expenses_detail_relation_organization_id: "",
                    expenses_detail_cost_classification: "",
                    expenses_detail_description: "",
                    expenses_detail_document: [],
                },
            ],
        });

        setModal({
            add: !modal.add,
            detail: false,
            approve: false,
            revised: false,
            execute: false,
        });
    };
    // Handle Add End

    // Handle Approve Start
    const handleApproveModal = async (e: FormEvent, id: number) => {
        e.preventDefault();

        await axios
            .get(`/getExpensesById/${id}`)
            .then((res) => {
                setDataById(res.data);
                // console.log(res.data);
            })
            .catch((err) => console.log(err));

        setModal({
            add: false,
            detail: false,
            approve: !modal.approve,
            revised: false,
            execute: false,
        });
    };
    // Handle Approve End

    // Handle Revised Start
    const handleRevisedModal = async (e: FormEvent, id: number) => {
        e.preventDefault();

        await axios
            .get(`/getExpensesById/${id}`)
            .then((res) => {
                setDataById(res.data);
                // console.log(res.data);
            })
            .catch((err) => console.log(err));

        setModal({
            add: false,
            detail: false,
            approve: false,
            revised: !modal.revised,
            execute: false,
        });
    };
    // Handle Revised End

    // Handle Execute Start
    const handleExecuteModal = async (e: FormEvent, id: number) => {
        e.preventDefault();

        await axios
            .get(`/getExpensesById/${id}`)
            .then((res) => {
                setDataById(res.data);
                // console.log(res.data);
            })
            .catch((err) => console.log(err));

        setData({
            ...data,
            expenses_id: id,
        });

        setModal({
            add: false,
            detail: false,
            approve: false,
            revised: false,
            execute: !modal.execute,
        });
    };
    // Handle Execute End

    // Handle Show Start
    const handleShowModal = async (data: any) => {
        await axios
            .get(`/getExpensesById/${data.EXPENSES_ID}`)
            .then((res) => {
                setDataById(res.data);
                // console.log(res.data);
            })
            .catch((err) => console.log(err));

        setModal({
            add: false,
            detail: !modal.detail,
            approve: false,
            revised: false,
            execute: false,
        });
    };
    // Handle Show End

    const handleBtnStatus = (status: number) => {
        setDataById({
            ...dataById,
            EXPENSES_FIRST_APPROVAL_STATUS: status,
        });

        if (auth.user.employee?.division?.COMPANY_DIVISION_ID === 122) {
            setDataById({
                ...dataById,
                EXPENSES_SECOND_APPROVAL_BY: auth.user.employee?.EMPLOYEE_ID,
                EXPENSES_SECOND_APPROVAL_USER:
                    auth.user.employee?.EMPLOYEE_FIRST_NAME,
                EXPENSES_SECOND_APPROVAL_STATUS: status,
            });
        }
    };

    const handleFileDownload = async (
        expenses_detail_id: number,
        document_id: number
    ) => {
        await axios({
            url: `/expensesDownload/${expenses_detail_id}/${document_id}`,
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
        expenses_id: number,
        document_id: number
    ) => {
        await axios({
            url: `/expensesProofOfDocumentDownload/${expenses_id}/${document_id}`,
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

    const [getCountExpensesRequestStatus, setCountExpensesRequestStatus] =
        useState<any>([]);
    const getExpensesRequestStatus = async () => {
        await axios
            .get(`/getCountExpensesRequestStatus`)
            .then((res) => {
                setCountExpensesRequestStatus(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [getCountExpensesApprove1Status, setCountExpensesApprove1Status] =
        useState<any>([]);
    const getExpensesApprove1Status = async () => {
        await axios
            .get(`/getCountExpensesApprove1Status`)
            .then((res) => {
                setCountExpensesApprove1Status(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [getCountExpensesApprove2Status, setCountExpensesApprove2Status] =
        useState<any>([]);
    const getExpensesApprove2Status = async () => {
        await axios
            .get(`/getCountExpensesApprove2Status`)
            .then((res) => {
                setCountExpensesApprove2Status(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [
        getCountExpensesNeedRevisionStatus,
        setCountExpensesNeedRevisionStatus,
    ] = useState<any>([]);
    const getExpensesNeedRevisionStatus = async () => {
        await axios
            .get(`/getCountExpensesNeedRevisionStatus`)
            .then((res) => {
                setCountExpensesNeedRevisionStatus(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [getCountExpensesRejectStatus, setCountExpensesRejectStatus] =
        useState<any>([]);
    const getExpensesRejectStatus = async () => {
        await axios
            .get(`/getCountExpensesRejectStatus`)
            .then((res) => {
                setCountExpensesRejectStatus(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [ExpensesApproval, setExpensesApproval] = useState<any>([]);
    const getExpensesApproval = async () => {
        await axios
            .get(`/getExpensesApproval`)
            .then((res) => {
                setExpensesApproval(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [ExpensesNotes, setExpensesNotes] = useState<any>([]);
    const getExpensesNotes = async () => {
        await axios
            .get(`/getExpensesNotes`)
            .then((res) => {
                setExpensesNotes(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [ExpensesMethod, setExpensesMethod] = useState<any>([]);
    const getExpensesMethod = async () => {
        await axios
            .get(`/getExpensesMethod`)
            .then((res) => {
                setExpensesMethod(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [PaymentType, setPaymentType] = useState<any>([]);
    const getPaymentType = async () => {
        await axios
            .get(`/getPaymentType`)
            .then((res) => {
                setPaymentType(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [Currency, setCurrency] = useState<any>([]);
    const getCurrency = async () => {
        await axios
            .get(`/getCurrency`)
            .then((res) => {
                setCurrency(res.data);
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

        data.expensesDetail.forEach((item: any) => {
            const amount = Number(item.expenses_detail_amount_value);

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
            setData({
                ...data,
                expenses_total_amount: totalAmount,
            });
        }
    }, [totalAmount]);

    // Start get data expenses revised total amount
    const [revisedTotalAmount, setRevisedTotalAmount] = useState(0);
    useEffect(() => {
        let newRevisedTotalAmount = 0;

        dataById.expenses_detail?.forEach((item: any) => {
            const revisedAmount = Number(item.EXPENSES_DETAIL_AMOUNT_VALUE);

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
                EXPENSES_TOTAL_AMOUNT: revisedTotalAmount,
            });
        }
    }, [revisedTotalAmount]);
    // End get data expenses revised total amount

    // Start get data expenses approve total amount
    const [approveTotalAmount, setApproveTotalAmount] = useState(0);
    useEffect(() => {
        let newApproveTotalAmount = 0;

        dataById.expenses_detail?.forEach((item: any) => {
            const approveAmount = Number(
                item.EXPENSES_DETAIL_AMOUNT_VALUE_APPROVE
            );

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
                EXPENSES_TOTAL_AMOUNT_APPROVE: approveTotalAmount,
            });
        }
    }, [approveTotalAmount]);
    // End get data expenses approve total amount

    useEffect(() => {
        const difference =
            dataById.EXPENSES_TOTAL_AMOUNT_APPROVE -
            dataById.EXPENSES_TOTAL_AMOUNT;

        if (difference < 0) {
            setDataById({ ...dataById, EXPENSES_TYPE: 1 });
        } else {
            setDataById({ ...dataById, EXPENSES_TYPE: 2 });
        }
    }, [
        dataById.EXPENSES_TOTAL_AMOUNT_APPROVE,
        dataById.EXPENSES_TOTAL_AMOUNT,
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
                m.DIVISION_ID === data.expenses_cost_center?.value &&
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
        ?.filter(
            (m: any) =>
                // data.expenses_cost_center?.value === 138
                //     ? m.DIVISION_ID === 123
                //     : m.DIVISION_ID === data.expenses_cost_center?.value &&
                //       (m.STRUCTURE_ID === 107 || m.STRUCTURE_ID === 108) &&
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

    const selectOperationalPayment = PaymentType?.map((query: any) => {
        return {
            value: query.PAYMENT_TYPE_ID,
            label: query.PAYMENT_TYPE_NAME,
        };
    });

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

    // console.log("Data", data);
    // console.log(DataRow);
    // console.log(" Expenses", expenses.data);
    // console.log("Data By Id", dataById);

    return (
        <AuthenticatedLayout user={auth.user} header={"Expenses"}>
            <Head title=" Expenses" />

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
                        detail: false,
                        approve: false,
                        revised: false,
                        execute: false,
                    })
                }
                title={"Add Expenses"}
                url={`/expensesCreate`}
                data={data}
                onSuccess={handleSuccess}
                buttonAddOns={null}
                body={
                    <>
                        <ModalToDocument
                            classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 min-w-[100%] md:min-w-[70%] lg:min-w-[35%]`}
                            show={modalFilesAdd.add}
                            closeable={true}
                            onClose={() =>
                                setModalFilesAdd({
                                    add: false,
                                    index: "",
                                })
                            }
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
                                        {data.expensesDetail[
                                            modalFilesAdd.index
                                        ]?.expenses_detail_document.map(
                                            (file: any, i: number) => (
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
                                                        {file.name ? (
                                                            <p>{file.name}</p>
                                                        ) : (
                                                            <Input
                                                                name="expenses_detail_document"
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
                                                        onClick={() =>
                                                            handleRemoveFilesRow(
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
                                        onClick={handleAddRowFiles}
                                    >
                                        + Add Row
                                    </button>
                                </>
                            }
                        />
                        <div className="grid md:grid-cols-2 gap-4 my-5">
                            <div className="w-full mb-1">
                                <InputLabel
                                    htmlFor="expenses_requested_by"
                                    value="Applicant"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="expenses_requested_by"
                                    type="text"
                                    name="expenses_requested_by"
                                    value={
                                        auth.user.employee?.EMPLOYEE_FIRST_NAME
                                    }
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className="w-full mb-1">
                                <InputLabel
                                    htmlFor="expenses_division"
                                    value="Division"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="expenses_division"
                                    type="text"
                                    name="expenses_division"
                                    value={
                                        auth.user.employee?.division
                                            ?.COMPANY_DIVISION_ALIAS
                                    }
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                            {/* <div className="w-full mb-1">
                                <InputLabel
                                    htmlFor="expenses_cost_center"
                                    className="mb-2"
                                >
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
                                    value={data.expenses_cost_center}
                                    onChange={(val: any) =>
                                        setData({
                                            ...data,
                                            expenses_cost_center: val,
                                        })
                                    }
                                    primaryColor={"bg-red-500"}
                                />
                            </div>
                            <div className="w-full mb-1">
                                <InputLabel
                                    htmlFor="expenses_used_by"
                                    className="mb-2"
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
                                    options={selectEmployee}
                                    isSearchable={true}
                                    placeholder={"Choose Used By"}
                                    value={data.expenses_used_by}
                                    onChange={(val: any) =>
                                        setData({
                                            ...data,
                                            expenses_used_by: val,
                                        })
                                    }
                                    primaryColor={"bg-red-500"}
                                />
                            </div> */}
                            <div className="w-full mb-1">
                                <InputLabel
                                    htmlFor="expenses_branch"
                                    className="mb-2"
                                >
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
                                    value={data.expenses_branch}
                                    onChange={(val: any) =>
                                        setData({
                                            ...data,
                                            expenses_branch: val,
                                        })
                                    }
                                    primaryColor={"bg-red-500"}
                                />
                            </div>
                            <div className="w-full mb-1">
                                <InputLabel
                                    htmlFor="namaPemberiApproval"
                                    className="mb-2"
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
                                    value={data.expenses_request_for_approval}
                                    onChange={(val: any) =>
                                        setData({
                                            ...data,
                                            expenses_request_for_approval: val,
                                        })
                                    }
                                    primaryColor={"bg-red-500"}
                                />
                            </div>
                            <div className="w-full mb-1">
                                <InputLabel
                                    htmlFor="expenses_reff_number"
                                    value="Reff Number"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="expenses_reff_number"
                                    type="text"
                                    name="expenses_reff_number"
                                    value={data.expenses_reff_number}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            expenses_reff_number:
                                                e.target.value,
                                        })
                                    }
                                    autoComplete="off"
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
                                            className="border px-3 py-2"
                                            rowSpan="2"
                                        />
                                        <TH className="border px-3 py-2">
                                            Due Date
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH className="border px-3 py-2">
                                            Type{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH className="border px-3 py-2">
                                            Currency
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH className="border px-3 py-2">
                                            Value
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH className="border px-3 py-2">
                                            Paid To
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH className="border px-3 py-2">
                                            Cost Classification
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH className="border px-3 py-2">
                                            Description
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH className="border px-3 py-2">
                                            Document
                                        </TH>
                                        {data.expensesDetail.length > 1 && (
                                            <TH
                                                label="Action"
                                                className="border px-3"
                                                rowSpan="2"
                                            />
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.expensesDetail?.map(
                                        (ed: any, i: number) => (
                                            <tr className="text-center" key={i}>
                                                <TD className="border">
                                                    {i + 1}
                                                </TD>
                                                <TD className="border">
                                                    <div className="w-48">
                                                        <DatePicker
                                                            name="expenses_detail_due_date"
                                                            selected={
                                                                ed.expenses_detail_due_date
                                                            }
                                                            onChange={(
                                                                date: any
                                                            ) =>
                                                                handleChangeRow(
                                                                    date.toLocaleDateString(
                                                                        "en-CA"
                                                                    ),
                                                                    "expenses_detail_due_date",
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
                                                    </div>
                                                </TD>
                                                <TD className="border">
                                                    <div className="w-56">
                                                        <select
                                                            id="expenses_detail_type"
                                                            name="expenses_detail_type"
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                            value={
                                                                ed.expenses_detail_type
                                                            }
                                                            onChange={(val) =>
                                                                handleChangeRow(
                                                                    val.target
                                                                        .value,
                                                                    "expenses_detail_type",
                                                                    i
                                                                )
                                                            }
                                                        >
                                                            {PaymentType?.map(
                                                                (type: any) => (
                                                                    <option
                                                                        key={
                                                                            type.PAYMENT_TYPE_ID
                                                                        }
                                                                        value={
                                                                            type.PAYMENT_TYPE_ID
                                                                        }
                                                                    >
                                                                        {
                                                                            type.PAYMENT_TYPE_NAME
                                                                        }
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                    </div>
                                                </TD>
                                                <TD className="border">
                                                    <div className="w-56">
                                                        <select
                                                            id="expenses_detail_currency"
                                                            name="expenses_detail_currency"
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                            value={
                                                                ed.expenses_detail_currency
                                                            }
                                                            onChange={(val) =>
                                                                handleChangeRow(
                                                                    val.target
                                                                        .value,
                                                                    "expenses_detail_currency",
                                                                    i
                                                                )
                                                            }
                                                        >
                                                            {Currency?.map(
                                                                (
                                                                    currency: any
                                                                ) => (
                                                                    <option
                                                                        key={
                                                                            currency.CURRENCY_ID
                                                                        }
                                                                        value={
                                                                            currency.CURRENCY_ID
                                                                        }
                                                                    >
                                                                        {
                                                                            currency.CURRENCY_SYMBOL
                                                                        }
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                    </div>
                                                </TD>
                                                <TD className="border">
                                                    <div className="w-56">
                                                        <CurrencyInput
                                                            id="expenses_detail_amount_value"
                                                            name="expenses_detail_amount_value"
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            value={
                                                                ed.expenses_detail_amount_value
                                                            }
                                                            onValueChange={(
                                                                val: any
                                                            ) =>
                                                                handleChangeRow(
                                                                    val,
                                                                    "expenses_detail_amount_value",
                                                                    i
                                                                )
                                                            }
                                                            className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right`}
                                                            placeholder="0.00"
                                                            autoComplete="off"
                                                            required
                                                        />
                                                    </div>
                                                </TD>
                                                <TD className="border">
                                                    <Select
                                                        classNames={{
                                                            menuButton: () =>
                                                                `flex w-96 text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400 ring-1 ring-gray-300`,
                                                            menu: "absolute w-96 text-left z-20 bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
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
                                                            "Choose Paid To"
                                                        }
                                                        value={
                                                            ed.expenses_detail_relation_organization_id
                                                        }
                                                        onChange={(val: any) =>
                                                            handleChangeRow(
                                                                val,
                                                                "expenses_detail_relation_organization_id",
                                                                i
                                                            )
                                                        }
                                                        primaryColor="bg-red-500"
                                                    />
                                                </TD>
                                                <TD>
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
                                                        value={
                                                            ed.expenses_detail_cost_classification
                                                        }
                                                        onChange={(val: any) =>
                                                            handleChangeRow(
                                                                val,
                                                                "expenses_detail_cost_classification",
                                                                i
                                                            )
                                                        }
                                                        primaryColor={
                                                            "bg-red-500"
                                                        }
                                                    />
                                                </TD>
                                                <TD className="border">
                                                    <div className="w-96">
                                                        <TextInput
                                                            id="expenses_detail_description"
                                                            type="text"
                                                            name="expenses_detail_description"
                                                            value={
                                                                ed.expenses_detail_description
                                                            }
                                                            className="w-1/2"
                                                            onChange={(val) =>
                                                                handleChangeRow(
                                                                    val.target
                                                                        .value,
                                                                    "expenses_detail_description",
                                                                    i
                                                                )
                                                            }
                                                            autoComplete="off"
                                                            required
                                                        />
                                                    </div>
                                                </TD>
                                                <TD className="border">
                                                    <button
                                                        type="button"
                                                        className="w-full bg-black hover:bg-slate-800 text-sm py-2 px-3 text-white"
                                                        onClick={() => {
                                                            setModalFilesAdd({
                                                                add: true,
                                                                index: i,
                                                            });
                                                        }}
                                                    >
                                                        {ed
                                                            .expenses_detail_document
                                                            ?.length > 0
                                                            ? ed
                                                                  ?.expenses_detail_document
                                                                  .length +
                                                              " Files"
                                                            : "Add Files"}
                                                    </button>
                                                </TD>
                                                {data.expensesDetail.length >
                                                    1 && (
                                                    <TD className="border">
                                                        <Button
                                                            className="px-3 py-1 bg-red-600 hover:bg-red-500"
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
                                                onClick={handleAddRow}
                                                type="button"
                                            >
                                                + Add Row
                                            </Button>
                                        </TD>
                                        <TD
                                            className="text-right pr-5 font-bold"
                                            colSpan={2}
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

                        <div className="w-full mt-10">
                            <InputLabel
                                htmlFor="expenses_request_note"
                                value="Note"
                                className="mb-2"
                            />
                            <Textarea
                                id="expenses_request_note"
                                name="expenses_request_note"
                                className="resize-none border-0 focus:ring-2 focus:ring-inset focus:ring-red-600 bg-white"
                                rows={5}
                                value={data.expenses_request_note}
                                onChange={(val) =>
                                    setData({
                                        ...data,
                                        expenses_request_note: val.target.value,
                                    })
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
                show={modal.detail}
                closeable={true}
                onClose={() =>
                    setModal({
                        add: false,
                        detail: false,
                        approve: false,
                        revised: false,
                        execute: false,
                    })
                }
                title="Expenses Detail"
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
                            show={modalFilesDetail.detail}
                            closeable={true}
                            onClose={() =>
                                setModalFilesDetail({
                                    detail: false,
                                    index: "",
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
                                        {dataById.expenses_detail?.[
                                            modalFilesDetail.index
                                        ]?.m_expenses_document.map(
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
                                                            href={`/expensesDocReader/${
                                                                dataById
                                                                    .expenses_detail?.[
                                                                    modalFilesDetail
                                                                        .index
                                                                ]
                                                                    .EXPENSES_DETAIL_ID
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
                                                                    .expenses_detail?.[
                                                                    modalFilesDetail
                                                                        .index
                                                                ]
                                                                    .EXPENSES_DETAIL_ID,
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
                            show={modalProofOfDocumentDetail.detail}
                            closeable={true}
                            onClose={() =>
                                setModalProofOfDocumentDetail({
                                    detail: false,
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
                                        {dataById.m_expenses_proof_of_document?.map(
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
                                                            href={`/expensesDocReader/${dataById.EXPENSES_ID}/${file?.document.DOCUMENT_ID}`}
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
                                                                dataById.EXPENSES_ID,
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
                        <div className="grid md:grid-cols-2 my-5">
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="expenses_number"
                                    value="Expenses Number"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="expenses_number"
                                    type="text"
                                    name="expenses_number"
                                    value={dataById.EXPENSES_NUMBER}
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="expenses_requested_date"
                                    value="Request Date"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="expenses_requested_date"
                                    type="text"
                                    name="expenses_requested_date"
                                    value={dateFormat(
                                        dataById.EXPENSES_REQUETED_DATE,
                                        "dd-mm-yyyy"
                                    )}
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="expenses_requested_by"
                                    value="Applicant"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="expenses_requested_by"
                                    type="text"
                                    name="expenses_requested_by"
                                    value={
                                        dataById.employee?.EMPLOYEE_FIRST_NAME
                                    }
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="expenses_division"
                                    value="Division"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="expenses_division"
                                    type="text"
                                    name="expenses_division"
                                    value={
                                        dataById.employee?.division
                                            ?.COMPANY_DIVISION_ALIAS
                                    }
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="expenses_branch"
                                    value="Branch"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="expenses_branch"
                                    type="text"
                                    name="expenses_branch"
                                    value={
                                        dataById.office?.COMPANY_OFFICE_ALIAS
                                    }
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="expenses_request_for_approval"
                                    value="Request for Approval"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="expenses_request_for_approval"
                                    type="text"
                                    name="expenses_request_for_approval"
                                    value={
                                        dataById.employee_approval
                                            ?.EMPLOYEE_FIRST_NAME
                                    }
                                    className="bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="expenses_reff_number"
                                    value="Reff Number"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="expenses_reff_number"
                                    type="text"
                                    name="expenses_reff_number"
                                    value={
                                        dataById?.EXPENSES_REFF_NUMBER
                                            ? dataById?.EXPENSES_REFF_NUMBER
                                            : "-"
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
                                            className="border w-10 px-3 py-2"
                                            rowSpan="2"
                                        />
                                        <TH className="border px-3 py-2">
                                            Due Date
                                        </TH>
                                        <TH className="border px-3 py-2">
                                            Type
                                        </TH>
                                        <TH className="border px-3 py-2">
                                            Currency
                                        </TH>
                                        <TH className="border px-3 py-2">
                                            Value
                                        </TH>
                                        <TH className="border px-3 py-2">
                                            Paid To
                                        </TH>
                                        <TH className="border px-3 py-2">
                                            Cost Classification
                                        </TH>
                                        <TH className="border px-3 py-2">
                                            Description
                                        </TH>
                                        <TH className="border px-3 py-2">
                                            Document
                                        </TH>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataById.expenses_detail?.map(
                                        (ed: any, i: number) => (
                                            <tr
                                                className="text-center text-gray-700 text-sm"
                                                key={i}
                                            >
                                                <TD className="border w-10 px-3 py-2">
                                                    {i + 1}.
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {dateFormat(
                                                        ed.EXPENSES_DETAIL_DATE,
                                                        "dd-mm-yyyy"
                                                    )}
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {
                                                        ed.payment_type
                                                            ?.PAYMENT_TYPE_NAME
                                                    }
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {
                                                        ed.currency
                                                            ?.CURRENCY_SYMBOL
                                                    }
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {formatCurrency.format(
                                                        ed.EXPENSES_DETAIL_AMOUNT_VALUE
                                                    )}
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {ed.relation_organization
                                                        ? ed
                                                              .relation_organization
                                                              .RELATION_ORGANIZATION_ALIAS
                                                        : "-"}
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {ed.cost_classification
                                                        ? ed.cost_classification
                                                              ?.COA_CODE +
                                                          " - " +
                                                          ed.cost_classification
                                                              ?.COA_TITLE
                                                        : "-"}
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {ed.EXPENSES_DETAIL_DESCRIPTION
                                                        ? ed.EXPENSES_DETAIL_DESCRIPTION
                                                        : "-"}
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {ed?.m_expenses_document
                                                        ?.length > 0 ? (
                                                        <button
                                                            type="button"
                                                            className="bg-black hover:bg-slate-800 text-sm text-white py-2 px-3"
                                                            onClick={() => {
                                                                setModalFilesDetail(
                                                                    {
                                                                        detail: true,
                                                                        index: i,
                                                                    }
                                                                );
                                                            }}
                                                        >
                                                            {ed
                                                                ?.m_expenses_document
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
                                            colSpan={4}
                                        >
                                            TOTAL AMOUNT
                                        </TD>
                                        <TD className="border px-3 py-2 font-bold">
                                            {formatCurrency.format(
                                                dataById.EXPENSES_TOTAL_AMOUNT
                                            )}
                                        </TD>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        {/* Table form end */}

                        <div className="grid md:grid-cols-2 my-5">
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
                                {dataById.m_expenses_proof_of_document?.length >
                                0 ? (
                                    <button
                                        type="button"
                                        className="bg-black hover:bg-slate-800 text-sm text-white py-2 px-3"
                                        onClick={() => {
                                            setModalProofOfDocumentDetail({
                                                detail: true,
                                            });
                                        }}
                                    >
                                        {dataById.m_expenses_proof_of_document
                                            ?.length + " Files"}
                                    </button>
                                ) : (
                                    "-"
                                )}
                            </div>
                        </div>

                        <div className="w-full p-2">
                            <InputLabel
                                htmlFor="expenses_request_note"
                                value="Note"
                                className="mb-2"
                            />
                            <Textarea
                                id="expenses_request_note"
                                name="expenses_request_note"
                                className="resize-none border-0 focus:ring-2 focus:ring-inset focus:ring-red-600"
                                rows={5}
                                value={dataById.EXPENSES_REQUEST_NOTE || ""}
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
                                                            dataById.EXPENSES_CREATED_AT,
                                                            "dd-mm-yyyy"
                                                        )}
                                                    </time>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                {dataById.EXPENSES_FIRST_APPROVAL_STATUS ===
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
                                                                dataById.EXPENSES_FIRST_APPROVAL_CHANGE_STATUS_DATE,
                                                                "dd-mm-yyyy"
                                                            )}
                                                        </time>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                )}
                                {dataById.EXPENSES_SECOND_APPROVAL_STATUS !==
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
                                                                dataById.EXPENSES_SECOND_APPROVAL_CHANGE_STATUS_DATE,
                                                                "dd-mm-yyyy"
                                                            )}
                                                        </time>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                )}
                                {dataById.EXPENSES_SECOND_APPROVAL_STATUS ===
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
                                                                dataById.EXPENSES_SECOND_APPROVAL_CHANGE_STATUS_DATE,
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
                        detail: false,
                        approve: false,
                        revised: false,
                        execute: false,
                    })
                }
                title="Approve Expenses"
                url={`/expensesApprove`}
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
                            show={modalFilesApprove.approve}
                            closeable={true}
                            onClose={() =>
                                setModalFilesApprove({
                                    approve: false,
                                    index: "",
                                })
                            }
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
                                        {dataById.expenses_detail?.[
                                            modalFilesApprove.index
                                        ]?.m_expenses_document.map(
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
                                                            href={`/expensesDocReader/${
                                                                dataById
                                                                    .expenses_detail?.[
                                                                    modalFilesApprove
                                                                        .index
                                                                ]
                                                                    .EXPENSES_DETAIL_ID
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
                                                                    .expenses_detail?.[
                                                                    modalFilesApprove
                                                                        .index
                                                                ]
                                                                    .EXPENSES_DETAIL_ID,
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
                                    value="Expenses Number"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="cashAdvanceNumber"
                                    type="text"
                                    name="cashAdvanceNumber"
                                    value={dataById.EXPENSES_NUMBER}
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
                                        dataById.EXPENSES_REQUETED_DATE,
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
                                        dataById.employee?.division
                                            ?.COMPANY_DIVISION_ALIAS
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
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="expenses_reff_number"
                                    value="Reff Number"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="expenses_reff_number"
                                    type="text"
                                    name="expenses_reff_number"
                                    value={
                                        dataById?.EXPENSES_REFF_NUMBER
                                            ? dataById?.EXPENSES_REFF_NUMBER
                                            : "-"
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
                                            className="border w-10 px-3 py-2"
                                            rowSpan="2"
                                        />
                                        <TH className="border px-3 py-2">
                                            Due Date
                                        </TH>
                                        <TH className="border px-3 py-2">
                                            Type
                                        </TH>
                                        <TH className="border px-3 py-2">
                                            Currency
                                        </TH>
                                        <TH className="border px-3 py-2">
                                            Value
                                        </TH>
                                        <TH className="border px-3 py-2">
                                            Paid To
                                        </TH>
                                        <TH
                                            className="border px-3 py-2"
                                            rowSpan="2"
                                        >
                                            Cost Classification
                                        </TH>
                                        <TH className="border px-3 py-2">
                                            Description
                                        </TH>
                                        <TH className="border px-3 py-2">
                                            Document
                                        </TH>
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
                                </thead>
                                <tbody>
                                    {dataById.expenses_detail?.map(
                                        (ed: any, i: number) => (
                                            <tr
                                                className="text-center text-gray-700 text-sm leading-7"
                                                key={i}
                                            >
                                                <TD className="border w-10">
                                                    {i + 1}.
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {dateFormat(
                                                        ed.EXPENSES_DETAIL_DATE,
                                                        "dd-mm-yyyy"
                                                    )}
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {
                                                        ed.payment_type
                                                            ?.PAYMENT_TYPE_NAME
                                                    }
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {
                                                        ed.currency
                                                            ?.CURRENCY_SYMBOL
                                                    }
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {formatCurrency.format(
                                                        ed.EXPENSES_DETAIL_AMOUNT_VALUE
                                                    )}
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {ed.relation_organization
                                                        ? ed
                                                              .relation_organization
                                                              .RELATION_ORGANIZATION_ALIAS
                                                        : "-"}
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {ed.cost_classification
                                                        ? ed.cost_classification
                                                              ?.COA_CODE +
                                                          " - " +
                                                          ed.cost_classification
                                                              ?.COA_TITLE
                                                        : "-"}
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {ed.EXPENSES_DETAIL_DESCRIPTION
                                                        ? ed.EXPENSES_DETAIL_DESCRIPTION
                                                        : "-"}
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {ed?.m_expenses_document
                                                        ?.length > 0 ? (
                                                        <button
                                                            type="button"
                                                            className="bg-black hover:bg-slate-800 text-sm text-white py-2 px-3"
                                                            onClick={() => {
                                                                setModalFilesApprove(
                                                                    {
                                                                        approve:
                                                                            true,
                                                                        index: i,
                                                                    }
                                                                );
                                                            }}
                                                        >
                                                            {ed
                                                                ?.m_expenses_document
                                                                ?.length +
                                                                " Files"}
                                                        </button>
                                                    ) : (
                                                        "-"
                                                    )}
                                                </TD>
                                                <TD className="border">
                                                    <select
                                                        id="EXPENSES_DETAIL_APPROVAL"
                                                        name="EXPENSES_DETAIL_APPROVAL"
                                                        className="block w-56 rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                        onChange={(val) =>
                                                            handleChangeApproval(
                                                                val.target
                                                                    .value,
                                                                "EXPENSES_DETAIL_APPROVAL",
                                                                i
                                                            )
                                                        }
                                                        value={
                                                            ed.EXPENSES_DETAIL_APPROVAL ||
                                                            ""
                                                        }
                                                        aria-label="Choose Expenses Detail Approval"
                                                        required
                                                    >
                                                        <option value="">
                                                            -- Choose Approval
                                                            --
                                                        </option>
                                                        {ExpensesApproval.map(
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
                                                    <CurrencyInput
                                                        id="EXPENSES_DETAIL_AMOUNT_VALUE_APPROVE"
                                                        name="EXPENSES_DETAIL_AMOUNT_VALUE_APPROVE"
                                                        value={
                                                            ed.EXPENSES_DETAIL_AMOUNT_VALUE_APPROVE
                                                        }
                                                        decimalScale={2}
                                                        decimalsLimit={2}
                                                        onValueChange={(
                                                            val: any
                                                        ) =>
                                                            handleChangeApprove(
                                                                val,
                                                                "EXPENSES_DETAIL_AMOUNT_VALUE_APPROVE",
                                                                i
                                                            )
                                                        }
                                                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right ${
                                                            ed.EXPENSES_DETAIL_APPROVAL ===
                                                                "3" ||
                                                            ed.EXPENSES_DETAIL_APPROVAL ===
                                                                3 ||
                                                            ed.EXPENSES_DETAIL_APPROVAL ===
                                                                "1" ||
                                                            ed.EXPENSES_DETAIL_APPROVAL ===
                                                                1
                                                                ? "bg-gray-100"
                                                                : ""
                                                        }`}
                                                        disabled={
                                                            ed.EXPENSES_DETAIL_APPROVAL ===
                                                                "3" ||
                                                            ed.EXPENSES_DETAIL_APPROVAL ===
                                                                3 ||
                                                            ed.EXPENSES_DETAIL_APPROVAL ===
                                                                "1" ||
                                                            (ed.EXPENSES_DETAIL_APPROVAL ===
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
                                                            id="EXPENSES_DETAIL_REMARKS"
                                                            type="text"
                                                            name="EXPENSES_DETAIL_REMARKS"
                                                            value={
                                                                ed.EXPENSES_DETAIL_REMARKS ||
                                                                ""
                                                            }
                                                            className=""
                                                            autoComplete="off"
                                                            onChange={(val) =>
                                                                handleChangeApprove(
                                                                    val.target
                                                                        .value,
                                                                    "EXPENSES_DETAIL_REMARKS",
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
                                            colSpan={4}
                                        >
                                            PROPOSE AMOUNT
                                        </TD>
                                        <TD className="border font-bold text-center px-3 py-2">
                                            {formatCurrency.format(
                                                dataById.EXPENSES_TOTAL_AMOUNT
                                            )}
                                        </TD>
                                    </tr>
                                    <tr className="text-center text-black text-sm">
                                        <TD
                                            className="border font-bold text-right pr-5 py-2"
                                            colSpan={4}
                                        >
                                            APPROVE AMOUNT
                                        </TD>
                                        <TD className="border font-bold text-center px-3 py-2">
                                            {formatCurrency.format(
                                                approveTotalAmount
                                            )}
                                        </TD>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        {/* Table form end */}

                        <div className="grid md:grid-cols-2 my-5">
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="EXPENSES_TYPE"
                                    className="mb-2"
                                >
                                    Information
                                </InputLabel>
                                <select
                                    id="EXPENSES_TYPE"
                                    name="EXPENSES_TYPE"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            EXPENSES_TYPE: e.target.value,
                                        })
                                    }
                                    value={dataById?.EXPENSES_TYPE || ""}
                                >
                                    <option value="">
                                        -- Choose Information --
                                    </option>
                                    {ExpensesNotes.map((notes: any) => (
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

                        <div className="w-full p-2">
                            <InputLabel
                                htmlFor="expenses_request_note"
                                value="Note"
                                className="mb-2"
                            />
                            <Textarea
                                id="expenses_request_note"
                                name="expenses_request_note"
                                className="resize-none border-0 focus:ring-2 focus:ring-inset focus:ring-red-600"
                                rows={5}
                                value={dataById.EXPENSES_REQUEST_NOTE || ""}
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
                show={modal.revised}
                closeable={true}
                onClose={() =>
                    setModal({
                        add: false,
                        detail: false,
                        approve: false,
                        revised: false,
                        execute: false,
                    })
                }
                title="Revised Expenses"
                url={`/expensesRevised`}
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
                            show={modalFilesRevised.revised}
                            closeable={true}
                            onClose={() =>
                                setModalFilesRevised({
                                    revised: false,
                                    index: "",
                                })
                            }
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
                                        {dataById.expenses_detail?.[
                                            modalFilesRevised.index
                                        ]?.m_expenses_document && (
                                            <>
                                                {dataById.expenses_detail?.[
                                                    modalFilesRevised.index
                                                ]?.m_expenses_document.map(
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
                                                                            .expenses_detail?.[
                                                                            modalFilesRevised
                                                                                .index
                                                                        ]
                                                                            .EXPENSES_DETAIL_ID
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

                                        {dataById.expenses_detail?.[
                                            modalFilesRevised.index
                                        ]?.filesDocument && (
                                            <>
                                                {dataById.expenses_detail?.[
                                                    modalFilesRevised.index
                                                ]?.filesDocument.map(
                                                    (file: any, i: number) => (
                                                        <>
                                                            {file
                                                                .EXPENSES_DETAIL_DOCUMENT
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
                                                                                ?.EXPENSES_DETAIL_DOCUMENT
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
                                                                        name="EXPENSES_DETAIL_DOCUMENT"
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
                                                                onClick={() =>
                                                                    handleRemoveRowRevisedFiles(
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
                                                dataById.expenses_detail?.[
                                                    modalFilesRevised.index
                                                ].EXPENSES_DETAIL_ID
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
                                    value="Expenses Number"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="cashAdvanceNumber"
                                    type="text"
                                    name="cashAdvanceNumber"
                                    value={dataById.EXPENSES_NUMBER}
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
                                        dataById.EXPENSES_REQUETED_DATE,
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
                                        dataById.employee?.division
                                            ?.COMPANY_DIVISION_ALIAS
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
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="expenses_reff_number"
                                    value="Reff Number"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="expenses_reff_number"
                                    type="text"
                                    name="expenses_reff_number"
                                    value={dataById?.EXPENSES_REFF_NUMBER}
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            EXPENSES_REFF_NUMBER:
                                                e.target.value,
                                        })
                                    }
                                    autoComplete="off"
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
                                            rowSpan="2"
                                        />
                                        <TH className="border px-3 py-2">
                                            Due Date
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH className="border px-3 py-2">
                                            Type
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH className="border px-3 py-2">
                                            Currency
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH className="border px-3 py-2">
                                            Value
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH className="border px-3 py-2">
                                            Paid To
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH className="border px-3 py-2">
                                            Cost Classification
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH className="border px-3 py-2">
                                            Description
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </TH>
                                        <TH className="border px-3 py-2">
                                            Document
                                        </TH>
                                        {data.expensesDetail.length > 1 && (
                                            <TH
                                                label="Action"
                                                className="border p-2"
                                                rowSpan="2"
                                            />
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataById.expenses_detail?.map(
                                        (ed: any, i: number) => (
                                            <tr
                                                className="text-center text-sm"
                                                key={i}
                                            >
                                                <TD className="border">
                                                    {i + 1 + "."}
                                                </TD>
                                                <TD className="border">
                                                    <div className="w-48">
                                                        <DatePicker
                                                            name="EXPENSES_DETAIL_DUE_DATE"
                                                            selected={
                                                                ed.EXPENSES_DETAIL_DUE_DATE
                                                            }
                                                            onChange={(
                                                                date: any
                                                            ) =>
                                                                handleChangeRevised(
                                                                    date.toLocaleDateString(
                                                                        "en-CA"
                                                                    ),
                                                                    "EXPENSES_DETAIL_DUE_DATE",
                                                                    i
                                                                )
                                                            }
                                                            dateFormat={
                                                                "dd-MM-yyyy"
                                                            }
                                                            placeholderText="dd-mm-yyyyy"
                                                            className="border-0 rounded-md shadow-md text-sm h-9 w-[100%] focus:ring-2 focus:ring-inset focus:ring-red-600"
                                                            autoComplete="off"
                                                        />
                                                    </div>
                                                </TD>
                                                <TD className="border">
                                                    <div className="w-56">
                                                        <select
                                                            id="EXPENSES_DETAIL_TYPE"
                                                            name="EXPENSES_DETAIL_TYPE"
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                            value={
                                                                ed.EXPENSES_DETAIL_TYPE
                                                            }
                                                            onChange={(val) =>
                                                                handleChangeRevised(
                                                                    val.target
                                                                        .value,
                                                                    "EXPENSES_DETAIL_TYPE",
                                                                    i
                                                                )
                                                            }
                                                        >
                                                            {PaymentType?.map(
                                                                (type: any) => (
                                                                    <option
                                                                        key={
                                                                            type.PAYMENT_TYPE_ID
                                                                        }
                                                                        value={
                                                                            type.PAYMENT_TYPE_ID
                                                                        }
                                                                    >
                                                                        {
                                                                            type.PAYMENT_TYPE_NAME
                                                                        }
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                    </div>
                                                </TD>
                                                <TD className="border">
                                                    <div className="w-56">
                                                        <select
                                                            id="EXPENSES_DETAIL_CURRENCY"
                                                            name="EXPENSES_DETAIL_CURRENCY"
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                            value={
                                                                ed.EXPENSES_DETAIL_CURRENCY
                                                            }
                                                            onChange={(val) =>
                                                                handleChangeRevised(
                                                                    val.target
                                                                        .value,
                                                                    "EXPENSES_DETAIL_CURRENCY",
                                                                    i
                                                                )
                                                            }
                                                        >
                                                            {Currency?.map(
                                                                (
                                                                    currency: any
                                                                ) => (
                                                                    <option
                                                                        key={
                                                                            currency.CURRENCY_ID
                                                                        }
                                                                        value={
                                                                            currency.CURRENCY_ID
                                                                        }
                                                                    >
                                                                        {
                                                                            currency.CURRENCY_SYMBOL
                                                                        }
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                    </div>
                                                </TD>
                                                <TD className="border">
                                                    <div className="w-56">
                                                        <CurrencyInput
                                                            id="EXPENSES_DETAIL_AMOUNT_VALUE"
                                                            name="EXPENSES_DETAIL_AMOUNT_VALUE"
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            value={
                                                                ed.EXPENSES_DETAIL_AMOUNT_VALUE
                                                            }
                                                            onValueChange={(
                                                                val: any
                                                            ) =>
                                                                handleChangeRevised(
                                                                    val,
                                                                    "EXPENSES_DETAIL_AMOUNT_VALUE",
                                                                    i
                                                                )
                                                            }
                                                            className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right`}
                                                            placeholder="0.00"
                                                            autoComplete="off"
                                                            required
                                                        />
                                                    </div>
                                                </TD>
                                                <TD className="border">
                                                    <Select
                                                        classNames={{
                                                            menuButton: () =>
                                                                `flex w-96 text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400 ring-1 ring-gray-300`,
                                                            menu: "absolute w-96 text-left z-20 bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
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
                                                            "Choose Paid To"
                                                        }
                                                        value={{
                                                            label: getRelationSelect(
                                                                ed.EXPENSES_DETAIL_RELATION_ORGANIZATION_ID
                                                            ),
                                                            value: ed.EXPENSES_DETAIL_RELATION_ORGANIZATION_ID,
                                                        }}
                                                        onChange={(val: any) =>
                                                            handleChangeRevised(
                                                                val.value,
                                                                "EXPENSES_DETAIL_RELATION_ORGANIZATION_ID",
                                                                i
                                                            )
                                                        }
                                                        primaryColor="bg-red-500"
                                                    />
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
                                                                ed.EXPENSES_DETAIL_COST_CLASSIFICATION
                                                            ),
                                                            value: ed.EXPENSES_DETAIL_COST_CLASSIFICATION,
                                                        }}
                                                        onChange={(val: any) =>
                                                            handleChangeRevised(
                                                                val.value,
                                                                "EXPENSES_DETAIL_COST_CLASSIFICATION",
                                                                i
                                                            )
                                                        }
                                                        primaryColor={
                                                            "bg-red-500"
                                                        }
                                                    />
                                                </TD>
                                                <TD className="border">
                                                    <div className="w-96">
                                                        <TextInput
                                                            id="EXPENSES_DETAIL_DESCRIPTION"
                                                            type="text"
                                                            name="EXPENSES_DETAIL_DESCRIPTION"
                                                            value={
                                                                ed.EXPENSES_DETAIL_DESCRIPTION
                                                            }
                                                            className="w-1/2"
                                                            onChange={(val) =>
                                                                handleChangeRevised(
                                                                    val.target
                                                                        .value,
                                                                    "EXPENSES_DETAIL_DESCRIPTION",
                                                                    i
                                                                )
                                                            }
                                                            autoComplete="off"
                                                            required
                                                        />
                                                    </div>
                                                </TD>
                                                <TD className="border">
                                                    <button
                                                        type="button"
                                                        className="bg-black w-full hover:bg-slate-800 text-sm text-white py-2 px-3"
                                                        onClick={() => {
                                                            setModalFilesRevised(
                                                                {
                                                                    revised:
                                                                        true,
                                                                    index: i,
                                                                }
                                                            );
                                                        }}
                                                    >
                                                        {ed.m_expenses_document
                                                            ?.length > 0 ||
                                                        ed.filesDocument
                                                            ?.length > 0
                                                            ? (ed
                                                                  .m_expenses_document
                                                                  ?.length ||
                                                                  0) +
                                                              (ed.filesDocument
                                                                  ?.length ||
                                                                  0) +
                                                              " Files"
                                                            : "Add Files"}
                                                    </button>
                                                </TD>
                                                {dataById.expenses_detail
                                                    ?.length > 1 && (
                                                    <TD className="border">
                                                        <Button
                                                            className="my-1.5 px-3 py-1"
                                                            onClick={() =>
                                                                handleRemoveRowRevised(
                                                                    i,
                                                                    ed.EXPENSES_DETAIL_ID
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
                                                onClick={handleAddRowRevised}
                                                type="button"
                                            >
                                                + Add Row
                                            </Button>
                                        </TD>
                                        <TD
                                            className="text-right font-bold pr-5 py-2"
                                            colSpan={2}
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
                                htmlFor="expenses_request_note"
                                value="Note"
                                className="mb-2"
                            />
                            <Textarea
                                id="expenses_request_note"
                                name="expenses_request_note"
                                className="resize-none border-0 focus:ring-2 focus:ring-inset focus:ring-red-600 bg-white"
                                rows={5}
                                value={dataById.EXPENSES_REQUEST_NOTE || ""}
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
                        detail: false,
                        approve: false,
                        revised: false,
                        execute: false,
                    })
                }
                title="Execute Expenses"
                url={`/expensesExecute`}
                data={data}
                method="post"
                onSuccess={handleSuccess}
                headers={{ "Content-type": "multipart/form-data" }}
                submitButtonName={"Execute"}
                body={
                    <>
                        <ModalToDocument
                            classPanel={
                                "relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 min-w-[100%] md:min-w-[70%] lg:min-w-[35%]"
                            }
                            show={modalProofOfDocument.add}
                            closeable={true}
                            onClose={() =>
                                setModalProofOfDocument({
                                    add: false,
                                })
                            }
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
                                    Propose Amount
                                </InputLabel>
                                <CurrencyInput
                                    value={dataById.EXPENSES_TOTAL_AMOUNT}
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
                                        dataById.EXPENSES_TOTAL_AMOUNT_APPROVE
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
                                <InputLabel
                                    htmlFor="expenses_method"
                                    className="mb-2"
                                >
                                    Method
                                    <span className="text-red-600">*</span>
                                </InputLabel>
                                <select
                                    id="expenses_method"
                                    name="expenses_method"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            expenses_method: e.target.value,
                                        })
                                    }
                                    required
                                >
                                    <option value="">
                                        -- Choose Method --
                                    </option>
                                    {ExpensesMethod.map((method: any) => (
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
                                    htmlFor="expenses_settlement_date"
                                    className="mb-2"
                                >
                                    Settlement Date
                                    <span className="text-red-600">*</span>
                                </InputLabel>
                                <DatePicker
                                    name="expenses_settlement_date"
                                    selected={data.expenses_settlement_date}
                                    onChange={(date: any) =>
                                        setData({
                                            ...data,
                                            expenses_settlement_date:
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
                                            setModalProofOfDocument({
                                                add: true,
                                            });
                                        }}
                                    >
                                        {data.proof_of_document?.length > 0
                                            ? data.proof_of_document?.length +
                                              " Files"
                                            : "Add Files"}
                                    </button>
                                </div>
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
                            {"Add Expenses"}
                        </Button>
                    </>
                }
                search={
                    <>
                        <fieldset className="py-3 rounded-lg border-slate-100 border-2">
                            <legend className="ml-8 text-sm">Search</legend>
                            <div className="mt-3 px-4">
                                <InputSearch
                                    id="EXPENSES_NUMBER"
                                    name="EXPENSES_NUMBER"
                                    type="text"
                                    placeholder="Expenses Number"
                                    autoComplete="off"
                                    value={
                                        searchExpenses.expenses_search[0]
                                            .EXPENSES_NUMBER
                                    }
                                    onChange={(val: any) => {
                                        inputDataSearch(
                                            "EXPENSES_NUMBER",
                                            val.target.value,
                                            0
                                        );
                                        if (
                                            searchExpenses.expenses_search[0]
                                                .EXPENSES_NUMBER === ""
                                        ) {
                                            inputDataSearch("flag", "flag", 0);
                                        } else {
                                            inputDataSearch("flag", "", 0);
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            const expensesNumber =
                                                searchExpenses
                                                    .expenses_search[0]
                                                    .EXPENSES_NUMBER;
                                            if (expensesNumber) {
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
                                    id="EXPENSES_VENDOR"
                                    name="EXPENSES_VENDOR"
                                    type="text"
                                    placeholder="Vendor"
                                    autoComplete="off"
                                    value={
                                        searchExpenses.expenses_search[0]
                                            .EXPENSES_VENDOR
                                    }
                                    onChange={(val: any) => {
                                        inputDataSearch(
                                            "EXPENSES_VENDOR",
                                            val.target.value,
                                            0
                                        );
                                        if (
                                            searchExpenses.expenses_search[0]
                                                .EXPENSES_VENDOR === ""
                                        ) {
                                            inputDataSearch("flag", "flag", 0);
                                        } else {
                                            inputDataSearch("flag", "", 0);
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            const expensesVendor =
                                                searchExpenses
                                                    .expenses_search[0]
                                                    .EXPENSES_VENDOR;
                                            if (expensesVendor) {
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
                                    id="EXPENSES_REQUESTED_BY"
                                    name="EXPENSES_REQUESTED_BY"
                                    type="text"
                                    placeholder="Applicant"
                                    autoComplete="off"
                                    value={
                                        searchExpenses.expenses_search[0]
                                            .EXPENSES_REQUESTED_BY
                                    }
                                    onChange={(val: any) => {
                                        inputDataSearch(
                                            "EXPENSES_REQUESTED_BY",
                                            val.target.value,
                                            0
                                        );
                                        if (
                                            searchExpenses.expenses_search[0]
                                                .EXPENSES_REQUESTED_BY === ""
                                        ) {
                                            inputDataSearch("flag", "flag", 0);
                                        } else {
                                            inputDataSearch("flag", "", 0);
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            const expensesRequestedBy =
                                                searchExpenses
                                                    .expenses_search[0]
                                                    .EXPENSES_REQUESTED_BY;
                                            if (expensesRequestedBy) {
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
                                            searchExpenses.expenses_search[0]
                                                .EXPENSES_DIVISION
                                        }
                                        onChange={(val: any) => {
                                            inputDataSearch(
                                                "EXPENSES_DIVISION",
                                                val,
                                                0
                                            );
                                            if (
                                                searchExpenses
                                                    .expenses_search[0]
                                                    .EXPENSES_DIVISION === ""
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
                                <div className="grid grid-cols-1 mb-5 relative">
                                    <CalendarDaysIcon className="absolute left-2 z-1 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-6" />
                                    <DatePicker
                                        name="EXPENSES_START_DATE"
                                        selected={
                                            searchExpenses.expenses_search[0]
                                                .EXPENSES_START_DATE
                                        }
                                        onChange={(val: any) => {
                                            inputDataSearch(
                                                "EXPENSES_START_DATE",
                                                val.toLocaleDateString("en-CA"),
                                                0
                                            );
                                            if (
                                                searchExpenses
                                                    .expenses_search[0]
                                                    .EXPENSES_START_DATE === ""
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
                                                const expensesStartDate =
                                                    searchExpenses
                                                        .expenses_search[0]
                                                        .EXPENSES_START_DATE;
                                                if (expensesStartDate) {
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
                                        name="expenses_end_date"
                                        selected={
                                            searchExpenses.expenses_search[0]
                                                .EXPENSES_END_DATE
                                        }
                                        onChange={(val: any) => {
                                            inputDataSearch(
                                                "EXPENSES_END_DATE",
                                                val.toLocaleDateString("en-CA"),
                                                0
                                            );
                                            if (
                                                searchExpenses
                                                    .expenses_search[0]
                                                    .EXPENSES_END_DATE === ""
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
                                                const expensesEndDate =
                                                    searchExpenses
                                                        .expenses_search[0]
                                                        .EXPENSES_END_DATE;
                                                if (expensesEndDate) {
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
                                        options={selectOperationalPayment}
                                        isSearchable={true}
                                        placeholder={"Payment Type"}
                                        value={
                                            searchExpenses.expenses_search[0]
                                                .EXPENSES_DETAIL_TYPE
                                        }
                                        onChange={(val: any) => {
                                            inputDataSearch(
                                                "EXPENSES_DETAIL_TYPE",
                                                val,
                                                0
                                            );
                                            if (
                                                searchExpenses
                                                    .expenses_search[0]
                                                    .EXPENSES_DETAIL_TYPE === ""
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
                                                searchExpenses
                                                    .expenses_search[0]
                                                    .EXPENSES_ID === "" &&
                                                searchExpenses
                                                    .expenses_search[0]
                                                    .EXPENSES_NUMBER === ""
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
                                        onClick={clearSearchExpenses}
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
                                    Expenses Status
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
                                                    "EXPENSES_APPROVAL_STATUS",
                                                    "request",
                                                    0
                                                );
                                                if (
                                                    searchExpenses
                                                        .expenses_search[0]
                                                        .EXPENSES_APPROVAL_STATUS ===
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
                                                {getCountExpensesRequestStatus}
                                            </span>
                                        </Button>
                                    </div>
                                    <div className="flex relative">
                                        <Button
                                            className="w-36 bg-green-600 px-2 py-1 hover:bg-green-500"
                                            onClick={() => {
                                                inputDataSearch(
                                                    "EXPENSES_APPROVAL_STATUS",
                                                    "approve1",
                                                    0
                                                );
                                                if (
                                                    searchExpenses
                                                        .expenses_search[0]
                                                        .EXPENSES_APPROVAL_STATUS ===
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
                                                {getCountExpensesApprove1Status}
                                            </span>
                                        </Button>
                                    </div>
                                    <div className="flex relative">
                                        <Button
                                            className="w-36 bg-green-600 px-2 py-1 hover:bg-green-500"
                                            onClick={() => {
                                                inputDataSearch(
                                                    "EXPENSES_APPROVAL_STATUS",
                                                    "approve2",
                                                    0
                                                );
                                                if (
                                                    searchExpenses
                                                        .expenses_search[0]
                                                        .EXPENSES_APPROVAL_STATUS ===
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
                                                {getCountExpensesApprove2Status}
                                            </span>
                                        </Button>
                                    </div>
                                    {/* <div className="flex relative">
                                        <Button
                                            className="w-36 bg-green-600 px-2 py-1 hover:bg-green-500"
                                            onClick={() => {
                                                inputDataSearch(
                                                    "EXPENSES_APPROVAL_STATUS",
                                                    "approve3",
                                                    0
                                                );
                                                if (
                                                    searchExpenses
                                                        .expenses_search[0]
                                                        .EXPENSES_APPROVAL_STATUS ===
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
                                                {getCountExpensesApprove3Status}
                                            </span>
                                        </Button>
                                    </div> */}
                                    <div className="flex relative">
                                        <Button
                                            className="w-36 bg-yellow-400 px-2 py-1 hover:bg-yellow-300"
                                            onClick={() => {
                                                inputDataSearch(
                                                    "EXPENSES_APPROVAL_STATUS",
                                                    "revision",
                                                    0
                                                );
                                                if (
                                                    searchExpenses
                                                        .expenses_search[0]
                                                        .EXPENSES_APPROVAL_STATUS ===
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
                                                    getCountExpensesNeedRevisionStatus
                                                }
                                            </span>
                                        </Button>
                                    </div>
                                    <div className="flex relative">
                                        <Button
                                            className="w-36 bg-red-600 px-2 py-1 hover:bg-red-500"
                                            onClick={() => {
                                                inputDataSearch(
                                                    "EXPENSES_APPROVAL_STATUS",
                                                    "reject",
                                                    0
                                                );
                                                if (
                                                    searchExpenses
                                                        .expenses_search[0]
                                                        .EXPENSES_APPROVAL_STATUS ===
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
                                                {getCountExpensesRejectStatus}
                                            </span>
                                        </Button>
                                    </div>
                                    <div className="flex relative">
                                        <Button
                                            className="w-36 bg-green-500 px-2 py-1 hover:bg-green-400"
                                            onClick={() => {
                                                inputDataSearch(
                                                    "EXPENSES_APPROVAL_STATUS",
                                                    "complited",
                                                    0
                                                );
                                                if (
                                                    searchExpenses
                                                        .expenses_search[0]
                                                        .EXPENSES_APPROVAL_STATUS ===
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
                            searchParam={searchExpenses.expenses_search}
                            url={"getExpenses"}
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
                                    headerName: "Expenses Number",
                                    field: "EXPENSES_NUMBER",
                                    flex: 3,
                                    cellStyle: { textAlign: "center" },
                                },
                                {
                                    headerName: "Request Date",
                                    field: "EXPENSES_REQUESTED_DATE",
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
                                    field: "EXPENSES_TOTAL_AMOUNT",
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
                                            field: "EXPENSES_FIRST_APPROVAL_USER",
                                            flex: 2,
                                            cellHeader: "header-center",
                                            cellRenderer: (params: any) => {
                                                const first_approval_status =
                                                    params.data
                                                        .EXPENSES_FIRST_APPROVAL_STATUS;

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
                                                        .EXPENSES_SECOND_APPROVAL_STATUS;
                                                const second_approval_user =
                                                    params.data
                                                        .EXPENSES_SECOND_APPROVAL_USER;

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
                                                        .EXPENSES_THIRD_APPROVAL_STATUS;
                                                const third_approval_user =
                                                    params.data
                                                        .EXPENSES_THIRD_APPROVAL_USER;

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
                                            cellStyle: { textAlign: "center" },
                                            cellRenderer: (params: any) => {
                                                const paramsData = params.data;
                                                const status =
                                                    paramsData?.EXPENSES_SECOND_APPROVAL_STATUS ===
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
                                    headerName: "Refference Number",
                                    flex: 2,
                                    cellStyle: { textAlign: "center" },
                                    cellRenderer: (params: any) => {
                                        const reff_number =
                                            params.data.EXPENSES_REFF_NUMBER;

                                        return reff_number ? reff_number : "-";
                                    },
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
                                                    className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 cursor-pointer"
                                                    onChange={(e) =>
                                                        handleSelectChange(
                                                            e,
                                                            params.data
                                                                .EXPENSES_ID
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
