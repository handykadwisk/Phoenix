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
    MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import dateFormat from "dateformat";
import ModalSearch from "@/Components/Modal/ModalSearch";

export default function CashAdvance({ auth }: PageProps) {
    useEffect(() => {
        getReimburseNumber();
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
    });
    // Modal Add End

    const { data, setData, errors, reset } = useForm({
        reimburse_number: "",
        reimburse_used_by: "",
        reimburse_requested_by: "",
        reimburse_division: "",
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
                reimburse_detail_end_date: "",
                reimburse_detail_purpose: "",
                reimburse_detail_relation_name: "",
                reimburse_detail_relation_position: "",
                reimburse_detail_relation_organization_id: "",
                reimburse_detail_location: "",
                reimburse_detail_amount: "",
                reimburse_detail_document_id: "",
                reimburse_detail_note: "",
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
                    reimburse_detail_end_date: "",
                    reimburse_detail_purpose: "",
                    reimburse_detail_relation_name: "",
                    reimburse_detail_relation_position: "",
                    reimburse_detail_relation_organization_id: "",
                    reimburse_detail_location: "",
                    reimburse_detail_amount: "",
                    reimburse_detail_document_id: "",
                    reimburse_detail_note: "",
                },
            ],
        });

        setIsSuccess(message);
        getReimburse();
        getReimburseNumber();
    };
    // Handle Success End

    const [dataById, setDataById] = useState<any>({
        // REIMBURSE_NUMBER: "",
        // REIMBURSE_TYPE: "",
        // DIVISION: "",
        // USED_BY: "",
        // REIMBURSE_REQUESTED_BY: "",
        // REIMBURSE_REQUESTED_DATE: "",
        // FIRST_APPROVAL_USER: "",
        // REIMBURSE_REQUEST_NOTE: "",
        // REIMBURSE_TOTAL_AMOUNT: "",
        // REIMBURSE_TRANSFER_AMOUNT: "",
        reimburse_detail: [
            {
                REIMBURSE_DETAIL_ID: "",
                REIMBURSE_DETAIL_PURPOSE: "",
                REIMBURSE_DETAIL_LOCATION: "",
                REIMBURSE_DETAIL_AMOUNT: "",
                REIMBURSE_DETAIL_NOTE: "",
                REIMBURSE_DETAIL_DOCUMENT_ID: "",
                reimburse_detail_document_id: "",
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
            reimburse_detail_date: "",
            reimburse_detail_end_date: "",
            reimburse_detail_purpose: "",
            reimburse_detail_relation_name: "",
            reimburse_detail_relation_position: "",
            reimburse_detail_relation_organization_id: "",
            reimburse_detail_location: "",
            reimburse_detail_amount: "",
            reimburse_detail_document_id: "",
            reimburse_detail_note: "",
        },
    ]);

    const handleAddRow = (e: FormEvent) => {
        e.preventDefault();

        setDataRow([
            ...DataRow,
            {
                reimburse_detail_date: "",
                reimburse_detail_end_date: "",
                reimburse_detail_purpose: "",
                reimburse_detail_relation_name: "",
                reimburse_detail_relation_position: "",
                reimburse_detail_relation_organization_id: "",
                reimburse_detail_location: "",
                reimburse_detail_amount: "",
                reimburse_detail_document_id: "",
                reimburse_detail_note: "",
            },
        ]);

        setData("ReimburseDetail", [
            ...data.ReimburseDetail,
            {
                reimburse_detail_date: "",
                reimburse_detail_end_date: "",
                reimburse_detail_purpose: "",
                reimburse_detail_relation_name: "",
                reimburse_detail_relation_position: "",
                reimburse_detail_relation_organization_id: "",
                reimburse_detail_location: "",
                reimburse_detail_amount: "",
                reimburse_detail_document_id: "",
                reimburse_detail_note: "",
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
            reimburse_detail_end_date: "",
            reimburse_detail_purpose: "",
            reimburse_detail_relation_name: "",
            reimburse_detail_relation_position: "",
            reimburse_detail_relation_organization_id: "",
            reimburse_detail_location: "",
            reimburse_detail_amount: "",
            reimburse_detail_document_id: "",
            reimburse_detail_note: "",
        },
    ]);

    const handleAddReportRow = (e: FormEvent) => {
        e.preventDefault();

        setDataReportRow([
            ...DataReportRow,
            {
                reimburse_detail_date: "",
                reimburse_detail_end_date: "",
                reimburse_detail_purpose: "",
                reimburse_detail_relation_name: "",
                reimburse_detail_relation_position: "",
                reimburse_detail_relation_organization_id: "",
                reimburse_detail_location: "",
                reimburse_detail_amount: "",
                reimburse_detail_document_id: "",
                reimburse_detail_note: "",
            },
        ]);

        setData("ReimburseDetail", [
            ...data.ReimburseDetail,
            {
                reimburse_detail_date: "",
                reimburse_detail_end_date: "",
                reimburse_detail_purpose: "",
                reimburse_detail_relation_name: "",
                reimburse_detail_relation_position: "",
                reimburse_detail_relation_organization_id: "",
                reimburse_detail_location: "",
                reimburse_detail_amount: "",
                reimburse_detail_document_id: "",
                reimburse_detail_note: "",
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

    const getReimburse = async (pageNumber = "page=1") => {
        setIsLoading(true);
        await axios
            .post(`/getReimburse?${pageNumber}`, {
                REIMBURSE_NUMBER: searchReimburse.REIMBURSE_NUMBER,
            })
            .then((res) => {
                setReimburse(res.data);
                setIsLoading(false);
                if (modal.search) {
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
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getReportCA = async (pageNumber = "page=1") => {
        setIsLoading(true);
        await axios
            .post(`/getReportCA?${pageNumber}`, {
                REIMBURSE_NUMBER: searchReimburse.REIMBURSE_NUMBER,
            })
            .then((res) => {
                setReimburse(res.data);
                setIsLoading(false);
                if (modal.search) {
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
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };
    // Search End

    // Clear Search Start
    const clearSearchReimburse = async (pageNumber = "page=1") => {
        await axios
            .post(`/getReimburse?${pageNumber}`)
            .then((res) => {
                setReimburse([]);
                setSearchReimburse({
                    ...searchReimburse,
                    REIMBURSE_NUMBER: "",
                });

                // console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    // Clear Search End

    // const getReimburse = async (pageNumber = "page=1") => {
    //     await axios
    //         .get(`/getReimburse?${pageNumber}`)
    //         .then((res) => {
    //             setReimburse(res.data);
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // };

    // Data Start
    const { users }: any = usePage().props;
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
            type: "Reimburse",
        },
        {
            id: 2,
            type: "Reimburse",
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
            name: "Reimburse",
        },
        {
            index: 2,
            name: "Report Reimburse",
        },
    ];
    // Data End

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

    const handleFileDownload = async (id: number) => {
        await axios({
            url: `/reimburseDownload/${id}`,
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

    let total = 0;

    DataRow.forEach((item) => {
        total += Number(item.reimburse_detail_amount);
    });

    let revised_total_amount = 0;

    dataById.reimburse_detail.forEach((item: any) => {
        revised_total_amount += Number(item.REIMBURSE_DETAIL_AMOUNT);
    });

    let count_approve = 0;

    dataById.reimburse_detail.forEach((item: any) => {
        count_approve += Number(item.REIMBURSE_DETAIL_STATUS);
    });

    const [toggleState, setToggleState] = useState(1);

    const toggleTab = (i: number) => {
        setToggleState(i);
    };

    const [checkedTransfer, setCheckedTransfer] = useState(false);
    const handleCheckedTransfer = (e:any) => {
        setData("reimburse_delivery_method_transfer", e.target.value)
        setCheckedTransfer(!checkedTransfer); 
    };

    const [checkedCash, setCheckedCash] = useState(false);
    const handleCheckedCash = (e:any) => {
        setData("reimburse_delivery_method_cash", e.target.value)
        setCheckedCash(!checkedCash); 
    };

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
                classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 sm:max-w-2xl md:max-w-2xl lg:max-w-4xl xl:max-w-full`}
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
                panelWidth={"65%"}
                body={
                    <>
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
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="reimburse_division"
                                    value="Division"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="reimburse_division"
                                    type="text"
                                    name="reimburse_division"
                                    value="IT"
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
                                        setData("reimburse_used_by", e.target.value)
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
                                            "reimburse_first_approval_by",
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
                                                    id="reimburse_detail_date"
                                                    type="date"
                                                    name="reimburse_detail_date"
                                                    value={val.reimburse_detail_date}
                                                    className="w-1/2"
                                                    autoComplete="reimburse_detail_date"
                                                    onChange={(e) =>
                                                        handleChangeAdd(e, i)
                                                    }
                                                    required
                                                />
                                            </TD>
                                            <TD className="border">
                                                <select
                                                    id="reimburse_detail_purpose"
                                                    name="reimburse_detail_purpose"
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                    required
                                                    onChange={(e) =>
                                                        handleChangeAdd(e, i)
                                                    }
                                                >
                                                    <option value="">
                                                        -- Choose purpose --
                                                    </option>
                                                    {purposes.map((purpose) => (
                                                        <option
                                                            key={purpose.id}
                                                            value={purpose.id}
                                                        >
                                                            {purpose.purpose}
                                                        </option>
                                                    ))}
                                                </select>
                                            </TD>
                                            <TD className="border">
                                                <select
                                                    id="reimburse_detail_relation_organization_id"
                                                    name="reimburse_detail_relation_organization_id"
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                    onChange={(e) =>
                                                        handleChangeAdd(e, i)
                                                    }
                                                >
                                                    <option value="">
                                                        -- Choose Business
                                                        Relation --
                                                    </option>
                                                    {companies.map(
                                                        (company) => (
                                                            <option
                                                                key={company.id}
                                                                value={
                                                                    company.id
                                                                }
                                                            >
                                                                {
                                                                    company.nama_perusahaan
                                                                }
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            </TD>
                                            <TD className="border">
                                                <TextInput
                                                    id="reimburse_detail_relation_name"
                                                    type="text"
                                                    name="reimburse_detail_relation_name"
                                                    value={val.reimburse_detail_relation_name}
                                                    className="w-1/2"
                                                    autoComplete="reimburse_detail_relation_name"
                                                    onChange={(e) =>
                                                        handleChangeAdd(e, i)
                                                    }
                                                />
                                            </TD>
                                            <TD className="border">
                                                <TextInput
                                                    id="reimburse_detail_relation_position"
                                                    type="text"
                                                    name="reimburse_detail_relation_position"
                                                    value={val.reimburse_detail_relation_position}
                                                    className="w-1/2"
                                                    autoComplete="reimburse_detail_relation_position"
                                                    onChange={(e) =>
                                                        handleChangeAdd(e, i)
                                                    }
                                                />
                                            </TD>
                                            <TD className="border">
                                                <TextInput
                                                    id="reimburse_detail_location"
                                                    type="text"
                                                    name="reimburse_detail_location"
                                                    value={val.reimburse_detail_location}
                                                    className="w-1/2"
                                                    autoComplete="reimburse_detail_location"
                                                    onChange={(e) =>
                                                        handleChangeAdd(e, i)
                                                    }
                                                    required
                                                />
                                            </TD>
                                            <TD className="border">
                                                <TextInput
                                                    id="reimburse_detail_amount"
                                                    type="number"
                                                    name="reimburse_detail_amount"
                                                    value={val.reimburse_detail_amount}
                                                    className="w-1/2 text-right"
                                                    autoComplete="reimburse_detail_amount"
                                                    onChange={(e) =>
                                                        handleChangeAdd(e, i)
                                                    }
                                                    placeholder="0"
                                                    required
                                                />
                                            </TD>
                                            <TD className="border">
                                                <input
                                                    type="file"
                                                    id="reimburse_detail_document_id"
                                                    name="reimburse_detail_document_id"
                                                    className="bg-white leading-4"
                                                    multiple
                                                    onChange={(e) =>
                                                        handleUploadFile(e, i)
                                                    }
                                                />
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
                                                className="mt-5 px-2 py-1 bg-blue-600 hover:bg-blue-500 text-sm"
                                                onClick={(e) => handleAddRow(e)}
                                                type="button"
                                            >
                                                +
                                            </Button>
                                        </TD>
                                        <TD
                                            className="text-right pr-5 font-bold"
                                            colSpan={6}
                                        >
                                            TOTAL AMOUNT
                                        </TD>
                                        <TD>{formatCurrency.format(total)}</TD>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        {/* Table form end */}

                        {/* <p className="mt-5">{JSON.stringify(DataRow)}</p> */}

                        {/* <div className="mt-10">
                            <fieldset className="bg-white pb-10 pt-5 rounded-lg border-2">
                                <legend className="ml-12 bg-gray-300 px-3 font-medium">Delivery Method</legend>
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
                                                    id="reimburse_transfer_amount"
                                                    type="number"
                                                    name="reimburse_transfer_amount"
                                                    value={data.reimburse_transfer_amount}
                                                    className="w-full lg:w-1/4 text-right"
                                                    placeholder="0"
                                                    onChange={(e) =>
                                                        setData("reimburse_transfer_amount", e.target.value)
                                                    }
                                                    required
                                                />
                                            ) : (
                                                <TextInput
                                                    id="reimburse_transfer_amount"
                                                    type="number"
                                                    name="reimburse_transfer_amount"
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
                                                placeholder="Bank Account"
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
                                                    id="reimburse_cash_amount"
                                                    type="number"
                                                    name="reimburse_cash_amount"
                                                    value={data.reimburse_cash_amount}
                                                    className="w-5/12 lg:w-1/4 text-right ml-9"
                                                    placeholder="0"
                                                    onChange={(e) =>
                                                        setData("reimburse_cash_amount", e.target.value)
                                                    }
                                                    required
                                                />
                                            ) : (
                                                <TextInput
                                                    id="reimburse_cash_amount"
                                                    type="number"
                                                    name="reimburse_cash_amount"
                                                    value={""}
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
                        </div> */}

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
                                    setData("reimburse_request_note", e.target.value)
                                }
                            />
                        </div>
                    </>
                }
            />
            {/* Modal Add End */}

            {/* Modal Detail Start */}
            <ModalToAction
                classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 sm:max-w-2xl md:max-w-2xl lg:max-w-4xl xl:max-w-full`}
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
                panelWidth={"65%"}
                body={
                    <>
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
                                    className=""
                                    autoComplete="reimburseNumber"
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            REIMBURSE_NUMBER: e.target.value,
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
                                {dataById.REIMBURSE_TYPE === 1 && (
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
                                {dataById.REIMBURSE_TYPE === 2 && (
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
                                    htmlFor="divisi"
                                    value="Division"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="divisi"
                                    type="text"
                                    name="divisi"
                                    value={dataById.REIMBURSE_DIVISION}
                                    className=""
                                    autoComplete="divisi"
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            REIMBURSE_DIVISION: e.target.value,
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
                                        dataById.REIMBURSE_REQUESTED_DATE,
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
                                                        cad.REIMBURSE_DETAIL_DATE,
                                                        "dd-mm-yyyy"
                                                    )}
                                                </TD>
                                                <TD className="border px-3">
                                                    {cad.REIMBURSE_DETAIL_PURPOSE === "1" &&
                                                        "Peruntukan A"
                                                    }
                                                    {cad.REIMBURSE_DETAIL_PURPOSE === "2" &&
                                                        "Peruntukan B"
                                                    }
                                                    {cad.REIMBURSE_DETAIL_PURPOSE === "3" &&
                                                        "Peruntukan C"
                                                    }
                                                </TD>
                                                <TD className="border px-3">
                                                    {cad.REIMBURSE_DETAIL_RELATION_ORGANIZATION_ID ===
                                                        1 && "Perusahaan A"}
                                                    {cad.REIMBURSE_DETAIL_RELATION_ORGANIZATION_ID ===
                                                        2 && "Perusahaan B"}
                                                    {cad.REIMBURSE_DETAIL_RELATION_ORGANIZATION_ID ===
                                                        3 && "Perusahaan C"}
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {
                                                        cad.REIMBURSE_DETAIL_RELATION_NAME
                                                    }
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {
                                                        cad.REIMBURSE_DETAIL_RELATION_POSITION
                                                    }
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {
                                                        cad.REIMBURSE_DETAIL_LOCATION
                                                    }
                                                </TD>
                                                <TD className="border px-3 py-2">
                                                    {formatCurrency.format(
                                                        cad.REIMBURSE_DETAIL_AMOUNT
                                                    )}
                                                </TD>
                                                {cad.REIMBURSE_DETAIL_DOCUMENT_ID !== null ? (
                                                <TD className="border px-3 py-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleFileDownload(
                                                                cad.REIMBURSE_DETAIL_ID
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

                        {/* <p className="mt-5">{JSON.stringify(DataRow)}</p> */}

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
                                onChange={(e) =>
                                    setData("reimburse_request_note", e.target.value)
                                }
                                readOnly
                            />
                        </div>
                    </>
                }
            />
            {/* Modal Detail End */}

            {/* Modal Approve Start */}
            <ModalToAction
                classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 sm:max-w-2xl md:max-w-2xl lg:max-w-4xl xl:max-w-full`}
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
                panelWidth={"70%"}
                body={
                    <>
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
                                    className=""
                                    autoComplete="reimburseNumber"
                                    readOnly
                                />
                            </div>
                            {/* <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="tipe"
                                    value="Type"
                                    className="mb-2"
                                />
                                {dataById.REIMBURSE_TYPE === 1 && (
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
                                {dataById.REIMBURSE_TYPE === 2 && (
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
                                    htmlFor="divisi"
                                    value="Division"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="divisi"
                                    type="text"
                                    name="divisi"
                                    value={dataById.REIMBURSE_DIVISION}
                                    className=""
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
                                        dataById.REIMBURSE_REQUESTED_DATE,
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
                                                        cad.REIMBURSE_DETAIL_DATE,
                                                        "dd-mm-yyyy"
                                                    )}
                                                </TD>
                                                <TD className="border px-3">
                                                    {cad.REIMBURSE_DETAIL_PURPOSE ===
                                                        "1" && "Peruntukan A"}
                                                    {cad.REIMBURSE_DETAIL_PURPOSE ===
                                                        "2" && "Peruntukan B"}
                                                    {cad.REIMBURSE_DETAIL_PURPOSE ===
                                                        "3" && "Peruntukan C"}
                                                </TD>
                                                <TD className="border px-3">
                                                    {cad.REIMBURSE_DETAIL_RELATION_ORGANIZATION_ID ===
                                                        1 && "Perusahaan A"}
                                                    {cad.REIMBURSE_DETAIL_RELATION_ORGANIZATION_ID ===
                                                        2 && "Perusahaan B"}
                                                    {cad.REIMBURSE_DETAIL_RELATION_ORGANIZATION_ID ===
                                                        3 && "Perusahaan C"}
                                                </TD>
                                                <TD className="border px-3">
                                                    {
                                                        cad.REIMBURSE_DETAIL_RELATION_NAME
                                                    }
                                                </TD>
                                                <TD className="border px-3">
                                                    {
                                                        cad.REIMBURSE_DETAIL_RELATION_POSITION
                                                    }
                                                </TD>
                                                <TD className="border px-3">
                                                    {
                                                        cad.REIMBURSE_DETAIL_LOCATION
                                                    }
                                                </TD>
                                                <TD className="border px-3">
                                                    {formatCurrency.format(
                                                        cad.REIMBURSE_DETAIL_AMOUNT
                                                    )}
                                                </TD>
                                                {cad.REIMBURSE_DETAIL_DOCUMENT_ID !== null ? (
                                                    <TD className="border px-3 py-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleFileDownload(
                                                                    cad.REIMBURSE_DETAIL_ID
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
                                                    <select
                                                        name="REIMBURSE_DETAIL_STATUS"
                                                        id="REIMBURSE_DETAIL_STATUS"
                                                        value={
                                                            cad.REIMBURSE_DETAIL_STATUS
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
                                                </TD>
                                                <TD className="border">
                                                    <TextInput
                                                        id="REIMBURSE_DETAIL_NOTE"
                                                        type="text"
                                                        name="REIMBURSE_DETAIL_NOTE"
                                                        value={
                                                            cad.REIMBURSE_DETAIL_NOTE
                                                        }
                                                        className="w-1/2"
                                                        autoComplete="REIMBURSE_DETAIL_NOTE"
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
                                            colSpan={7}
                                        >
                                            TOTAL AMOUNT
                                        </TD>
                                        <TD className="border text-center py-2">
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
                        <div className="md:absolute mt-7">
                            {count_approve > 0 && (
                                <button
                                    type="submit"
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-yellow-400 px-3 py-2 text-sm font-semibold text-white hover:bg-yellow-300 sm:ml-3 sm:mt-0 sm:w-auto"
                                    onClick={() => handleBtnStatus(3)}
                                >
                                    Need Revision
                                </button>
                            )}
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
                classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 sm:max-w-2xl md:max-w-2xl lg:max-w-4xl xl:max-w-full`}
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
                panelWidth={"70%"}
                body={
                    <>
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
                                    className=""
                                    autoComplete="reimburseNumber"
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            REIMBURSE_NUMBER: e.target.value,
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
                                {dataById.REIMBURSE_TYPE === 1 && (
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
                                {dataById.REIMBURSE_TYPE === 2 && (
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
                                        setData("reimburse_used_by", e.target.value)
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
                                        setData("reimburse_requested_by", e.target.value)
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
                                    id="reimburse_division"
                                    type="text"
                                    name="reimburse_division"
                                    value={dataById.REIMBURSE_DIVISION}
                                    className=""
                                    autoComplete="reimburse_division"
                                    onChange={(e) =>
                                        setData("reimburse_division", e.target.value)
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
                                        dataById.REIMBURSE_REQUESTED_DATE,
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
                                            "reimburse_first_approval_by",
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
                                            label="Status"
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
                                                    <TextInput
                                                        id="REIMBURSE_DETAIL_DATE"
                                                        type="date"
                                                        name="REIMBURSE_DETAIL_DATE"
                                                        value={
                                                            cad.REIMBURSE_DETAIL_DATE
                                                        }
                                                        className="w-1/2"
                                                        autoComplete="REIMBURSE_DETAIL_DATE"
                                                        onChange={(e) =>
                                                            handleChangeRevised(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                        required
                                                    />
                                                </TD>
                                                {/* <TD className="border">
                                                    <TextInput
                                                        id="REIMBURSE_DETAIL_END_DATE"
                                                        type="date"
                                                        name="REIMBURSE_DETAIL_END_DATE"
                                                        value={
                                                            cad.REIMBURSE_DETAIL_END_DATE
                                                        }
                                                        className="w-1/2"
                                                        autoComplete="REIMBURSE_DETAIL_END_DATE"
                                                        onChange={(e) =>
                                                            handleChangeRevised(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                        required
                                                    />
                                                </TD> */}
                                                <TD className="border">
                                                    <select
                                                        id="REIMBURSE_DETAIL_PURPOSE"
                                                        name="REIMBURSE_DETAIL_PURPOSE"
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                        value={
                                                            cad.REIMBURSE_DETAIL_PURPOSE
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
                                                            -- Choose purpose --
                                                        </option>
                                                        {purposes.map((purpose) => (
                                                            <option
                                                                key={purpose.id}
                                                                value={purpose.id}
                                                            >
                                                                {purpose.purpose}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </TD>
                                                <TD className="border">
                                                    <select
                                                        id="REIMBURSE_DETAIL_RELATION_ORGANIZATION_ID"
                                                        name="REIMBURSE_DETAIL_RELATION_ORGANIZATION_ID"
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                        value={
                                                            cad.REIMBURSE_DETAIL_RELATION_ORGANIZATION_ID
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
                                                        {companies.map(
                                                            (company) => (
                                                                <option
                                                                    key={
                                                                        company.id
                                                                    }
                                                                    value={
                                                                        company.id
                                                                    }
                                                                >
                                                                    {
                                                                        company.nama_perusahaan
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
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
                                                    <TextInput
                                                        id="REIMBURSE_DETAIL_AMOUNT"
                                                        type="number"
                                                        name="REIMBURSE_DETAIL_AMOUNT"
                                                        value={
                                                            cad.REIMBURSE_DETAIL_AMOUNT
                                                        }
                                                        className="w-1/2 text-right"
                                                        autoComplete="REIMBURSE_DETAIL_AMOUNT"
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
                                                        id="reimburse_detail_document_id"
                                                        name="reimburse_detail_document_id"
                                                        className="bg-white leading-4"
                                                        onChange={(e) =>
                                                            handleUploadFileRevised(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                    />
                                                </TD>
                                                <TD className="border px-3">
                                                    {cad.REIMBURSE_DETAIL_STATUS ===
                                                        0 && (
                                                        <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                                            Approve
                                                        </span>
                                                    )}
                                                    {cad.REIMBURSE_DETAIL_STATUS ===
                                                        1 && (
                                                        <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                                                            Reject
                                                        </span>
                                                    )}
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

                        {/* <div className="mt-10">
                            <fieldset className="bg-white pb-10 pt-5 rounded-lg border-2">
                                <legend className="ml-12 bg-gray-300 px-3 font-medium">Delivery Method</legend>
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
                                                    id="REIMBURSE_TRANSFER_AMOUNT"
                                                    type="number"
                                                    name="REIMBURSE_TRANSFER_AMOUNT"
                                                    value={dataById.REIMBURSE_TRANSFER_AMOUNT}
                                                    className="w-full lg:w-1/4 text-right"
                                                    placeholder="0"
                                                    onChange={(e) =>
                                                        setDataById({
                                                            ...dataById,
                                                            REIMBURSE_TRANSFER_AMOUNT: e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                            ) : (
                                                <TextInput
                                                    id="REIMBURSE_TRANSFER_AMOUNT"
                                                    type="number"
                                                    name="REIMBURSE_TRANSFER_AMOUNT"
                                                    value={dataById.REIMBURSE_TRANSFER_AMOUNT}
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
                                                placeholder="Bank Account"
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
                                                    id="REIMBURSE_CASH_AMOUNT"
                                                    type="number"
                                                    name="REIMBURSE_CASH_AMOUNT"
                                                    value={dataById.REIMBURSE_CASH_AMOUNT}
                                                    className="w-5/12 lg:w-1/4 text-right ml-9"
                                                    placeholder="0"
                                                    onChange={(e) =>
                                                        setDataById({
                                                            ...dataById,
                                                            REIMBURSE_CASH_AMOUNT: e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                            ) : (
                                                <TextInput
                                                    id="REIMBURSE_CASH_AMOUNT"
                                                    type="number"
                                                    name="REIMBURSE_CASH_AMOUNT"
                                                    value={dataById.REIMBURSE_CASH_AMOUNT}
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
                        </div> */}

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
                classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 sm:max-w-2xl md:max-w-2xl lg:max-w-4xl xl:max-w-full`}
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
                panelWidth={"70%"}
                body={
                    <>
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
                                    className=""
                                    autoComplete="reimburseNumber"
                                    readOnly
                                />
                            </div>
                            {/* <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="tipe"
                                    value="Type"
                                    className="mb-2"
                                />
                                {dataById.REIMBURSE_TYPE === 1 && (
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
                                {dataById.REIMBURSE_TYPE === 2 && (
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
                                    htmlFor="divisi"
                                    value="Division"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="divisi"
                                    type="text"
                                    name="divisi"
                                    value={dataById.REIMBURSE_DIVISION}
                                    className=""
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
                                    type="TEXT"
                                    name="tanggalPengajuan"
                                    value={dateFormat(
                                        dataById.REIMBURSE_REQUESTED_DATE,
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
                                                        cad.REIMBURSE_DETAIL_DATE,
                                                        "dd-mm-yyyy"
                                                    )}
                                                </TD>
                                                <TD className="border px-3">
                                                    {cad.REIMBURSE_DETAIL_PURPOSE ===
                                                        "1" && "Peruntukan A"}
                                                    {cad.REIMBURSE_DETAIL_PURPOSE ===
                                                        "2" && "Peruntukan B"}
                                                    {cad.REIMBURSE_DETAIL_PURPOSE ===
                                                        "3" && "Peruntukan C"}
                                                </TD>
                                                <TD className="border px-3">
                                                    {cad.REIMBURSE_DETAIL_RELATION_ORGANIZATION_ID ===
                                                        1 && "Perusahaan A"}
                                                    {cad.REIMBURSE_DETAIL_RELATION_ORGANIZATION_ID ===
                                                        2 && "Perusahaan B"}
                                                    {cad.REIMBURSE_DETAIL_RELATION_ORGANIZATION_ID ===
                                                        3 && "Perusahaan C"}
                                                </TD>
                                                <TD className="border px-3">
                                                    {
                                                        cad.REIMBURSE_DETAIL_RELATION_NAME
                                                    }
                                                </TD>
                                                <TD className="border px-3">
                                                    {
                                                        cad.REIMBURSE_DETAIL_RELATION_POSITION
                                                    }
                                                </TD>
                                                <TD className="border px-3">
                                                    {
                                                        cad.REIMBURSE_DETAIL_LOCATION
                                                    }
                                                </TD>
                                                <TD className="border px-3">
                                                    {formatCurrency.format(
                                                        cad.REIMBURSE_DETAIL_AMOUNT
                                                    )}
                                                </TD>
                                                {cad.REIMBURSE_DETAIL_DOCUMENT_ID !== null ? (
                                                    <TD className="border px-3 py-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleFileDownload(
                                                                    cad.REIMBURSE_DETAIL_ID
                                                                )
                                                            }
                                                        >
                                                            <ArrowDownTrayIcon className="w-6 m-auto" />
                                                        </button>
                                                    </TD>
                                                ) : (
                                                    <TD className="border px-3 py-2">-</TD>
                                                )}
                                                <TD className="border px-3">
                                                    {cad.REIMBURSE_DETAIL_STATUS ===
                                                        0 && (
                                                        <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                                            Approve
                                                        </span>
                                                    )}
                                                    {cad.REIMBURSE_DETAIL_STATUS ===
                                                        1 && (
                                                        <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                                                            Reject
                                                        </span>
                                                    )}
                                                </TD>
                                                <TD className="border">
                                                    {cad.REIMBURSE_DETAIL_NOTE}
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
                                        <TD className="border text-center py-2">
                                            {formatCurrency.format(
                                                dataById.REIMBURSE_TOTAL_AMOUNT
                                            )}
                                        </TD>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        {/* Table form end */}

                        <div className="mt-10">
                            <fieldset className="bg-white pb-10 pt-5 rounded-lg border-2">
                                <legend className="ml-12 bg-gray-300 px-3 font-medium">Delivery Method</legend>
                                <div className="mt-4 mx-5 space-y-5">
                                    <div className="relative flex items-start">
                                        <div className="flex h-9 items-center">
                                            <input
                                            id="transfer"
                                            name="transfer"
                                            type="checkbox"
                                            aria-describedby="transfer-description"
                                            className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                                            />
                                        </div>
                                        <div className="flex w-full gap-4">
                                            <div className="ml-3 text-sm leading-9">
                                                <label htmlFor="transfer" className="font-medium text-gray-900">
                                                Transfer
                                                </label>
                                            </div>
                                            <TextInput
                                                id="REIMBURSE_TRANSFER_AMOUNT"
                                                type="number"
                                                name="REIMBURSE_TRANSFER_AMOUNT"
                                                value={dataById.REIMBURSE_TRANSFER_AMOUNT}
                                                className="w-full lg:w-1/4 text-right"
                                                placeholder="0"
                                                onChange={(e) =>
                                                    setDataById({
                                                        ...dataById,
                                                        REIMBURSE_TRANSFER_AMOUNT: e.target.value,
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
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="ml-7">
                                        <div className="mb-5">
                                            <InputLabel
                                                htmlFor="reimburse_transfer_date"
                                                className="mb-2"
                                            >
                                                Transfer Date
                                                <span className="text-red-600">*</span>
                                            </InputLabel>
                                            <TextInput
                                                id="reimburse_transfer_date"
                                                type="date"
                                                name="reimburse_transfer_date"
                                                value={data.reimburse_transfer_date}
                                                className="w-full lg:w-7/12"    
                                                onChange={(e) =>
                                                    setData(
                                                        "reimburse_transfer_date",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="mb-5">
                                            <InputLabel
                                                htmlFor="reimburse_from_bank_account"
                                                className="mb-2"
                                            >
                                                From Bank Account
                                                <span className="text-red-600">*</span>
                                            </InputLabel>
                                            <select name="reimburse_from_bank_account" id="reimburse_from_bank_account" className="block w-full lg:w-7/12 rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                            onChange={(e) =>
                                                setData(
                                                    "reimburse_from_bank_account",
                                                    e.target.value
                                                )
                                            }
                                            required>
                                                <option value="">-- Choose Bank Account --</option>
                                                <option value="Bank 1">Bank 1</option>
                                                <option value="Bank 2">Bank 2</option>
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
                                            />
                                        </div>
                                        <div className="flex w-full">
                                            <div className="ml-3 text-sm leading-9">
                                                <label htmlFor="cash" className="font-medium text-gray-900">
                                                Cash
                                                </label>
                                            </div>
                                            <TextInput
                                                id="REIMBURSE_CASH_AMOUNT"
                                                type="number"
                                                name="REIMBURSE_CASH_AMOUNT"
                                                value={dataById.REIMBURSE_CASH_AMOUNT}
                                                className="w-full lg:w-6/12 text-right ml-9"
                                                placeholder="0"
                                                onChange={(e) =>
                                                    setDataById({
                                                        ...dataById,
                                                        REIMBURSE_CASH_AMOUNT: e.target.value,
                                                    })
                                                }
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="ml-7">
                                        <div className="mb-5">
                                            <InputLabel
                                                htmlFor="reimburse_receive_date"
                                                className="mb-2"
                                            >
                                                Receive Date
                                                <span className="text-red-600">*</span>
                                            </InputLabel>
                                            <TextInput
                                                id="reimburse_receive_date"
                                                type="date"
                                                name="reimburse_receive_date"
                                                value={data.reimburse_receive_date}
                                                className="w-full lg:w-7/12"
                                                placeholder="Bank Account"
                                                onChange={(e) =>
                                                    setData(
                                                        "reimburse_receive_date",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <InputLabel
                                                htmlFor="receive_name"
                                                className="mb-2"
                                            >
                                                Receive Name
                                                <span className="text-red-600">*</span>
                                            </InputLabel>
                                            <TextInput
                                                id="reimburse_receive_name"
                                                type="text"
                                                name="reimburse_receive_name"
                                                value={data.reimburse_receive_name}
                                                className="w-full lg:w-7/12"
                                                onChange={(e) =>
                                                    setData(
                                                        "reimburse_receive_name",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
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
                                value={dataById.REIMBURSE_REQUEST_NOTE}
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
                classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 sm:max-w-2xl md:max-w-2xl lg:max-w-4xl xl:max-w-full`}
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
                    })
                }
                title={"Report Reimburse"}
                url={`/reimburseReport`}
                data={data}
                onSuccess={handleSuccess}
                panelWidth={"65%"}
                body={
                    <>
                        <div className="grid md:grid-cols-2 my-10">
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="reimburseNumber"
                                    className="mb-2"
                                >
                                    Reimburse Number{" "}
                                    <span className="text-red-600">*</span>
                                </InputLabel>
                                <select
                                    id="reimburseNumber"
                                    name="reimburseNumber"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    onChange={(e) =>
                                        setData(
                                            "reimburse_number",
                                            e.target.value
                                        )
                                    }
                                    required
                                >
                                    <option value="">-- Choose Reimburse --</option>
                                    {CANumber.map((ca: any) => (
                                        <option
                                            key={ca.REIMBURSE_ID}
                                            value={ca.REIMBURSE_ID}
                                        >
                                            {ca.REIMBURSE_NUMBER}
                                        </option>
                                    ))}
                                </select>
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
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="namaPemberiApproval"
                                    className="mb-2"
                                >
                                    Request for Approval{" "}
                                    <span className="text-red-600">*</span>
                                </InputLabel>
                                <select
                                    id="namaPemberiApproval"
                                    name="namaPemberiApproval"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    onChange={(e) =>
                                        setData(
                                            "reimburse_first_approval_by",
                                            e.target.value
                                        )
                                    }
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
                                        {DataReportRow.length > 1 && (
                                            <TH
                                                label="Action"
                                                className="border px-3 py-2"
                                                rowSpan="2"
                                            />
                                        )}
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
                                    {DataReportRow.map((val, i) => (
                                        <tr className="text-center" key={i}>
                                            <TD className="border">{i + 1}.</TD>
                                            <TD className="border">
                                                <TextInput
                                                    id="reimburse_detail_date"
                                                    type="date"
                                                    name="reimburse_detail_date"
                                                    value={val.reimburse_detail_date}
                                                    className="w-1/2"
                                                    autoComplete="reimburse_detail_date"
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
                                                    id="reimburse_detail_end_date"
                                                    type="date"
                                                    name="reimburse_detail_end_date"
                                                    value={val.reimburse_detail_end_date}
                                                    className="w-1/2"
                                                    autoComplete="reimburse_detail_end_date"
                                                    onChange={(e) =>
                                                        handleChangeAddReport(
                                                            e,
                                                            i
                                                        )
                                                    }
                                                />
                                            </TD>
                                            <TD className="border">
                                            <select
                                                    id="reimburse_detail_purpose"
                                                    name="reimburse_detail_purpose"
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
                                                        -- Choose purpose --
                                                    </option>
                                                    {purposes.map((purpose) => (
                                                        <option
                                                            key={purpose.id}
                                                            value={purpose.id}
                                                        >
                                                            {purpose.purpose}
                                                        </option>
                                                    ))}
                                                </select>
                                            </TD>
                                            <TD className="border">
                                                <select
                                                    id="reimburse_detail_relation_organization_id"
                                                    name="reimburse_detail_relation_organization_id"
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
                                                    {companies.map(
                                                        (company) => (
                                                            <option
                                                                key={company.id}
                                                                value={
                                                                    company.id
                                                                }
                                                            >
                                                                {
                                                                    company.nama_perusahaan
                                                                }
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            </TD>
                                            <TD className="border">
                                                <TextInput
                                                    id="reimburse_detail_relation_name"
                                                    type="text"
                                                    name="reimburse_detail_relation_name"
                                                    value={val.reimburse_detail_relation_name}
                                                    className="w-1/2"
                                                    autoComplete="reimburse_detail_relation_name"
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
                                                    id="reimburse_detail_relation_position"
                                                    type="text"
                                                    name="reimburse_detail_relation_position"
                                                    value={val.reimburse_detail_relation_position}
                                                    className="w-1/2"
                                                    autoComplete="reimburse_detail_relation_position"
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
                                                    id="reimburse_detail_location"
                                                    type="text"
                                                    name="reimburse_detail_location"
                                                    value={val.reimburse_detail_location}
                                                    className="w-1/2"
                                                    autoComplete="reimburse_detail_location"
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
                                                    id="reimburse_detail_amount"
                                                    type="number"
                                                    name="reimburse_detail_amount"
                                                    value={val.reimburse_detail_amount}
                                                    className="w-1/2 text-right"
                                                    autoComplete="reimburse_detail_amount"
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
                                                <input
                                                    type="file"
                                                    id="reimburse_detail_document_id"
                                                    name="reimburse_detail_document_id"
                                                    className="bg-white leading-4"
                                                    multiple
                                                    onChange={(e) =>
                                                        handleUploadFile(e, i)
                                                    }
                                                />
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
                                                className="mt-5 px-2 py-1 ml-2 bg-blue-600 hover:bg-blue-500 text-sm"
                                                onClick={(e) =>
                                                    handleAddReportRow(e)
                                                }
                                                type="button"
                                            >
                                                +
                                            </Button>
                                        </TD>
                                        <TD
                                            className="text-right pr-5 font-bold"
                                            colSpan={6}
                                        >
                                            TOTAL AMOUNT
                                        </TD>
                                        <TD>
                                            0
                                        </TD>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        {/* Table form end */}

                        {/* <p className="mt-5">{JSON.stringify(DataRow)}</p> */}

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
                                    setData("reimburse_request_note", e.target.value)
                                }
                                readOnly
                                //
                            />
                        </div>
                        <div className="grid md:grid-cols-2 my-10">
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="refundType"
                                    className="mb-2"
                                >
                                    Refund Type
                                    <span className="text-red-600">*</span>
                                </InputLabel>
                                <select
                                    id="refundType"
                                    name="refundType"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    onChange={(e) =>
                                        setData("refund_type", e.target.value)
                                    }
                                >
                                    <option value="">
                                        -- Pilih Refund Type --
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
                                    <span className="text-red-600">*</span>
                                </InputLabel>
                                <input
                                    type="file"
                                    id="refundProof"
                                    name="refundProof"
                                    className="w-full bg-white leading-4"
                                    onChange={(e: any) =>
                                        setData("refund_proof", e.target.files)
                                    }
                                />
                            </div>
                        </div>
                    </>
                }
            />
            {/* Modal Report End */}

            {/* Modal Search Reimburse */}
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
                    })
                }
                title={"Search Reimburse"}
                submitButtonName={"Search"}
                onAction={() => {
                    getReimburse();
                }}
                isLoading={isLoading}
                body={
                    <>
                        <div className="mb-4">
                            <InputLabel
                                htmlFor="REIMBURSE_NUMBER"
                                value="Reimburse Number"
                            />
                            <TextInput
                                id="REIMBURSE_NUMBER"
                                type="text"
                                name="REIMBURSE_NUMBER"
                                value={searchReimburse.REIMBURSE_NUMBER}
                                className=""
                                onChange={(e) =>
                                    setSearchReimburse({
                                        ...searchReimburse,
                                        REIMBURSE_NUMBER: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </>
                }
            />
            {/* End Modal Search Reimburse */}

            {/* Modal Search Reimburse Report */}
            {/* <ModalSearch
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
                    })
                }
                title={"Search Reimburse Report"}
                submitButtonName={"Search"}
                onAction={() => getReportCA()}
                isLoading={isLoading}
                body={
                    <>
                        <div className="mb-4">
                            <InputLabel
                                htmlFor="REIMBURSE_NUMBER"
                                value="Reimburse Number"
                            />
                            <TextInput
                                id="REIMBURSE_NUMBER"
                                type="text"
                                name="REIMBURSE_NUMBER"
                                value={searchReimburse.REIMBURSE_NUMBER}
                                className=""
                                onChange={(e) =>
                                    setSearchReimburse({
                                        ...searchReimburse,
                                        REIMBURSE_NUMBER: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </>
                }
            /> */}
            {/* End Modal Search Reimburse Report */}

            {/* Content Start */}
            {/* <div className="max-w-0xl mx-auto sm:px-6 lg:px-0"> */}
            <div className="p-6 text-gray-900 mb-60">
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
                <div className="rounded-tr-md rounded-br-md rounded-bl-md bg-white pt-5 pb-1 px-10 shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="grid sm:gap-2 sm:grid-cols-2 md:grid-cols-6 md:gap-4 lg:grid-cols-8">
                        <Button
                            className="text-sm font-semibold mb-4 px-6 py-1.5 md:col-span-2 lg:col-auto bg-red-600 hover:bg-red-500"
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
                                });
                            }}
                        >
                            {"Add Reimburse"}
                        </Button>
                    </div>
                </div>
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
                                            search: !modal.search,
                                            search_ca_report: false,
                                            approve: false,
                                            report: false,
                                            execute: false,
                                        });
                                    }}
                                >
                                    <MagnifyingGlassIcon
                                        className="mx-2 h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                    Search Reimburse
                                </button>
                            </div>
                            <div className="flex justify-center items-center">
                                <Button
                                    className="mb-4 w-40 py-1.5 px-2"
                                    onClick={() => clearSearchReimburse()}
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
                                            label={"Reimburse Number"}
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
                                    {reimburse.data === undefined && (
                                        <tr>
                                            <TD
                                                className="leading-10 text-gray-500"
                                                colSpan="9"
                                            >
                                                Please Search Reimburse
                                            </TD>
                                        </tr>
                                    )}
                                    {reimburse.data?.length === 0 ? (
                                        <tr>
                                            <TD
                                                className="leading-10 text-gray-500"
                                                colSpan="9"
                                            >
                                                Data not available
                                            </TD>
                                        </tr>
                                    ) : (
                                        reimburse.data?.map(
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
                                                            ca.REIMBURSE_NUMBER
                                                        }
                                                        className=""
                                                    />
                                                    <TableTD
                                                        value={dateFormat(
                                                            ca.REIMBURSE_REQUESTED_DATE,
                                                            "dd mmmm yyyy"
                                                        )}
                                                        className=""
                                                    />
                                                    <TableTD
                                                        value={formatCurrency.format(
                                                            ca.REIMBURSE_TOTAL_AMOUNT
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
                                                    <TableTD
                                                        value=""
                                                        className=""
                                                    />
                                                    <TableTD
                                                        value=""
                                                        className=""
                                                    />
                                                    <TableTD
                                                        value=""
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
                                                                                handleApproveModal(
                                                                                    e,
                                                                                    ca.REIMBURSE_ID
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
                                                                                handleShowModal(
                                                                                    e,
                                                                                    ca.REIMBURSE_ID
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
                                                                                handleRevisedModal(
                                                                                    e,
                                                                                    ca.REIMBURSE_ID
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
                                                                                    ca.REIMBURSE_ID
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
            {/* </div> */}
            {/* Content End */}
        </AuthenticatedLayout>
    );
}
