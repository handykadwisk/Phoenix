import { PageProps } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import Button from "@/Components/Button/Button";
import AGGrid from "@/Components/AgGrid";
import { useState } from "react";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import ToastMessage from "@/Components/ToastMessage";
import ModalToAction from "@/Components/Modal/ModalToAction";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import dateFormat from "dateformat";
import Swal from "sweetalert2";
import CurrencyInput from "react-currency-input-field";

export default function Index({ auth }: PageProps) {
    
    const [isLoading, setIsLoading] = useState<any>({
        get_all: false,
    });

    const [successSearch, setSuccessSearch] = useState<string>("");
    
    // Add Additional Allowance
    const [modal, setModal] = useState<any>({
        modalAddAdditionalAllowance: false,
        modalEditAdditionalAllowance: false,
    });

    const fieldAdditionalAllowance: any = {
        ADDITIONAL_ALLOWANCE_NAME: "",
        ADDITIONAL_ALLOWANCE_AMOUNT: 0,
        ADDITIONAL_ALLOWANCE_NOTE: "",
        ADDITIONAL_ALLOWANCE_UANG_MAKAN:0
    };
    const [dataAdditionalAllowance, setDataAdditionalAllowance] = useState<any>(
      fieldAdditionalAllowance  
    );

    const handleAddAdditionalAllowance = () => {
        setModal({
            modalAddAdditionalAllowance: true,
            modalEditAdditionalAllowance: false,
        });
    };

    const handleSuccess = (message: any) => {
        setIsSuccess("");
        if (message.msg != "") {
            setIsSuccess(message.msg);
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
        setDataAdditionalAllowance(fieldAdditionalAllowance)
        setSuccessSearch("Refreshing");
        setTimeout(() => {
            setSuccessSearch("");
        }, 1000);
        setModal({
            modalAddAdditionalAllowance: false,
            modalEditAdditionalAllowance: false,
        });
    };

    // End Add Additional Allowance

    const [isSuccess, setIsSuccess] = useState<string>("");

    // Edit Additional Allowance

    const [dataEditAdditionalAllowance, setDataEditAdditionalAllowance] =
        useState<any>({
            ADDITIONAL_ALLOWANCE_NAME: "",
            ADDITIONAL_ALLOWANCE_AMOUNT: 0,
            ADDITIONAL_ALLOWANCE_NOTE: "",
            ADDITIONAL_ALLOWANCE_UANG_MAKAN: 0,
        });
    const getById = (id: any) => {
        axios
            .get(`/getAdditionalAllowanceById/${id}`)
            .then((res) => setDataEditAdditionalAllowance(res.data))
            .catch((err) => console.log(err));
    };

    const handleEditModal = (data: any) => {
        getById(data.ADDITIONAL_ALLOWANCE_ID);
        setModal({
            modalAddAdditionalAllowance: false,
            modalEditAdditionalAllowance: !modal.modalEditAdditionalAllowance,
        });
    };

    // End Edit Additional Allowance

    const deleteAdditionalAllowance = async (e: any, data: any, flag: any) => {
        e.preventDefault();

        Swal.fire({
            // title: '',
            text: "Are you sure to Delete Additional Allowance?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Sure!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                setIsLoading({
                    ...isLoading,
                    get_all: true,
                });
                setModal({
                    modalRequestTimeOff: false,
                    modalEditRequestTimeOff: false,
                });
                try {
                    // send request to server
                    const response = await axios.post(
                        `/deleteAdditionalAllowance`,
                        {
                            data,
                        }
                    );

                    // check status response
                    if (response.status) {

                        if (response.data.status == 1) {
                            Swal.fire(
                                "Deleted!",
                                "Additional Allowance has been deleted.",
                                "success"
                            ).then((result) => {
                                if (result.isConfirmed) {
                                    setIsLoading({
                                        ...isLoading,
                                        get_all: false,
                                    });
                                }
                            });
                            
                        } else {
                            Swal.fire(
                                "Failed!",
                                "Failed Deleted Additional Allowance."
                            );
                        }
                              
                        setSuccessSearch("Refreshing");
                        setTimeout(() => {
                            setSuccessSearch("");
                        }, 1000);
                        // handleSuccessRequestTimeOff(response.data.msg); // Panggil fungsi sukses untuk memperbarui UI atau state
                        
                    } else {
                        throw new Error("Unexpected response status");
                    }
                    
                } catch (error) {
                    console.error(error);
                    Swal.fire(
                        "Error!",
                        "There was an error deleted Additional Allowance",
                        "error"
                    );
                }
            }
        });
    };

   
    // console.log("dataAdditionalAllowance: ", dataAdditionalAllowance);
    // console.log("dataEditAdditionalAllowance: ", dataEditAdditionalAllowance);

    return (
        <AuthenticatedLayout user={auth.user} header={"Additional Allowance"}>
            <Head title="Additional Allowance" />
            {isSuccess && (
                <ToastMessage
                    message={isSuccess}
                    isShow={true}
                    type={"success"}
                />
            )}
            {/* Modal Add Additional Allowance */}

            {dataAdditionalAllowance && (
                <ModalToAdd
                    buttonAddOns={""}
                    show={modal.modalAddAdditionalAllowance}
                    onClose={() => {
                        setModal({
                            modalAddAdditionalAllowance: false,
                        });
                        setDataAdditionalAllowance(null);
                    }}
                    title={"Add Additional Allowance"}
                    url={`/addAdditionalAllowance`}
                    data={dataAdditionalAllowance}
                    onSuccess={handleSuccess}
                    classPanel={
                        "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[40%]"
                    }
                    body={
                        <>
                            <div className="bg-white shadow-md rounded-lg p-3">
                                <div className="mb-4">
                                    <label className="block text-sm font-bold text-gray-700">
                                        Allowance Name{" "}
                                        <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        id="ADDITIONAL_ALLOWANCE_NAME"
                                        name="ADDITIONAL_ALLOWANCE_NAME"
                                        type="text"
                                        value={
                                            dataAdditionalAllowance.ADDITIONAL_ALLOWANCE_NAME
                                        }
                                        onChange={(e) =>
                                            setDataAdditionalAllowance({
                                                ...dataAdditionalAllowance,
                                                ADDITIONAL_ALLOWANCE_NAME:
                                                    e.target.value,
                                            })
                                        }
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-bold mb-1 text-gray-700">
                                        Allowance Amount{" "}
                                        <span className="text-red-600">*</span>
                                    </label>
                                    <CurrencyInput
                                        id="ADDITIONAL_ALLOWANCE_AMOUNT"
                                        name="ADDITIONAL_ALLOWANCE_AMOUNT"
                                        value={
                                            dataAdditionalAllowance.ADDITIONAL_ALLOWANCE_AMOUNT
                                        }
                                        decimalScale={2}
                                        decimalsLimit={2}
                                        onValueChange={(val: any) =>
                                            setDataAdditionalAllowance({
                                                ...dataAdditionalAllowance,
                                                ADDITIONAL_ALLOWANCE_AMOUNT:
                                                    val,
                                            })
                                        }
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                        required
                                        placeholder="0.00"
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-bold text-gray-700">
                                        Allowance Note{" "}
                                        <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        id="ADDITIONAL_ALLOWANCE_NOTE"
                                        name="ADDITIONAL_ALLOWANCE_NOTE"
                                        type="text"
                                        value={
                                            dataAdditionalAllowance.ADDITIONAL_ALLOWANCE_NOTE
                                        }
                                        onChange={(e) =>
                                            setDataAdditionalAllowance({
                                                ...dataAdditionalAllowance,
                                                ADDITIONAL_ALLOWANCE_NOTE:
                                                    e.target.value,
                                            })
                                        }
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-bold mb-1 text-gray-700">
                                        Uang Makan{" "}
                                        <span className="text-red-600">*</span>
                                    </label>
                                    <CurrencyInput
                                        id="ADDITIONAL_ALLOWANCE_UANG_MAKAN"
                                        name="ADDITIONAL_ALLOWANCE_UANG_MAKAN"
                                        value={
                                            dataAdditionalAllowance.ADDITIONAL_ALLOWANCE_UANG_MAKAN
                                        }
                                        decimalScale={2}
                                        decimalsLimit={2}
                                        onValueChange={(val: any) =>
                                            setDataAdditionalAllowance({
                                                ...dataAdditionalAllowance,
                                                ADDITIONAL_ALLOWANCE_UANG_MAKAN:
                                                    val,
                                            })
                                        }
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                        required
                                        placeholder="0.00"
                                        autoComplete="off"
                                    />
                                </div>
                            </div>
                        </>
                    }
                />
            )}

            {/* {dataEditLembur && ( */}
            <ModalToAction
                buttonAddOns={"Delete"}
                actionDelete={deleteAdditionalAllowance}
                show={modal.modalEditAdditionalAllowance}
                onClose={() => {
                    setModal({
                        modalEditAdditionalAllowance: false,
                    }),
                        setDataEditAdditionalAllowance({});
                }}
                headers={{ "Content-type": "multipart/form-data" }}
                submitButtonName={"Edit"}
                cancelButtonName={"Close"}
                title={"Edit Additional Allowance"}
                url={`/editAdditionalAllowance`}
                method={"post"}
                data={dataEditAdditionalAllowance}
                onSuccess={handleSuccess}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[40%]"
                }
                body={
                    <>
                        <div className="bg-white shadow-md rounded-lg p-3">
                            <div className="mb-4">
                                <label className="block text-sm font-bold text-gray-700">
                                    Allowance Name{" "}
                                    <span className="text-red-600">*</span>
                                </label>
                                <input
                                    id="ADDITIONAL_ALLOWANCE_NAME"
                                    name="ADDITIONAL_ALLOWANCE_NAME"
                                    type="text"
                                    value={
                                        dataEditAdditionalAllowance.ADDITIONAL_ALLOWANCE_NAME
                                    }
                                    onChange={(e) =>
                                        setDataEditAdditionalAllowance({
                                            ...dataEditAdditionalAllowance,
                                            ADDITIONAL_ALLOWANCE_NAME:
                                                e.target.value,
                                        })
                                    }
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-1 text-gray-700">
                                    Allowance Amount{" "}
                                    <span className="text-red-600">*</span>
                                </label>
                                <CurrencyInput
                                    id="ADDITIONAL_ALLOWANCE_AMOUNT"
                                    name="ADDITIONAL_ALLOWANCE_AMOUNT"
                                    value={
                                        dataEditAdditionalAllowance.ADDITIONAL_ALLOWANCE_AMOUNT
                                    }
                                    decimalScale={2}
                                    decimalsLimit={2}
                                    onValueChange={(val: any) =>
                                        setDataEditAdditionalAllowance({
                                            ...dataEditAdditionalAllowance,
                                            ADDITIONAL_ALLOWANCE_AMOUNT: val,
                                        })
                                    }
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                    required
                                    placeholder="0.00"
                                    autoComplete="off"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold text-gray-700">
                                    Allowance Note{" "}
                                    <span className="text-red-600">*</span>
                                </label>
                                <input
                                    id="ADDITIONAL_ALLOWANCE_NOTE"
                                    name="ADDITIONAL_ALLOWANCE_NOTE"
                                    type="text"
                                    value={
                                        dataEditAdditionalAllowance.ADDITIONAL_ALLOWANCE_NOTE
                                    }
                                    onChange={(e) =>
                                        setDataEditAdditionalAllowance({
                                            ...dataEditAdditionalAllowance,
                                            ADDITIONAL_ALLOWANCE_NOTE:
                                                e.target.value,
                                        })
                                    }
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-1 text-gray-700">
                                    Uang Makan{" "}
                                    <span className="text-red-600">*</span>
                                </label>
                                <CurrencyInput
                                    id="ADDITIONAL_ALLOWANCE_UANG_MAKAN"
                                    name="ADDITIONAL_ALLOWANCE_UANG_MAKAN"
                                    value={
                                        dataEditAdditionalAllowance.ADDITIONAL_ALLOWANCE_UANG_MAKAN
                                    }
                                    decimalScale={2}
                                    decimalsLimit={2}
                                    onValueChange={(val: any) =>
                                        setDataEditAdditionalAllowance({
                                            ...dataEditAdditionalAllowance,
                                            ADDITIONAL_ALLOWANCE_UANG_MAKAN: val,
                                        })
                                    }
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 text-right"
                                    required
                                    placeholder="0.00"
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                    </>
                }
            />
            {/* )} */}

            {/* End Modal Add Additional Allowance */}

            <div className="grid grid-cols-4 gap-4  xs:grid xs:grid-cols-1 xs:gap-0 lg:grid lg:grid-cols-4 lg:gap-4 h-[100%]">
                <div className="relative col-span-4 bg-white shadow-md rounded-md p-5 max-h-[100rem] xs:mt-4 lg:mt-0">
                    <div className="mb-4">
                        <Button
                            className="p-2"
                            onClick={() => {
                                handleAddAdditionalAllowance();
                            }}
                        >
                            {"Add Additional Allowance"}
                        </Button>
                    </div>
                    <div className="ag-grid-layouts rounded-md shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-2.5">
                        <AGGrid
                            addButtonLabel={undefined}
                            addButtonModalState={undefined}
                            withParam={""}
                            searchParam={""}
                            // loading={isLoading.get_policy}
                            url={"getAdditionalAllowanceAgGrid"}
                            doubleClickEvent={handleEditModal}
                            triggeringRefreshData={successSearch}
                            colDefs={[
                                {
                                    headerName: "No.",
                                    valueGetter: "node.rowIndex + 1",
                                    flex: 1,
                                },
                                {
                                    headerName: "Additional Allowance Name",
                                    flex: 4,
                                    field: "ADDITIONAL_ALLOWANCE_NAME",
                                },
                                {
                                    headerName: "Additional Allowance Amount",
                                    flex: 3,
                                    type: "rightAligned",
                                    // field: "ADDITIONAL_ALLOWANCE_AMOUNT",
                                    valueGetter: function (params: any) {
                                        if (params.data) {
                                            return new Intl.NumberFormat("id", {
                                                style: "decimal",
                                            }).format(
                                                params.data
                                                    .ADDITIONAL_ALLOWANCE_AMOUNT
                                            );
                                        }
                                    },
                                },
                                {
                                    headerName: "Additional Allowance Note",
                                    flex: 4,
                                    field: "ADDITIONAL_ALLOWANCE_NOTE",
                                },
                            ]}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
