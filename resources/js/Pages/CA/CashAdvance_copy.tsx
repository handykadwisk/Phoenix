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

export default function CashAdvance({ auth }: PageProps) {
    useEffect(() => {
        getCA();
    }, []);

    // Modal Add Start
    const [modal, setModal] = useState({
        add: false,
        delete: false,
        edit: false,
        view: false,
        document: false,
        search: false,
        approve: false,
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
                perusahaan: "",
                tempat: "",
                jumlah: "",
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
                    perusahaan: "",
                    tempat: "",
                    jumlah: "",
                },
            ],
        });
        getCA();
        setIsSuccess(message);
    };
    // Handle Success End

    // Handle Add Row Start
    const [DataRow, setDataRow] = useState([
        {
            tanggalKegiatan: "",
            peruntukan: "",
            nama: "",
            perusahaan: "",
            tempat: "",
            jumlah: "",
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
                perusahaan: "",
                tempat: "",
                jumlah: "",
            },
        ]);

        setData("CashAdvanceDetail", [
            ...data.CashAdvanceDetail,
            {
                tanggalKegiatan: "",
                peruntukan: "",
                nama: "",
                perusahaan: "",
                tempat: "",
                jumlah: "",
            },
        ]);
    };
    // Handle Add Row End

    // Handle Change Row Start
    const handleChange = (e: any, i: number) => {
        const { name, value } = e.target;

        const onchangeVal: any = [...data.CashAdvanceDetail];

        onchangeVal[i][name] = value;

        setDataRow(onchangeVal);

        setData("CashAdvanceDetail", onchangeVal);
    };
    // Handle Change Row End

    // Handle Remove Row Start
    const handleRemoveRow = (i: number) => {
        const deleteRow = [...data.CashAdvanceDetail];

        deleteRow.splice(i, 1);

        setDataRow(deleteRow);

        setData("CashAdvanceDetail", deleteRow);
    };
    // Handle Remove Row End

    let total = 0;

    DataRow.forEach((item) => {
        total += Number(item.jumlah);
    });

    const [cashAdvance, setCA] = useState<any>([]);

    const getCA = async (pageNumber = "page=1") => {
        await axios
            .get(`/getCA?${pageNumber}`)
            .then((res) => {
                setCA(res.data);
                // console.log(cashAdvance);
            })
            .catch((err) => {
                console.log(err);
            });
        // setPolicies(policy)
    };

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
    // Data End

    const [dataById, setDataById] = useState<any>({
        DIVISION: "",
        EXPENSES_REQUEST_NOTE: "",
        // nama_pengguna: "",
        // divisi: "",
        // tanggal_pengajuan: "",
        // nama_pemberi_approval: "",
        // catatan: "",
        // tanggal_kegiatan: "",
        // peruntukan: "",
        // nama: "",
        // posisi: "",
        // perusahaan: "",
        // tempat: "",
        // jumlah: "",
        // keterangan: "",
        // totalJumlah: "",
        cash_advance_detail: [
            {
                EXPENSES_DETAIL_ID: "",
                EXPENSES_DETAIL_PURPOSE: "",
                EXPENSES_DETAIL_LOCATION: "",
                EXPENSES_DETAIL_AMOUNT: "",
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
        user_pengguna: [
            {
                id: "",
                name: "",
                email: "",
                role_id: "",
            },
        ],
    });

    // Handle Approve Start
    const handleApproveModal = async (e: FormEvent, id: number) => {
        e.preventDefault();

        await axios
            .get(`/cashAdvanceApprove/${id}`)
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
        });
    };
    // Handle Approve End

    // Handle Revised Start
    const handleRevisedModal = (e: FormEvent, id: number) => {
        e.preventDefault();
        setModal({
            add: false,
            delete: false,
            edit: !modal.edit,
            view: false,
            document: false,
            search: false,
            approve: false,
        });
    };
    // Handle Revised End

    // Handle Show Start
    const handleShowModal = (e: FormEvent, id: number) => {
        e.preventDefault();
        setModal({
            add: false,
            delete: false,
            edit: false,
            view: !modal.view,
            document: false,
            search: false,
            approve: false,
        });
    };
    // Handle Show End

    console.log(data);
    console.log(DataRow);
    console.log(cashAdvance.data);

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
                classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-7xl`}
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
                        <div className="p-2">
                            <table className="w-full table-auto">
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
                                            colSpan="2"
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
                                                        handleChange(e, i)
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
                                                        handleChange(e, i)
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
                                                        handleChange(e, i)
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
                                                        handleChange(e, i)
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
                                                        handleChange(e, i)
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
                                                        handleChange(e, i)
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
                                                className="mt-5 px-2 py-1 ml-2 bg-blue-600 hover:bg-blue-500"
                                                onClick={(e) => handleAddRow(e)}
                                                type="button"
                                            >
                                                +Tambah Kegiatan
                                            </Button>
                                        </TD>
                                        <TD
                                            className="text-right pr-5 font-bold"
                                            colSpan={4}
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
                                defaultValue={""}
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

            {/* Modal Approve Start */}
            <ModalToAction
                classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-7xl`}
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
                    })
                }
                title="Approve Cash Advance"
                url=""
                data=""
                method=""
                onSuccess=""
                headers=""
                submitButtonName=""
                panelWidth={"60%"}
                body={
                    <>
                        <div className="grid md:grid-cols-2 my-10">
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
                                    value={dataById.user.name}
                                    className=""
                                    autoComplete="namaPemohon"
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            name: e.target.value,
                                        })
                                    }
                                    required
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
                                    value={dataById.user_pengguna.name}
                                    className=""
                                    autoComplete="namaPengguna"
                                    onChange={(e) =>
                                        setData("nama_pengguna", e.target.value)
                                    }
                                    required
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
                                    value={dataById.EXPENSES_REQUESTED_DATE}
                                    className=""
                                    autoComplete="tanggalPengajuan"
                                    onChange={(e) =>
                                        setDataById({
                                            ...dataById,
                                            EXPENSES_REQUESTED_DATE:
                                                e.target.value,
                                        })
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
                                <TextInput
                                    id="namaPemberiApproval"
                                    type="text"
                                    name="namaPemberiApproval"
                                    value={data.nama_pemberi_approval}
                                    className=""
                                    autoComplete="namaPemberiApproval"
                                    onChange={(e) =>
                                        setData(
                                            "nama_pemberi_approval",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                            </div>
                        </div>

                        {/* Table form start */}
                        <div className="p-2">
                            <table className="w-full table-auto">
                                <thead className="">
                                    <tr className="bg-gray-2 text-center dark:bg-meta-4">
                                        <TH
                                            label="No."
                                            className="border"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Tanggal Kegiatan"
                                            className="border"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Kegiatan"
                                            className="border"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Tempat"
                                            className="border"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Relasi"
                                            className="border"
                                            colSpan={3}
                                        />
                                        <TH
                                            label="Jumlah"
                                            className="border"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Approval"
                                            className="border"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Keterangan"
                                            className="border"
                                            rowSpan={2}
                                        />
                                    </tr>
                                    <tr className="text-center">
                                        <TH
                                            label="Nama Client"
                                            className="border"
                                        />
                                        <TH label="Posisi" className="border" />
                                        <TH
                                            label="Perusahaan"
                                            className="border"
                                        />
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataById.cash_advance_detail.map(
                                        (cad: any) => (
                                            <tr
                                                className="text-center"
                                                key={cad.EXPENSES_DETAIL_ID}
                                            >
                                                <TD className="border">1.</TD>
                                                <TD className="border">
                                                    <TextInput
                                                        id="tanggalKegiatan"
                                                        type="date"
                                                        name="tanggalKegiatan"
                                                        value={
                                                            data.tanggal_kegiatan
                                                        }
                                                        className="w-1/2"
                                                        autoComplete="tanggalKegiatan"
                                                        onChange={(e) =>
                                                            setData(
                                                                "tanggal_kegiatan",
                                                                e.target.value
                                                            )
                                                        }
                                                        required
                                                    />
                                                </TD>
                                                <TD className="border">
                                                    <TextInput
                                                        id="peruntukan"
                                                        type="text"
                                                        name="peruntukan"
                                                        value={
                                                            cad.EXPENSES_DETAIL_PURPOSE
                                                        }
                                                        className="w-1/2"
                                                        autoComplete="peruntukan"
                                                        onChange={(e) =>
                                                            setData(
                                                                "peruntukan",
                                                                e.target.value
                                                            )
                                                        }
                                                        required
                                                    />
                                                </TD>
                                                <TD className="border">
                                                    <TextInput
                                                        id="tempat"
                                                        type="text"
                                                        name="tempat"
                                                        value={
                                                            cad.EXPENSES_DETAIL_LOCATION
                                                        }
                                                        className="w-1/2"
                                                        autoComplete="tempat"
                                                        onChange={(e) =>
                                                            setData(
                                                                "tempat",
                                                                e.target.value
                                                            )
                                                        }
                                                        required
                                                    />
                                                </TD>
                                                <TD className="border">
                                                    <TextInput
                                                        id="nama"
                                                        type="text"
                                                        name="nama"
                                                        value={data.nama}
                                                        className="w-1/2"
                                                        autoComplete="nama"
                                                        onChange={(e) =>
                                                            setData(
                                                                "nama",
                                                                e.target.value
                                                            )
                                                        }
                                                        required
                                                    />
                                                </TD>
                                                <TD className="border">
                                                    <TextInput
                                                        id="posisi"
                                                        type="text"
                                                        name="posisi"
                                                        value={data.posisi}
                                                        className="w-1/2"
                                                        autoComplete="posisi"
                                                        onChange={(e) =>
                                                            setData(
                                                                "posisi",
                                                                e.target.value
                                                            )
                                                        }
                                                        required
                                                    />
                                                </TD>
                                                <TD className="border">
                                                    <TextInput
                                                        id="perusahaan"
                                                        type="text"
                                                        name="perusahaan"
                                                        value={data.perusahaan}
                                                        className="w-1/2"
                                                        autoComplete="perusahaan"
                                                        onChange={(e) =>
                                                            setData(
                                                                "perusahaan",
                                                                e.target.value
                                                            )
                                                        }
                                                        required
                                                    />
                                                </TD>
                                                <TD className="border">
                                                    <TextInput
                                                        id="jumlah"
                                                        type="number"
                                                        name="jumlah"
                                                        value={
                                                            cad.EXPENSES_DETAIL_AMOUNT
                                                        }
                                                        className="w-1/2"
                                                        autoComplete="jumlah"
                                                        onChange={(e) =>
                                                            setData(
                                                                "jumlah",
                                                                e.target.value
                                                            )
                                                        }
                                                        required
                                                    />
                                                </TD>
                                                <TD className="border">
                                                    <Button className="bg-red-600 p-2 my-2">
                                                        Reject
                                                    </Button>
                                                    <Button className="bg-green-600 p-2 mb-2">
                                                        Approve
                                                    </Button>
                                                </TD>
                                                <TD className="border">
                                                    <TextInput
                                                        id="keterangan"
                                                        type="text"
                                                        name="keterangan"
                                                        value={data.keterangan}
                                                        className="w-1/2"
                                                        autoComplete="keterangan"
                                                        onChange={(e) =>
                                                            setData(
                                                                "keterangan",
                                                                e.target.value
                                                            )
                                                        }
                                                        required
                                                    />
                                                </TD>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr className="text-center">
                                        <TD
                                            className="border text-right pr-5 font-bold"
                                            colSpan={7}
                                        >
                                            TOTAL PENGAJUAN
                                        </TD>
                                        <TD className="border">
                                            <TextInput
                                                id="totalJumlah"
                                                type="text"
                                                name="totalJumlah"
                                                value=""
                                                className="w-1/2"
                                                autoComplete="totalJumlah"
                                                // onChange={() => ()}
                                                required
                                            />
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
                                defaultValue={""}
                                value={dataById.EXPENSES_REQUEST_NOTE}
                                onChange={(e) =>
                                    setDataById({
                                        ...dataById,
                                        EXPENSES_REQUEST_NOTE: e.target.value,
                                    })
                                }
                                required
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
                                            className="w-48 border-none"
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
                                </tbody>
                            </table>
                        </div>
                    </>
                }
            />
            {/* Modal Approve End */}

            {/* Modal Revised Start */}
            <ModalToAction
                classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-7xl`}
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
                    })
                }
                title="Revised Cash Advance"
                url=""
                data=""
                method=""
                onSuccess=""
                headers=""
                submitButtonName=""
                panelWidth={"60%"}
                body={
                    <>
                        <div className="grid md:grid-cols-2 my-10">
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
                                    value={data.nama_pemohon}
                                    className=""
                                    autoComplete="namaPemohon"
                                    onChange={(e) =>
                                        setData("nama_pemohon", e.target.value)
                                    }
                                    required
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
                                    value={data.nama_pengguna}
                                    className=""
                                    autoComplete="namaPengguna"
                                    onChange={(e) =>
                                        setData("nama_pengguna", e.target.value)
                                    }
                                    required
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
                                <TextInput
                                    id="namaPemberiApproval"
                                    type="text"
                                    name="namaPemberiApproval"
                                    value={data.nama_pemberi_approval}
                                    className=""
                                    autoComplete="namaPemberiApproval"
                                    onChange={(e) =>
                                        setData(
                                            "nama_pemberi_approval",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                            </div>
                        </div>

                        {/* Table form start */}
                        <div className="p-2">
                            <table className="w-full table-auto">
                                <thead className="">
                                    <tr className="bg-gray-2 text-center dark:bg-meta-4">
                                        <TH
                                            label="No."
                                            className="border"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Tanggal Kegiatan"
                                            className="border"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Kegiatan"
                                            className="border"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Tempat"
                                            className="border"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Relasi"
                                            className="border"
                                            colSpan={3}
                                        />
                                        <TH
                                            label="Jumlah"
                                            className="border"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Approval"
                                            className="border"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Keterangan"
                                            className="border"
                                            rowSpan={2}
                                        />
                                    </tr>
                                    <tr className="text-center">
                                        <TH
                                            label="Nama Client"
                                            className="border"
                                        />
                                        <TH label="Posisi" className="border" />
                                        <TH
                                            label="Perusahaan"
                                            className="border"
                                        />
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="text-center">
                                        <TD className="border">1.</TD>
                                        <TD className="border">
                                            <TextInput
                                                id="tanggalKegiatan"
                                                type="date"
                                                name="tanggalKegiatan"
                                                value={data.tanggal_kegiatan}
                                                className="w-1/2"
                                                autoComplete="tanggalKegiatan"
                                                onChange={(e) =>
                                                    setData(
                                                        "tanggal_kegiatan",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </TD>
                                        <TD className="border">
                                            <TextInput
                                                id="peruntukan"
                                                type="text"
                                                name="peruntukan"
                                                value={data.peruntukan}
                                                className="w-1/2"
                                                autoComplete="peruntukan"
                                                onChange={(e) =>
                                                    setData(
                                                        "peruntukan",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </TD>
                                        <TD className="border">
                                            <TextInput
                                                id="tempat"
                                                type="text"
                                                name="tempat"
                                                value={data.tempat}
                                                className="w-1/2"
                                                autoComplete="tempat"
                                                onChange={(e) =>
                                                    setData(
                                                        "tempat",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </TD>
                                        <TD className="border">
                                            <TextInput
                                                id="nama"
                                                type="text"
                                                name="nama"
                                                value={data.nama}
                                                className="w-1/2"
                                                autoComplete="nama"
                                                onChange={(e) =>
                                                    setData(
                                                        "nama",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </TD>
                                        <TD className="border">
                                            <TextInput
                                                id="posisi"
                                                type="text"
                                                name="posisi"
                                                value={data.posisi}
                                                className="w-1/2"
                                                autoComplete="posisi"
                                                onChange={(e) =>
                                                    setData(
                                                        "posisi",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </TD>
                                        <TD className="border">
                                            <TextInput
                                                id="perusahaan"
                                                type="text"
                                                name="perusahaan"
                                                value={data.perusahaan}
                                                className="w-1/2"
                                                autoComplete="perusahaan"
                                                onChange={(e) =>
                                                    setData(
                                                        "perusahaan",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </TD>
                                        <TD className="border">
                                            <TextInput
                                                id="jumlah"
                                                type="number"
                                                name="jumlah"
                                                value={data.jumlah}
                                                className="w-1/2"
                                                autoComplete="jumlah"
                                                onChange={(e) =>
                                                    setData(
                                                        "jumlah",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </TD>
                                        <TD className="border">
                                            <Button className="bg-red-600 p-2 my-2">
                                                Reject
                                            </Button>
                                            <Button className="bg-green-600 p-2 mb-2">
                                                Approve
                                            </Button>
                                        </TD>
                                        <TD className="border">
                                            <TextInput
                                                id="keterangan"
                                                type="text"
                                                name="keterangan"
                                                value={data.keterangan}
                                                className="w-1/2"
                                                autoComplete="keterangan"
                                                onChange={(e) =>
                                                    setData(
                                                        "keterangan",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </TD>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr className="text-center">
                                        <TD
                                            className="border text-right pr-5 font-bold"
                                            colSpan={7}
                                        >
                                            TOTAL PENGAJUAN
                                        </TD>
                                        <TD className="border">
                                            <TextInput
                                                id="totalJumlah"
                                                type="text"
                                                name="totalJumlah"
                                                value=""
                                                className="w-1/2"
                                                autoComplete="totalJumlah"
                                                // onChange={() => ()}
                                                required
                                            />
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
                                defaultValue={""}
                                // onChange={() => ()}
                                required
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

            {/* Modal Show Start */}
            <ModalToAction
                classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-7xl`}
                show={modal.view}
                closeable={true}
                onClose={() =>
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: !modal.view,
                        document: false,
                        search: false,
                        approve: false,
                    })
                }
                title="Show Cash Advance"
                url=""
                data=""
                method=""
                onSuccess=""
                headers=""
                submitButtonName=""
                panelWidth={"60%"}
                body={
                    <>
                        <div className="grid md:grid-cols-2 my-10">
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
                                    value={data.nama_pemohon}
                                    className=""
                                    autoComplete="namaPemohon"
                                    onChange={(e) =>
                                        setData("nama_pemohon", e.target.value)
                                    }
                                    required
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
                                    value={data.nama_pengguna}
                                    className=""
                                    autoComplete="namaPengguna"
                                    onChange={(e) =>
                                        setData("nama_pengguna", e.target.value)
                                    }
                                    required
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
                                <TextInput
                                    id="namaPemberiApproval"
                                    type="text"
                                    name="namaPemberiApproval"
                                    value={data.nama_pemberi_approval}
                                    className=""
                                    autoComplete="namaPemberiApproval"
                                    onChange={(e) =>
                                        setData(
                                            "nama_pemberi_approval",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                            </div>
                        </div>

                        {/* Table form start */}
                        <div className="p-2">
                            <table className="w-full table-auto">
                                <thead className="">
                                    <tr className="bg-gray-2 text-center dark:bg-meta-4">
                                        <TH
                                            label="No."
                                            className="border"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Tanggal Kegiatan"
                                            className="border"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Kegiatan"
                                            className="border"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Tempat"
                                            className="border"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Relasi"
                                            className="border"
                                            colSpan={3}
                                        />
                                        <TH
                                            label="Jumlah"
                                            className="border"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Approval"
                                            className="border"
                                            rowSpan={2}
                                        />
                                        <TH
                                            label="Keterangan"
                                            className="border"
                                            rowSpan={2}
                                        />
                                    </tr>
                                    <tr className="text-center">
                                        <TH
                                            label="Nama Client"
                                            className="border"
                                        />
                                        <TH label="Posisi" className="border" />
                                        <TH
                                            label="Perusahaan"
                                            className="border"
                                        />
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="text-center">
                                        <TD className="border">1.</TD>
                                        <TD className="border">
                                            <TextInput
                                                id="tanggalKegiatan"
                                                type="date"
                                                name="tanggalKegiatan"
                                                value={data.tanggal_kegiatan}
                                                className="w-1/2"
                                                autoComplete="tanggalKegiatan"
                                                onChange={(e) =>
                                                    setData(
                                                        "tanggal_kegiatan",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </TD>
                                        <TD className="border">
                                            <TextInput
                                                id="peruntukan"
                                                type="text"
                                                name="peruntukan"
                                                value={data.peruntukan}
                                                className="w-1/2"
                                                autoComplete="peruntukan"
                                                onChange={(e) =>
                                                    setData(
                                                        "peruntukan",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </TD>
                                        <TD className="border">
                                            <TextInput
                                                id="tempat"
                                                type="text"
                                                name="tempat"
                                                value={data.tempat}
                                                className="w-1/2"
                                                autoComplete="tempat"
                                                onChange={(e) =>
                                                    setData(
                                                        "tempat",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </TD>
                                        <TD className="border">
                                            <TextInput
                                                id="nama"
                                                type="text"
                                                name="nama"
                                                value={data.nama}
                                                className="w-1/2"
                                                autoComplete="nama"
                                                onChange={(e) =>
                                                    setData(
                                                        "nama",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </TD>
                                        <TD className="border">
                                            <TextInput
                                                id="posisi"
                                                type="text"
                                                name="posisi"
                                                value={data.posisi}
                                                className="w-1/2"
                                                autoComplete="posisi"
                                                onChange={(e) =>
                                                    setData(
                                                        "posisi",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </TD>
                                        <TD className="border">
                                            <TextInput
                                                id="perusahaan"
                                                type="text"
                                                name="perusahaan"
                                                value={data.perusahaan}
                                                className="w-1/2"
                                                autoComplete="perusahaan"
                                                onChange={(e) =>
                                                    setData(
                                                        "perusahaan",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </TD>
                                        <TD className="border">
                                            <TextInput
                                                id="jumlah"
                                                type="number"
                                                name="jumlah"
                                                value={data.jumlah}
                                                className="w-1/2"
                                                autoComplete="jumlah"
                                                onChange={(e) =>
                                                    setData(
                                                        "jumlah",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </TD>
                                        <TD className="border">
                                            <Button className="bg-red-600 p-2 my-2">
                                                Reject
                                            </Button>
                                            <Button className="bg-green-600 p-2 mb-2">
                                                Approve
                                            </Button>
                                        </TD>
                                        <TD className="border">
                                            <TextInput
                                                id="keterangan"
                                                type="text"
                                                name="keterangan"
                                                value={data.keterangan}
                                                className="w-1/2"
                                                autoComplete="keterangan"
                                                onChange={(e) =>
                                                    setData(
                                                        "keterangan",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </TD>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr className="text-center">
                                        <TD
                                            className="border text-right pr-5 font-bold"
                                            colSpan={7}
                                        >
                                            TOTAL PENGAJUAN
                                        </TD>
                                        <TD className="border">
                                            <TextInput
                                                id="totalJumlah"
                                                type="text"
                                                name="totalJumlah"
                                                value=""
                                                className="w-1/2"
                                                autoComplete="totalJumlah"
                                                // onChange={() => ()}
                                                required
                                            />
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
                                defaultValue={""}
                                // onChange={() => ()}
                                required
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
                                            value="(Dibuat)"
                                            className="border-none"
                                        />
                                    </tr>
                                    <tr>
                                        <TableTD
                                            value="21/9/2023 10.00WIB"
                                            className="w-48 border-none"
                                        />
                                        <TableTD
                                            value="(Pemberi Approval)"
                                            className="border-none"
                                        />
                                        <TableTD
                                            value="Revisi"
                                            className="border-none"
                                        />
                                    </tr>
                                    <tr>
                                        <TableTD
                                            value="21/9/2023 11.00WIB"
                                            className="border-none"
                                        />
                                        <TableTD
                                            value="(Diketahui)"
                                            className="border-none"
                                        />
                                        <TableTD
                                            value="Disetujui"
                                            className="border-none"
                                        />
                                    </tr>
                                    <tr>
                                        <TableTD
                                            value="21/9/2023 12.00WIB"
                                            className="w-48 border-none"
                                        />
                                        <TableTD
                                            value="(Finance)"
                                            className="border-none"
                                        />
                                        <TableTD
                                            value="Dijalankan"
                                            className="border-none"
                                        />
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </>
                }
            />
            {/* Modal Show End */}

            {/* Content Start */}
            <div>
                <div className="max-w-0xl mx-auto sm:px-6 lg:px-0">
                    <div className="bg-white overflow-hidden shadow-2xl sm:rounded-lg">
                        <div className="p-6 text-gray-900 mb-60">
                            {/* Tabel Start */}
                            <Table
                                addButtonLabel={"Add Cash Advance"}
                                addButtonModalState={() =>
                                    setModal({
                                        add: true,
                                        delete: false,
                                        edit: false,
                                        view: false,
                                        document: false,
                                        search: false,
                                        approve: false,
                                    })
                                }
                                searchButtonModalState={() =>
                                    setModal({
                                        add: false,
                                        delete: false,
                                        edit: false,
                                        view: false,
                                        document: false,
                                        search: !modal.search,
                                        approve: false,
                                    })
                                }
                                // clearSearchButtonAction={``}
                                tableHead={
                                    <>
                                        <TableTH
                                            className="w-px min-w-[50px] text-center"
                                            label={"No"}
                                        />
                                        <TableTH
                                            className="w-px min-w-[50px] text-center"
                                            label={"CA Number"}
                                        />
                                        <TableTH
                                            className="min-w-[50px] text-center"
                                            label={"Divisi"}
                                        />
                                        <TableTH
                                            className="min-w-[50px] text-center"
                                            label={"Tanggal Pengajuan"}
                                        />
                                        <TableTH
                                            className="min-w-[50px] text-center"
                                            label={"Total Pengajuan"}
                                        />
                                        <TableTH
                                            className="min-w-[50px] text-center"
                                            label={"Status"}
                                        />
                                        <TableTH
                                            className="min-w-[50px] text-center"
                                            label={"Action"}
                                        />
                                    </>
                                }
                                tableBody={cashAdvance.data?.map((ca: any) => (
                                    <tr key={ca.EXPENSES_ID}>
                                        <TableTD
                                            value="#"
                                            className="w-px text-center"
                                        ></TableTD>
                                        <TableTD
                                            value={ca.EXPENSES_NUMBER}
                                            className="text-center"
                                        ></TableTD>
                                        <TableTD
                                            value={ca.DIVISION}
                                            className="text-center"
                                        ></TableTD>
                                        <TableTD
                                            value={ca.EXPENSES_REQUESTED_DATE}
                                            className="text-center"
                                        ></TableTD>
                                        <TableTD
                                            value={
                                                "Rp." + ca.EXPENSES_TOTAL_AMOUNT
                                            }
                                            className="text-center"
                                        ></TableTD>
                                        {ca.FIRST_APPROVAL_STATUS === "" ||
                                            (ca.FIRST_APPROVAL_STATUS ===
                                                null && (
                                                <TableTD
                                                    value={"Request"}
                                                    className=" text-center"
                                                ></TableTD>
                                            ))}
                                        {ca.FIRST_APPROVAL_STATUS === 0 && (
                                            <TableTD
                                                value={"Approve"}
                                                className="text-center"
                                            ></TableTD>
                                        )}
                                        {ca.FIRST_APPROVAL_STATUS === 1 && (
                                            <TableTD
                                                value={"Reject"}
                                                className="text-center"
                                            ></TableTD>
                                        )}
                                        {ca.FIRST_APPROVAL_STATUS === 2 && (
                                            <TableTD
                                                value={"Need Revision"}
                                                className="text-center"
                                            ></TableTD>
                                        )}
                                        <TableTD
                                            value={
                                                <Dropdown
                                                    title="Actions"
                                                    children={
                                                        <>
                                                            <a
                                                                href=""
                                                                className="block px-4 py-2 text-sm hover:bg-gray-100"
                                                                onClick={(e) =>
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
                                                                onClick={(e) =>
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
                                                                onClick={(e) =>
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
                                ))}
                                pagination={
                                    <Pagination
                                        links={cashAdvance.links}
                                        fromData={cashAdvance.from}
                                        toData={cashAdvance.to}
                                        totalData={cashAdvance.total}
                                        clickHref={(url: string) =>
                                            getCA(url.split("?").pop())
                                        }
                                    />
                                }
                            />
                            {/* Table End */}
                        </div>
                    </div>
                </div>
            </div>
            {/* Content End */}
        </AuthenticatedLayout>
    );
}
