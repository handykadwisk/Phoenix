import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import InputLabel from "@/Components/InputLabel";
import TableTH from "@/Components/Table/TableTH";
import Table from "@/Components/Table/Index";
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
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import dateFormat, { masks } from "dateformat";
import ModalSearch from "@/Components/Modal/ModalSearch";

export default function CashAdvance({ auth }: PageProps) {
    // useEffect(() => {
    //     getCA();
    // }, []);

    // Modal Add Start
    const [modal, setModal] = useState({
        add: false,
        delete: false,
        edit: false,
        view: false,
        document: false,
        search: false,
        approve: false,
        report: false,
    });
    // Modal Add End

    const { data, setData, errors, reset } = useForm({
        tipe: "",
        nama_pemohon: "",
        nama_pengguna: "",
        divisi: "",
        tanggal_pengajuan: "",
        nama_pemberi_approval: "",
        catatan: "",
        total_pengajuan: "",
        CashAdvanceDetail: [
            {
                tanggalKegiatan: "",
                peruntukan: "",
                nama: "",
                posisi: "",
                perusahaan: "",
                tempat: "",
                jumlah: "",
                keterangan: "",
            },
        ],
    });

    // Handle Success Start
    const [isSuccess, setIsSuccess] = useState<string>("");

    const handleSuccess = (message: string) => {
        setIsSuccess("");
        reset();
        setData({
            tipe: "",
            nama_pemohon: "",
            nama_pengguna: "",
            divisi: "",
            tanggal_pengajuan: "",
            nama_pemberi_approval: "",
            catatan: "",
            total_pengajuan: "",
            CashAdvanceDetail: [
                {
                    tanggalKegiatan: "",
                    peruntukan: "",
                    nama: "",
                    posisi: "",
                    perusahaan: "",
                    tempat: "",
                    jumlah: "",
                    keterangan: "",
                },
            ],
        });
        getCA();
        setIsSuccess(message);
    };
    // Handle Success End

    const [dataById, setDataById] = useState<any>({
        // EXPENSES_NUMBER: "",
        // EXPENSES_TYPE: "",
        // DIVISION: "",
        // USED_BY: "",
        // EXPENSES_REQUESTED_BY: "",
        // EXPENSES_REQUESTED_DATE: "",
        // FIRST_APPROVAL_USER: "",
        // EXPENSES_REQUEST_NOTE: "",
        // EXPENSES_TOTAL_AMOUNT: "",
        cash_advance_detail: [
            {
                EXPENSES_DETAIL_ID: "",
                EXPENSES_DETAIL_PURPOSE: "",
                EXPENSES_DETAIL_LOCATION: "",
                EXPENSES_DETAIL_AMOUNT: "",
                EXPENSES_DETAIL_NOTE: "",
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
            tanggalKegiatan: "",
            peruntukan: "",
            nama: "",
            posisi: "",
            perusahaan: "",
            tempat: "",
            jumlah: "",
            keterangan: "",
        },
    ]);

    const handleAddRow = (e: FormEvent) => {
        e.preventDefault();

        setDataRow([
            ...DataRow,
            {
                tanggalKegiatan: "",
                peruntukan: "",
                nama: "",
                posisi: "",
                perusahaan: "",
                tempat: "",
                jumlah: "",
                keterangan: "",
            },
        ]);

        setData("CashAdvanceDetail", [
            ...data.CashAdvanceDetail,
            {
                tanggalKegiatan: "",
                peruntukan: "",
                nama: "",
                posisi: "",
                perusahaan: "",
                tempat: "",
                jumlah: "",
                keterangan: "",
            },
        ]);
    };
    // Handle Add Row End

    // Handle Remove Row Start
    const handleRemoveRow = (i: number) => {
        const deleteRow = [...data.CashAdvanceDetail];

        deleteRow.splice(i, 1);

        setDataRow(deleteRow);

        setData("CashAdvanceDetail", deleteRow);
    };
    // Handle Remove Row End

    // Handle Change Add Start
    const handleChangeAdd = (e: any, i: number) => {
        const { name, value } = e.target;

        const onchangeVal: any = [...data.CashAdvanceDetail];

        onchangeVal[i][name] = value;

        setDataRow(onchangeVal);

        setData("CashAdvanceDetail", onchangeVal);
    };
    // Handle Change Add End

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

    // Handle Remove Row Revised Start
    const handleRemoveRowRevised = (i: number) => {
        const deleteRow = [...dataById.cash_advance_detail];

        deleteRow.splice(i, 1);

        setDataById({ ...dataById, cash_advance_detail: deleteRow });
    };
    // Handle Remove Row Revised End

    const [cashAdvance, setCA] = useState<any>([]);

    // Search Start
    const [searchCA, setSearchCA] = useState<any>({
        EXPENSES_NUMBER: "",
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getCA = async (pageNumber = "page=1") => {
        setIsLoading(true);
        await axios
            .post(`/getCA?${pageNumber}`, {
                EXPENSES_NUMBER: searchCA.EXPENSES_NUMBER,
            })
            .then((res) => {
                setCA(res.data);
                setIsLoading(false);
                if (modal.search) {
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                        approve: false,
                        report: false,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };
    // Search End

    // Clear Search Start
    const clearSearchCA = async (pageNumber = "page=1") => {
        await axios
            .post(`/getCA?${pageNumber}`)
            .then((res) => {
                setCA([]);
                setSearchCA({
                    ...searchCA,
                    EXPENSES_NUMBER: "",
                });

                // console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    // Clear Search End

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
    const { users }: any = usePage().props;
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
            type: "Cash Advance",
        },
        {
            id: 2,
            type: "Reimburse",
        },
    ];

    const refunds = [
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
            approve: !modal.approve,
            report: false,
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
            approve: false,
            report: false,
        });
    };
    // Handle Revised End

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
            approve: false,
            report: false,
        });
    };
    // Handle Show End

    const handleBtnStatus = async (status: number) => {
        setDataById({
            ...dataById,
            FIRST_APPROVAL_STATUS: status,
        });

        console.log(dataById);

        await axios
            .patch(`/cashAdvanceApprove/${dataById.EXPENSES_ID}`, dataById, {
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

    // Function Format Currency
    const formatCurrency = new Intl.NumberFormat("default", {
        style: "currency",
        currency: "IDR",
    });
    // End Function Format Currency

    let total = 0;

    DataRow.forEach((item) => {
        total += Number(item.jumlah);
    });

    let revised_total_amount = 0;

    dataById.cash_advance_detail.forEach((item: any) => {
        revised_total_amount += Number(item.EXPENSES_DETAIL_AMOUNT);
    });

    console.log(data);
    console.log(DataRow);
    console.log("Cash Advance", cashAdvance.data);
    console.log("Data By Id", dataById);

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
                classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 sm:max-w-2xl md:max-w-2xl lg:max-w-4xl xl:max-w-7xl`}
                show={modal.add}
                onClose={() =>
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                        approve: false,
                        report: false,
                    })
                }
                title={"Add Cash Advance"}
                url={route("cashAdvance.store")}
                data={data}
                onSuccess={handleSuccess}
                panelWidth={"65%"}
                body={
                    <>
                        <div className="grid md:grid-cols-2 my-10">
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="tipe"
                                    value="Tipe"
                                    className="mb-2"
                                />
                                <select
                                    id="tipe"
                                    name="tipe"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    onChange={(e) =>
                                        setData("tipe", e.target.value)
                                    }
                                    required
                                >
                                    <option value="">-- Pilih Tipe --</option>
                                    {types.map((type: any) => (
                                        <option key={type.id} value={type.id}>
                                            {type.type}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="namaPemohon"
                                    value="Nama Pemohon"
                                    className="mb-2"
                                />
                                <select
                                    id="namaPemohon"
                                    name="namaPemohon"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    onChange={(e) =>
                                        setData("nama_pemohon", e.target.value)
                                    }
                                    required
                                >
                                    <option value="">
                                        -- Pilih Nama Pemohon --
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
                                    htmlFor="refundType"
                                    value="Nama Pengguna"
                                    className="mb-2"
                                />
                                <select
                                    id="refundType"
                                    name="refundType"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    onChange={(e) =>
                                        setData("nama_pengguna", e.target.value)
                                    }
                                    required
                                >
                                    <option value="">
                                        -- Pilih Pengguna --
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
                                    htmlFor="divisi"
                                    value="Divisi"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="divisi"
                                    type="text"
                                    name="divisi"
                                    value={data.divisi}
                                    className=""
                                    autoComplete="divisi"
                                    onChange={(e) =>
                                        setData("divisi", e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="tanggalPengajuan"
                                    value="Tanggal Pengajuan"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="tanggalPengajuan"
                                    type="date"
                                    name="tanggalPengajuan"
                                    value={data.tanggal_pengajuan}
                                    className=""
                                    autoComplete="tanggalPengajuan"
                                    onChange={(e) =>
                                        setData(
                                            "tanggal_pengajuan",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="namaPemberiApproval"
                                    value="Nama Pemberi Approval"
                                    className="mb-2"
                                />
                                <select
                                    id="namaPemberiApproval"
                                    name="namaPemberiApproval"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    onChange={(e) =>
                                        setData(
                                            "nama_pemberi_approval",
                                            e.target.value
                                        )
                                    }
                                    required
                                >
                                    <option value="">
                                        -- Nama Pemberi Approval --
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
                                            label="Tanggal Kegiatan"
                                            className="border"
                                            rowSpan="2"
                                        />
                                        <TH
                                            label="Peruntukan"
                                            className="border"
                                            rowSpan="2"
                                        />
                                        <TH
                                            label="Relasi"
                                            className="border"
                                            colSpan="3"
                                        />
                                        <TH
                                            label="Tempat"
                                            className="border"
                                            rowSpan="2"
                                        />
                                        <TH
                                            label="Jumlah"
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
                                        <TH label="Nama" className="border" />
                                        <TH label="Posisi" className="border" />
                                        <TH
                                            label="Perusahaan"
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
                                                    id="tanggalKegiatan"
                                                    type="date"
                                                    name="tanggalKegiatan"
                                                    value={val.tanggalKegiatan}
                                                    className="w-1/2"
                                                    autoComplete="tanggalKegiatan"
                                                    onChange={(e) =>
                                                        handleChangeAdd(e, i)
                                                    }
                                                    required
                                                />
                                            </TD>
                                            <TD className="border">
                                                <TextInput
                                                    id="peruntukan"
                                                    type="text"
                                                    name="peruntukan"
                                                    value={val.peruntukan}
                                                    className="w-1/2"
                                                    autoComplete="peruntukan"
                                                    onChange={(e) =>
                                                        handleChangeAdd(e, i)
                                                    }
                                                    required
                                                />
                                            </TD>
                                            <TD className="border">
                                                <TextInput
                                                    id="nama"
                                                    type="text"
                                                    name="nama"
                                                    value={val.nama}
                                                    className="w-1/2"
                                                    autoComplete="nama"
                                                    onChange={(e) =>
                                                        handleChangeAdd(e, i)
                                                    }
                                                    required
                                                />
                                            </TD>
                                            <TD className="border">
                                                <TextInput
                                                    id="posisi"
                                                    type="text"
                                                    name="posisi"
                                                    value={val.posisi}
                                                    className="w-1/2"
                                                    autoComplete="posisi"
                                                    onChange={(e) =>
                                                        handleChangeAdd(e, i)
                                                    }
                                                    required
                                                />
                                            </TD>
                                            <TD className="border">
                                                <select
                                                    id="perusahaan"
                                                    name="perusahaan"
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                    required
                                                    onChange={(e) =>
                                                        handleChangeAdd(e, i)
                                                    }
                                                >
                                                    <option value="">
                                                        --Pilih Perusahaan--
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
                                                    id="tempat"
                                                    type="text"
                                                    name="tempat"
                                                    value={val.tempat}
                                                    className="w-1/2"
                                                    autoComplete="tempat"
                                                    onChange={(e) =>
                                                        handleChangeAdd(e, i)
                                                    }
                                                    required
                                                />
                                            </TD>
                                            <TD className="border">
                                                <TextInput
                                                    id="jumlah"
                                                    type="number"
                                                    name="jumlah"
                                                    value={val.jumlah}
                                                    className="w-1/2"
                                                    autoComplete="jumlah"
                                                    onChange={(e) =>
                                                        handleChangeAdd(e, i)
                                                    }
                                                    placeholder="0"
                                                    required
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
                                                +Tambah Kegiatan
                                            </Button>
                                        </TD>
                                        <TD
                                            className="text-right pr-5 font-bold"
                                            colSpan={5}
                                        >
                                            TOTAL PENGAJUAN
                                        </TD>
                                        <TD>
                                            {formatCurrency.format(total)}
                                            {/* <TextInput
                                                id="totalJumlah"
                                                type="text"
                                                name="totalJumlah"
                                                value={total}
                                                className="w-1/2"
                                                autoComplete="totalJumlah"
                                                onChange={(e) =>
                                                    setData(
                                                        "total_pengajuan",
                                                        e.target.value
                                                    )
                                                }
                                                readOnly
                                            /> */}
                                        </TD>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        {/* Table form end */}

                        {/* <p className="mt-5">{JSON.stringify(DataRow)}</p> */}

                        <div className="w-full p-2 mt-5">
                            <InputLabel
                                htmlFor="catatan"
                                value="Catatan"
                                className="mb-2"
                            />
                            <Textarea
                                id="catatan"
                                name="catatan"
                                className="resize-none border-0 focus:ring-2 focus:ring-inset focus:ring-red-600"
                                rows={5}
                                value={data.catatan}
                                onChange={(e) =>
                                    setData("catatan", e.target.value)
                                }
                                //
                            />
                        </div>
                    </>
                }
            />
            {/* Modal Add End */}

            {/* Modal Detail Start */}
            <ModalToAction
                classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 sm:max-w-2xl md:max-w-2xl lg:max-w-4xl xl:max-w-7xl`}
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
                        approve: false,
                        report: false,
                    })
                }
                title="Detail Cash Advance"
                url=""
                data=""
                method=""
                onSuccess=""
                headers=""
                submitButtonName=""
                panelWidth={"65%"}
                body={
                    <>
                        <div className="grid md:grid-cols-2 my-10">
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="expensesNumber"
                                    value="Expenses Number"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="expensesNumber"
                                    type="text"
                                    name="expensesNumber"
                                    value={dataById.EXPENSES_NUMBER}
                                    className=""
                                    autoComplete="expensesNumber"
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            EXPENSES_NUMBER: e.target.value,
                                        })
                                    }
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="tipe"
                                    value="Tipe"
                                    className="mb-2"
                                />
                                {dataById.EXPENSES_TYPE === 1 && (
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
                                {dataById.EXPENSES_TYPE === 2 && (
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
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="namaPemohon"
                                    value="Nama Pemohon"
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
                                    value="Nama Pengguna"
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
                                    value="Divisi"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="divisi"
                                    type="text"
                                    name="divisi"
                                    value={dataById.DIVISION}
                                    className=""
                                    autoComplete="divisi"
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
                                    value="Tanggal Pengajuan"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="tanggalPengajuan"
                                    type="text"
                                    name="tanggalPengajuan"
                                    value={dateFormat(
                                        dataById.EXPENSES_REQUESTED_DATE,
                                        "dd/mm/yyyy"
                                    )}
                                    className=""
                                    autoComplete="tanggalPengajuan"
                                    onChange={(e) =>
                                        setData(
                                            "tanggal_pengajuan",
                                            e.target.value
                                        )
                                    }
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="namaPemberiApproval"
                                    value="Nama Pemberi Approval"
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
                                            className="border px-5"
                                            rowSpan="2"
                                        />
                                        <TH
                                            label="Tanggal Kegiatan"
                                            className="border px-5"
                                            rowSpan="2"
                                        />
                                        <TH
                                            label="Peruntukan"
                                            className="border px-5"
                                            rowSpan="2"
                                        />
                                        <TH
                                            label="Relasi"
                                            className="border px-5"
                                            colSpan="3"
                                        />
                                        <TH
                                            label="Tempat"
                                            className="border px-5"
                                            rowSpan="2"
                                        />
                                        <TH
                                            label="Jumlah"
                                            className="border px-5"
                                            rowSpan="2"
                                        />
                                    </tr>
                                    <tr className="text-center text-gray-700 leading-7">
                                        <TH label="Nama" className="border" />
                                        <TH label="Posisi" className="border" />
                                        <TH
                                            label="Perusahaan"
                                            className="border"
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
                                                <TD className="border">
                                                    {dateFormat(
                                                        cad.EXPENSES_DETAIL_DATE,
                                                        "dd/mm/yyyy"
                                                    )}
                                                </TD>
                                                <TD className="border px-5">
                                                    {
                                                        cad.EXPENSES_DETAIL_PURPOSE
                                                    }
                                                </TD>
                                                <TD className="border px-5">
                                                    {
                                                        cad.EXPENSES_DETAIL_RELATION_NAME
                                                    }
                                                </TD>
                                                <TD className="border px-5">
                                                    {
                                                        cad.EXPENSES_DETAIL_RELATION_POSITION
                                                    }
                                                </TD>
                                                {cad.RELATION_ORGANIZATION_ID ===
                                                    1 && (
                                                    <TD className="border px-5">
                                                        Perusahaan A
                                                    </TD>
                                                )}
                                                {cad.RELATION_ORGANIZATION_ID ===
                                                    2 && (
                                                    <TD className="border px-5">
                                                        Perusahaan B
                                                    </TD>
                                                )}
                                                {cad.RELATION_ORGANIZATION_ID ===
                                                    3 && (
                                                    <TD className="border px-5">
                                                        Perusahaan C
                                                    </TD>
                                                )}
                                                <TD className="border px-5">
                                                    {
                                                        cad.EXPENSES_DETAIL_LOCATION
                                                    }
                                                </TD>
                                                <TD className="border px-5">
                                                    {formatCurrency.format(
                                                        cad.EXPENSES_DETAIL_AMOUNT
                                                    )}
                                                </TD>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr className="text-center text-black text-sm leading-7">
                                        <TD
                                            className="border text-right pr-5"
                                            colSpan={7}
                                        >
                                            TOTAL PENGAJUAN
                                        </TD>
                                        <TD className="border">
                                            {formatCurrency.format(
                                                dataById.EXPENSES_TOTAL_AMOUNT
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
                                htmlFor="catatan"
                                value="Catatan"
                                className="mb-2"
                            />
                            <Textarea
                                id="catatan"
                                name="catatan"
                                className="resize-none border-0 focus:ring-2 focus:ring-inset focus:ring-red-600"
                                rows={5}
                                value={dataById.EXPENSES_REQUEST_NOTE}
                                onChange={(e) =>
                                    setData("catatan", e.target.value)
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
                classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 sm:max-w-2xl md:max-w-2xl lg:max-w-4xl xl:max-w-7xl`}
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
                        approve: false,
                        report: false,
                    })
                }
                title="Approve Cash Advance"
                url={`/cashAdvanceApprove/${dataById.cash_advance_detail.EXPENSES_DETAIL_ID}`}
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
                                    htmlFor="expensesNumber"
                                    value="Expenses Number"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="expensesNumber"
                                    type="text"
                                    name="expensesNumber"
                                    value={dataById.EXPENSES_NUMBER}
                                    className=""
                                    autoComplete="expensesNumber"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="tipe"
                                    value="Tipe"
                                    className="mb-2"
                                />
                                {dataById.EXPENSES_TYPE === 1 && (
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
                                {dataById.EXPENSES_TYPE === 2 && (
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
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="namaPemohon"
                                    value="Nama Pemohon"
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
                                    value="Nama Pengguna"
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
                                    value="Divisi"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="divisi"
                                    type="text"
                                    name="divisi"
                                    value={dataById.DIVISION}
                                    className=""
                                    autoComplete="divisi"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="tanggalPengajuan"
                                    value="Tanggal Pengajuan"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="tanggalPengajuan"
                                    type="TEXT"
                                    name="tanggalPengajuan"
                                    value={dateFormat(
                                        dataById.EXPENSES_REQUESTED_DATE,
                                        "dd/mm/yyyy"
                                    )}
                                    className=""
                                    autoComplete="tanggalPengajuan"
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="namaPemberiApproval"
                                    value="Nama Pemberi Approval"
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
                                            className="border p-3"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Tanggal Kegiatan"
                                            className="border p-3"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Kegiatan"
                                            className="border p-3"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Tempat"
                                            className="border p-3"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Relasi"
                                            className="border p-3"
                                            colSpan={3}
                                        />
                                        <TH
                                            label="Jumlah"
                                            className="border p-3"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Approval"
                                            className="border p-3"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Keterangan"
                                            className="border p-3"
                                            rowSpan={2}
                                        />
                                    </tr>
                                    <tr className="text-center">
                                        <TH
                                            label="Nama Client"
                                            className="border p-3"
                                        />
                                        <TH
                                            label="Posisi"
                                            className="border p-3"
                                        />
                                        <TH
                                            label="Perusahaan"
                                            className="border p-3"
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
                                                <TD className="border">
                                                    {dateFormat(
                                                        cad.EXPENSES_DETAIL_DATE,
                                                        "dd-mm-yyyy"
                                                    )}
                                                </TD>
                                                <TD className="border px-3">
                                                    {
                                                        cad.EXPENSES_DETAIL_PURPOSE
                                                    }
                                                </TD>
                                                <TD className="border px-3">
                                                    {
                                                        cad.EXPENSES_DETAIL_LOCATION
                                                    }
                                                </TD>
                                                <TD className="border px-3">
                                                    {
                                                        cad.EXPENSES_DETAIL_RELATION_NAME
                                                    }
                                                </TD>
                                                <TD className="border px-3">
                                                    {
                                                        cad.EXPENSES_DETAIL_RELATION_POSITION
                                                    }
                                                </TD>
                                                <TD className="border px-3">
                                                    {cad.RELATION_ORGANIZATION_ID ===
                                                        1 && "Perusahaan A"}
                                                    {cad.RELATION_ORGANIZATION_ID ===
                                                        2 && "Perusahaan B"}
                                                    {cad.RELATION_ORGANIZATION_ID ===
                                                        3 && "Perusahaan C"}
                                                </TD>
                                                <TD className="border px-3">
                                                    {formatCurrency.format(
                                                        cad.EXPENSES_DETAIL_AMOUNT
                                                    )}
                                                </TD>
                                                <TD className="border">
                                                    <select
                                                        name="EXPENSES_DETAIL_STATUS"
                                                        id="EXPENSES_DETAIL_STATUS"
                                                        value={
                                                            cad.EXPENSES_DETAIL_STATUS
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
                                                    {/* <Button className="bg-red-600 hover:bg-red-500 p-1 my-2 m-1 text-xs">
                                                        Reject
                                                    </Button>
                                                    <Button className="bg-green-600 hover:bg-green-500 p-1 m-1 text-xs">
                                                        Approve
                                                    </Button> */}
                                                </TD>
                                                <TD className="border">
                                                    <TextInput
                                                        id="EXPENSES_DETAIL_NOTE"
                                                        type="text"
                                                        name="EXPENSES_DETAIL_NOTE"
                                                        value={
                                                            cad.EXPENSES_DETAIL_NOTE
                                                        }
                                                        className="w-1/2"
                                                        autoComplete="EXPENSES_DETAIL_NOTE"
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
                                            className="border text-right pr-5"
                                            colSpan={7}
                                        >
                                            TOTAL PENGAJUAN
                                        </TD>
                                        <TD className="border text-center">
                                            {formatCurrency.format(
                                                dataById.EXPENSES_TOTAL_AMOUNT
                                            )}
                                        </TD>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        {/* Table form end */}

                        <div className="w-full p-2 mt-5">
                            <InputLabel
                                htmlFor="catatan"
                                value="Catatan"
                                className="mb-2"
                            />
                            <Textarea
                                id="catatan"
                                name="catatan"
                                className="resize-none border-0 focus:ring-2 focus:ring-inset focus:ring-red-600"
                                rows={5}
                                value={dataById.EXPENSES_REQUEST_NOTE}
                                readOnly
                            />
                        </div>

                        <div className="p-2 my-5">
                            <table className="w-2/6 table-auto">
                                <thead>
                                    <tr>
                                        <TableTH
                                            label="STATUS PENGAJUAN"
                                            className="uppercase"
                                        />
                                    </tr>
                                    <tr>
                                        <TableTH
                                            label="Tanggal & Jam"
                                            className=""
                                        />
                                        <TableTH label="Nama" className="" />
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
                                            value="Dibuat"
                                            className="border-none"
                                        />
                                    </tr>
                                </tbody>
                            </table>
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
                classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 sm:max-w-2xl md:max-w-2xl lg:max-w-4xl xl:max-w-7xl`}
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
                        approve: false,
                        report: false,
                    })
                }
                title="Revised Cash Advance"
                url={`/cashAdvanceRevised/${dataById.EXPENSES_ID}`}
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
                                    htmlFor="expensesNumber"
                                    value="Expenses Number"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="expensesNumber"
                                    type="text"
                                    name="expensesNumber"
                                    value={dataById.EXPENSES_NUMBER}
                                    className=""
                                    autoComplete="expensesNumber"
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            EXPENSES_NUMBER: e.target.value,
                                        })
                                    }
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="tipe"
                                    value="Tipe"
                                    className="mb-2"
                                />
                                {dataById.EXPENSES_TYPE === 1 && (
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
                                {dataById.EXPENSES_TYPE === 2 && (
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
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="namaPemohon"
                                    value="Nama Pemohon"
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
                                        setData("nama_pemohon", e.target.value)
                                    }
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="namaPengguna"
                                    value="Nama Pengguna"
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
                                        setData("nama_pengguna", e.target.value)
                                    }
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="divisi"
                                    value="Divisi"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="divisi"
                                    type="text"
                                    name="divisi"
                                    value={dataById.DIVISION}
                                    className=""
                                    autoComplete="divisi"
                                    onChange={(e) =>
                                        setData("divisi", e.target.value)
                                    }
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="tanggalPengajuan"
                                    value="Tanggal Pengajuan"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="tanggalPengajuan"
                                    type="text"
                                    name="tanggalPengajuan"
                                    value={dateFormat(
                                        dataById.EXPENSES_REQUESTED_DATE,
                                        "dd/mm/yyyy"
                                    )}
                                    className=""
                                    autoComplete="tanggalPengajuan"
                                    onChange={(e) =>
                                        setData(
                                            "tanggal_pengajuan",
                                            e.target.value
                                        )
                                    }
                                    readOnly
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="namaPemberiApproval"
                                    value="Nama Pemberi Approval"
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
                                            "nama_pemberi_approval",
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
                                            className="border p-3"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Tanggal Kegiatan"
                                            className="border p-3"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Kegiatan"
                                            className="border p-3"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Tempat"
                                            className="border p-3"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Relasi"
                                            className="border p-3"
                                            colSpan={3}
                                        />
                                        <TH
                                            label="Jumlah"
                                            className="border p-3"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Status"
                                            className="border p-3"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Keterangan"
                                            className="border p-3"
                                            rowSpan={2}
                                        />
                                        {dataById.cash_advance_detail.length >
                                            1 && (
                                            <TH
                                                label="Action"
                                                className="border p-3"
                                                rowSpan={2}
                                            />
                                        )}
                                    </tr>
                                    <tr className="text-center">
                                        <TH
                                            label="Nama Client"
                                            className="border p-3"
                                        />
                                        <TH
                                            label="Posisi"
                                            className="border p-3"
                                        />
                                        <TH
                                            label="Perusahaan"
                                            className="border p-3"
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
                                                        id="EXPENSES_DETAIL_DATE"
                                                        type="date"
                                                        name="EXPENSES_DETAIL_DATE"
                                                        value={
                                                            cad.EXPENSES_DETAIL_DATE
                                                        }
                                                        className="w-1/2"
                                                        autoComplete="EXPENSES_DETAIL_DATE"
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
                                                        id="EXPENSES_DETAIL_PURPOSE"
                                                        type="text"
                                                        name="EXPENSES_DETAIL_PURPOSE"
                                                        value={
                                                            cad.EXPENSES_DETAIL_PURPOSE
                                                        }
                                                        className="w-1/2"
                                                        autoComplete="EXPENSES_DETAIL_PURPOSE"
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
                                                        id="EXPENSES_DETAIL_LOCATION"
                                                        type="text"
                                                        name="EXPENSES_DETAIL_LOCATION"
                                                        value={
                                                            cad.EXPENSES_DETAIL_LOCATION
                                                        }
                                                        className="w-1/2"
                                                        autoComplete="EXPENSES_DETAIL_LOCATION"
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
                                                        id="EXPENSES_DETAIL_RELATION_NAME"
                                                        type="text"
                                                        name="EXPENSES_DETAIL_RELATION_NAME"
                                                        value={
                                                            cad.EXPENSES_DETAIL_RELATION_NAME
                                                        }
                                                        className="w-1/2"
                                                        autoComplete="EXPENSES_DETAIL_RELATION_NAME"
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
                                                        id="EXPENSES_DETAIL_RELATION_POSITION"
                                                        type="text"
                                                        name="EXPENSES_DETAIL_RELATION_POSITION"
                                                        value={
                                                            cad.EXPENSES_DETAIL_RELATION_POSITION
                                                        }
                                                        className="w-1/2"
                                                        autoComplete="EXPENSES_DETAIL_RELATION_POSITION"
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
                                                    <select
                                                        id="RELATION_ORGANIZATION_ID"
                                                        name="RELATION_ORGANIZATION_ID"
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                        value={
                                                            cad.RELATION_ORGANIZATION_ID
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
                                                            --Pilih Perusahaan--
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
                                                        id="EXPENSES_DETAIL_AMOUNT"
                                                        type="number"
                                                        name="EXPENSES_DETAIL_AMOUNT"
                                                        value={
                                                            cad.EXPENSES_DETAIL_AMOUNT
                                                        }
                                                        className="w-1/2"
                                                        autoComplete="EXPENSES_DETAIL_AMOUNT"
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
                                                <TD className="border p-2">
                                                    {cad.EXPENSES_DETAIL_STATUS ===
                                                        0 && (
                                                        <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                                            Approve
                                                        </span>
                                                    )}
                                                    {cad.EXPENSES_DETAIL_STATUS ===
                                                        1 && (
                                                        <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                                                            Reject
                                                        </span>
                                                    )}
                                                </TD>
                                                <TD className="border text-left pl-2">
                                                    {cad.EXPENSES_DETAIL_NOTE}
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
                                            className="border text-right pr-5"
                                            colSpan={7}
                                        >
                                            TOTAL PENGAJUAN
                                        </TD>
                                        <TD className="border">
                                            {formatCurrency.format(
                                                revised_total_amount
                                            )}
                                            {/* <TextInput
                                                id="EXPENSES_TOTAL_AMOUNT"
                                                type="text"
                                                name="EXPENSES_TOTAL_AMOUNT"
                                                value={revised_total_amount}
                                                className="w-1/2"
                                                autoComplete="EXPENSES_TOTAL_AMOUNT"
                                                onChange={() => ()}
                                                required
                                            /> */}
                                        </TD>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        {/* Table form end */}

                        <div className="w-full p-2 mt-5">
                            <InputLabel
                                htmlFor="catatan"
                                value="Catatan"
                                className="mb-2"
                            />
                            <Textarea
                                id="catatan"
                                name="catatan"
                                className="resize-none border-0 focus:ring-2 focus:ring-inset focus:ring-red-600"
                                rows={5}
                                value={dataById.EXPENSES_REQUEST_NOTE}
                                // onChange={() => ()}
                            />
                        </div>

                        <div className="p-2 my-5">
                            <table className="w-2/6 table-auto">
                                <thead>
                                    <tr>
                                        <TableTH
                                            label="STATUS PENGAJUAN"
                                            className="uppercase"
                                        />
                                    </tr>
                                    <tr>
                                        <TableTH
                                            label="Tanggal & Jam"
                                            className=""
                                        />
                                        <TableTH label="Nama" className="" />
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
                                            value="Dibuat"
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
                                            value="Revisi"
                                            className="border-none"
                                        />
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </>
                }
            />
            {/* Modal Revised End */}

            {/* Modal Report Start */}
            <ModalToAdd
                classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 sm:max-w-2xl md:max-w-2xl lg:max-w-4xl xl:max-w-7xl`}
                show={modal.report}
                onClose={() =>
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                        approve: false,
                        report: false,
                    })
                }
                title={"Report Cash Advance"}
                url={""}
                data={""}
                onSuccess={handleSuccess}
                panelWidth={"65%"}
                body={
                    <>
                        <div className="grid md:grid-cols-2 my-10">
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="expensesNumber"
                                    value="Expenses Number"
                                    className="mb-2"
                                />
                                <select
                                    id="expensesNumber"
                                    name="expensesNumber"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    onChange={(e) =>
                                        setData("tipe", e.target.value)
                                    }
                                    //
                                >
                                    <option value="">-- Pilih CA --</option>
                                    {types.map((type: any) => (
                                        <option key={type.id} value={type.id}>
                                            {type.type}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="tipe"
                                    value="Tipe"
                                    className="mb-2"
                                />
                                <select
                                    id="tipe"
                                    name="tipe"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    onChange={(e) =>
                                        setData("tipe", e.target.value)
                                    }
                                    //
                                >
                                    <option value="">-- Pilih Tipe --</option>
                                    {types.map((type: any) => (
                                        <option key={type.id} value={type.id}>
                                            {type.type}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="namaPemohon"
                                    value="Nama Pemohon"
                                    className="mb-2"
                                />
                                <select
                                    id="namaPemohon"
                                    name="namaPemohon"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    onChange={(e) =>
                                        setData("nama_pemohon", e.target.value)
                                    }
                                    //
                                >
                                    <option value="">
                                        -- Pilih Nama Pemohon --
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
                                    htmlFor="namaPengguna"
                                    value="Nama Pengguna"
                                    className="mb-2"
                                />
                                <select
                                    id="namaPengguna"
                                    name="namaPengguna"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    onChange={(e) =>
                                        setData("nama_pengguna", e.target.value)
                                    }
                                    //
                                >
                                    <option value="">
                                        -- Pilih Pengguna --
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
                                    htmlFor="divisi"
                                    value="Divisi"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="divisi"
                                    type="text"
                                    name="divisi"
                                    value={data.divisi}
                                    className=""
                                    autoComplete="divisi"
                                    onChange={(e) =>
                                        setData("divisi", e.target.value)
                                    }
                                    //
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="tanggalPengajuan"
                                    value="Tanggal Pengajuan"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="tanggalPengajuan"
                                    type="date"
                                    name="tanggalPengajuan"
                                    value={data.tanggal_pengajuan}
                                    className=""
                                    autoComplete="tanggalPengajuan"
                                    onChange={(e) =>
                                        setData(
                                            "tanggal_pengajuan",
                                            e.target.value
                                        )
                                    }
                                    //
                                />
                            </div>
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="namaPemberiApproval"
                                    value="Nama Pemberi Approval"
                                    className="mb-2"
                                />
                                <select
                                    id="namaPemberiApproval"
                                    name="namaPemberiApproval"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    onChange={(e) =>
                                        setData(
                                            "nama_pemberi_approval",
                                            e.target.value
                                        )
                                    }
                                    //
                                >
                                    <option value="">
                                        -- Nama Pemberi Approval --
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
                                            label="Tanggal Kegiatan"
                                            className="border"
                                            rowSpan="2"
                                        />
                                        <TH
                                            label="Peruntukan"
                                            className="border"
                                            rowSpan="2"
                                        />
                                        <TH
                                            label="Relasi"
                                            className="border"
                                            colSpan="3"
                                        />
                                        <TH
                                            label="Tempat"
                                            className="border"
                                            rowSpan="2"
                                        />
                                        <TH
                                            label="Jumlah"
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
                                        <TH label="Nama" className="border" />
                                        <TH label="Posisi" className="border" />
                                        <TH
                                            label="Perusahaan"
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
                                                    id="tanggalKegiatan"
                                                    type="date"
                                                    name="tanggalKegiatan"
                                                    value={val.tanggalKegiatan}
                                                    className="w-1/2"
                                                    autoComplete="tanggalKegiatan"
                                                    onChange={(e) =>
                                                        handleChangeAdd(e, i)
                                                    }
                                                    //
                                                />
                                            </TD>
                                            <TD className="border">
                                                <TextInput
                                                    id="peruntukan"
                                                    type="text"
                                                    name="peruntukan"
                                                    value={val.peruntukan}
                                                    className="w-1/2"
                                                    autoComplete="peruntukan"
                                                    onChange={(e) =>
                                                        handleChangeAdd(e, i)
                                                    }
                                                    //
                                                />
                                            </TD>
                                            <TD className="border">
                                                <TextInput
                                                    id="nama"
                                                    type="text"
                                                    name="nama"
                                                    value={val.nama}
                                                    className="w-1/2"
                                                    autoComplete="nama"
                                                    onChange={(e) =>
                                                        handleChangeAdd(e, i)
                                                    }
                                                    //
                                                />
                                            </TD>
                                            <TD className="border">
                                                <TextInput
                                                    id="posisi"
                                                    type="text"
                                                    name="posisi"
                                                    value={val.posisi}
                                                    className="w-1/2"
                                                    autoComplete="posisi"
                                                    onChange={(e) =>
                                                        handleChangeAdd(e, i)
                                                    }
                                                    //
                                                />
                                            </TD>
                                            <TD className="border">
                                                <select
                                                    id="perusahaan"
                                                    name="perusahaan"
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                                    //
                                                    onChange={(e) =>
                                                        handleChangeAdd(e, i)
                                                    }
                                                >
                                                    <option value="">
                                                        --Pilih Perusahaan--
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
                                                    id="tempat"
                                                    type="text"
                                                    name="tempat"
                                                    value={val.tempat}
                                                    className="w-1/2"
                                                    autoComplete="tempat"
                                                    onChange={(e) =>
                                                        handleChangeAdd(e, i)
                                                    }
                                                    //
                                                />
                                            </TD>
                                            <TD className="border">
                                                <TextInput
                                                    id="jumlah"
                                                    type="number"
                                                    name="jumlah"
                                                    value={val.jumlah}
                                                    className="w-1/2"
                                                    autoComplete="jumlah"
                                                    onChange={(e) =>
                                                        handleChangeAdd(e, i)
                                                    }
                                                    //
                                                />
                                            </TD>
                                            <TD className="border">
                                                {DataRow.length > 1 && (
                                                    <Button
                                                        className="my-1.5 px-3 py-1 ml-2"
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
                                    <tr className="text-center">
                                        <TD></TD>
                                        <TD>
                                            <Button
                                                className="mt-5 px-2 py-1 ml-2 bg-blue-600 hover:bg-blue-500 text-sm"
                                                onClick={(e) => handleAddRow(e)}
                                                type="button"
                                            >
                                                + Tambah Kegiatan
                                            </Button>
                                        </TD>
                                        <TD
                                            className="text-right pr-5 font-bold"
                                            colSpan={5}
                                        >
                                            TOTAL PENGAJUAN
                                        </TD>
                                        <TD>
                                            <TextInput
                                                id="totalJumlah"
                                                type="text"
                                                name="totalJumlah"
                                                value={total}
                                                className="w-1/2"
                                                autoComplete="totalJumlah"
                                                onChange={(e) =>
                                                    setData(
                                                        "total_pengajuan",
                                                        e.target.value
                                                    )
                                                }
                                                readOnly
                                            />
                                        </TD>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        {/* Table form end */}

                        {/* <p className="mt-5">{JSON.stringify(DataRow)}</p> */}

                        <div className="w-full p-2 mt-5">
                            <InputLabel
                                htmlFor="catatan"
                                value="Catatan"
                                className="mb-2"
                            />
                            <Textarea
                                id="catatan"
                                name="catatan"
                                className="resize-none border-0 focus:ring-2 focus:ring-inset focus:ring-red-600"
                                rows={5}
                                value={data.catatan}
                                onChange={(e) =>
                                    setData("catatan", e.target.value)
                                }
                                //
                            />
                        </div>
                        <div className="grid md:grid-cols-2 my-10">
                            <div className="w-full p-2">
                                <InputLabel
                                    htmlFor="refundType"
                                    value="Refund Type"
                                    className="mb-2"
                                />
                                <select
                                    id="refundType"
                                    name="refundType"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    onChange={(e) =>
                                        setData("nama_pengguna", e.target.value)
                                    }
                                    //
                                >
                                    <option value="">
                                        -- Pilih Refund Type --
                                    </option>
                                    {refunds.map((refund: any) => (
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
                                    value="Refund Proof"
                                    className="mb-2"
                                />
                                <TextInput
                                    id="refundProof"
                                    type="file"
                                    name="refundProof"
                                    value={""}
                                    className="py-0"
                                    autoComplete="refundProof"
                                    // onChange={(e) =>
                                    //     setData("divisi", e.target.value)
                                    // }
                                    //
                                />
                            </div>
                        </div>
                    </>
                }
            />
            {/* Modal Report End */}

            {/* modal search */}
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
                        approve: false,
                        report: false,
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
                                htmlFor="EXPENSES_NUMBER"
                                value="Expenses Number"
                            />
                            <TextInput
                                id="EXPENSES_NUMBER"
                                type="text"
                                name="EXPENSES_NUMBER"
                                value={searchCA.EXPENSES_NUMBER}
                                className=""
                                onChange={(e) =>
                                    setSearchCA({
                                        ...searchCA,
                                        EXPENSES_NUMBER: e.target.value,
                                    })
                                }
                            />
                        </div>
                        {/* <div className="mb-4">
                            <InputLabel
                                htmlFor="policy_insurance_type_name"
                                value="Policy Insurance Type Name"
                            />
                            <TextInput
                                id="policy_insurance_type_name"
                                type="text"
                                name="policy_insurance_type_name"
                                value={searchCA.policy_insurance_type_name}
                                className=""
                                onChange={(e) =>
                                    setSearchCA({
                                        ...searchCA,
                                        policy_insurance_type_name:
                                            e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="mb-4">
                            <InputLabel
                                htmlFor="policy_broker_name"
                                value="Policy Broker Name"
                            />
                            <TextInput
                                id="policy_broker_name"
                                type="text"
                                name="policy_broker_name"
                                value={searchCA.policy_broker_name}
                                className=""
                                autoComplete="policy_broker_name"
                                onChange={(e) =>
                                    setSearchCA({
                                        ...searchCA,
                                        policy_broker_name: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="grid grid-rows grid-flow-col gap-4 mb-4">
                            <div>
                                <InputLabel
                                    htmlFor="policy_inception_date"
                                    value="Inception Date"
                                />
                                <Datepicker
                                    theme={inceptionDatePickerStyle}
                                    required
                                    placeholder="Select Date"
                                    value={searchCA.policy_inception_date}
                                    onSelectedDateChanged={(date: Date) =>
                                        setSearchCA({
                                            ...searchCA,
                                            policy_inception_date:
                                                date.toLocaleDateString(
                                                    "en-CA"
                                                ),
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="policy_due_date"
                                    value="Due Date"
                                />
                                <Datepicker
                                    theme={dueDatePickerStyle}
                                    onSelectedDateChanged={(date: Date) =>
                                        setSearchCA({
                                            ...searchCA,
                                            policy_due_date:
                                                date.toLocaleDateString(
                                                    "en-CA"
                                                ),
                                        })
                                    }
                                    required
                                    placeholder="Select Date"
                                    value={searchCA.policy_due_date}
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <InputLabel
                                htmlFor="policy_status"
                                value="Status"
                            />
                            <select
                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={searchCA.policy_status_id}
                                onChange={(e) =>
                                    setSearchCA({
                                        ...searchCA,
                                        policy_status_id: e.target.value,
                                    })
                                }
                            >
                                <option value="">
                                    -- <i>Choose Status</i> --
                                </option>
                                {policyStatus.map((status: any, i: number) => {
                                    return (
                                        <option
                                            key={i}
                                            value={status.policy_status_id}
                                        >
                                            {status.policy_status_name}
                                        </option>
                                    );
                                })}
                            </select>
                        </div> */}
                    </>
                }
            />
            {/* end modal search */}

            {/* Content Start */}
            {/* <div className="max-w-0xl mx-auto sm:px-6 lg:px-0"> */}
            <div className="p-6 text-gray-900 mb-60">
                <div className="rounded-md bg-white pt-4 px-10 shadow-default dark:border-strokedark dark:bg-boxdark">
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
                                    approve: false,
                                    report: false,
                                });
                            }}
                        >
                            {"Add Cash Advance"}
                        </Button>
                        <Button
                            className="text-sm font-semibold mb-4 px-6 py-1.5 md:col-span-2 lg:col-auto bg-red-600 hover:bg-red-500"
                            onClick={() => {
                                setModal({
                                    add: false,
                                    delete: false,
                                    edit: false,
                                    view: false,
                                    document: false,
                                    search: false,
                                    approve: false,
                                    report: true,
                                });
                            }}
                        >
                            {"Report Cash Advance"}
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
                                            approve: false,
                                            report: false,
                                        });
                                    }}
                                >
                                    <MagnifyingGlassIcon
                                        className="mx-2 h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                    Search...
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
                                        {/* <TableTH
                                            className="min-w-[50px]"
                                            label={"Division"}
                                        /> */}
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
                                            label={"Report"}
                                        />
                                        <TableTH
                                            className={"min-w-[50px]"}
                                            label={"Action"}
                                        />
                                    </tr>
                                </thead>
                                <tbody>
                                    {cashAdvance.data === undefined && (
                                        <tr>
                                            <TD
                                                className="leading-10 text-gray-500"
                                                colSpan="7"
                                            >
                                                Please search data
                                            </TD>
                                        </tr>
                                    )}
                                    {cashAdvance.data?.length === 0 ? (
                                        <tr>
                                            <TD
                                                className="leading-10 text-gray-500"
                                                colSpan="7"
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
                                                            ca.EXPENSES_NUMBER
                                                        }
                                                        className=""
                                                    />
                                                    {/* <TableTD
                                                        value={ca.DIVISION}
                                                        className=""
                                                    /> */}
                                                    <TableTD
                                                        value={dateFormat(
                                                            ca.EXPENSES_REQUESTED_DATE,
                                                            "dd mmmm yyyy"
                                                        )}
                                                        className=""
                                                    />
                                                    <TableTD
                                                        value={formatCurrency.format(
                                                            ca.EXPENSES_TOTAL_AMOUNT
                                                        )}
                                                        className=""
                                                    />
                                                    {ca.approval_status
                                                        .CA_STATUS_ID === 0 && (
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
                                                        .CA_STATUS_ID === 1 && (
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
                                                        .CA_STATUS_ID === 2 && (
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
                                                        .CA_STATUS_ID === 3 && (
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
                                                        .CA_STATUS_ID === 4 && (
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
                                                                                    ca.EXPENSES_ID
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
                                                                                    ca.EXPENSES_ID
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
                                                                                    ca.EXPENSES_ID
                                                                                )
                                                                            }
                                                                        >
                                                                            Revised
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
            {/* </div> */}
            {/* Content End */}
        </AuthenticatedLayout>
    );
}
