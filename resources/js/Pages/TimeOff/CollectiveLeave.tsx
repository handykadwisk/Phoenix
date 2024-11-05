import { PageProps } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import Button from "@/Components/Button/Button";
import TextInput from "@/Components/TextInput";
import AGGrid from "@/Components/AgGrid";
import { FormEvent, useEffect, useState } from "react";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import InputLabel from "@/Components/InputLabel";
import ToastMessage from "@/Components/ToastMessage";
import ModalToAction from "@/Components/Modal/ModalToAction";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import DetailAttendanceSetting from "./DetailAttendanceSetting";
import axios from "axios";
import dateFormat from "dateformat";
import Input from "@/Components/Input";
import Swal from "sweetalert2";

export default function Index({ auth }: PageProps) {
    const { timeOffTipes }: any = usePage().props;

    const employee: any = auth.user.employee;
    const [isSuccess, setIsSuccess] = useState<string>("");

    // Collective Leave
    const [modal, setModal] = useState<any>({
        modalSetCollectiveLeave: false,
    });

    const [dataCollectiveLeave, setDataCollectiveLeave] = useState<any>({
        DATE_OF_LEAVE: "",
    });
    const handleCollectiveLeave = () => {
        setModal({
            modalSetCollectiveLeave: true,
        });
    };
    console.log("dataCollectiveLeave: ", dataCollectiveLeave);

    const handleSuccessCollectiveLeave = (message: string) => {
        setIsSuccess("");
        if (message != "") {
            setIsSuccess(message);
            setDataCollectiveLeave({
                DATE_OF_LEAVE: "",
            });
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
        setModal({
            modalSetCollectiveLeave: false,
        });
    };
    // End Collective Leave


    // Edit Collective Leave
    const handleEdit = async (data: any) => {
        // await axios
        //     .get(`/getRequestTimeOffById/${data.REQUEST_TIME_OFF_MASTER_ID}`)
        //     .then((res) => setEditRequestTimeOff(res.data))
        //     .catch((err) => console.log(err));

        // setSelectedTypeForEdit(
        //     getSelectedType(data.TIME_OFF_TYPE_ID)
        //         ? getSelectedType(data.TIME_OFF_TYPE_ID)
        //         : {}
        // );

        // setModal({
        //     modalSetCollectiveLeave: false,
        //     modalEditRequestTimeOff: !modal.modalEditRequestTimeOff,
        // });
    };

    // End Edit Collective Leave
    


    return (
        <AuthenticatedLayout user={auth.user} header={"Collective Leave"}>
            <Head title="Collective Leave" />
            {isSuccess && (
                <ToastMessage
                    message={isSuccess}
                    isShow={true}
                    type={"success"}
                />
            )}

            {/* Modal Set Collective Leave */}
            <ModalToAdd
                buttonAddOns={""}
                show={modal.modalSetCollectiveLeave}
                onClose={() =>
                    setModal({
                        modalSetCollectiveLeave: false,
                    })
                }
                title={"Set Collective Leave"}
                url={`/setCollectiveLeave`}
                data={dataCollectiveLeave}
                onSuccess={handleSuccessCollectiveLeave}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[50%]"
                }
                body={
                    <>
                        <div className="grid grid-cols-5">
                            <div className="relative mt-2 grid grid-cols-2 ">
                                <div>
                                    <label htmlFor="date">Date</label>
                                </div>
                                <div className=" text-red-600">*</div>
                            </div>
                            <div className="relative mt-2 col-span-4">
                                <DatePicker
                                    required
                                    selected={dataCollectiveLeave.DATE_OF_LEAVE}
                                    onChange={(date: any) =>
                                        setDataCollectiveLeave({
                                            ...dataCollectiveLeave,
                                            DATE_OF_LEAVE:
                                                date.toLocaleDateString(
                                                    "en-CA"
                                                ),
                                        })
                                    }
                                    showMonthDropdown
                                    showYearDropdown
                                    dateFormat={"dd-MM-yyyy"}
                                    placeholderText="dd-mm-yyyyy"
                                    className="border-0 rounded-md shadow-md px-10 text-sm h-9 w-full focus:ring-2 focus:ring-inset focus:ring-red-600"
                                />
                            </div>
                        </div>
                    </>
                }
            />
            {/* End Modal Set Collective Leave */}

            {/* <ModalToAction
                buttonAddOns={
                    editRequestTimeOff.STATUS == 0 ? "Cancel Request" : null
                }
                show={modal.modalEditRequestTimeOff}
                onClose={() =>
                    setModal({
                        modalEditRequestTimeOff: false,
                    })
                }
                headers={null}
                submitButtonName={
                    editRequestTimeOff.STATUS == 0 ? "Edit" : null
                }
                title={"Edit Request Time Off"}
                url={`/editRequestTimeOff`}
                method={"post"}
                data={editRequestTimeOff}
                onSuccess={handleSuccessCollectiveLeave}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[75%]"
                }
                body={
                    <>
                        <div className="grid grid-cols-5">
                            <div className="relative mt-2 ">
                                <label htmlFor="date">Date</label>
                            </div>
                            <div className="relative mt-2 col-span-4">
                                <DatePicker
                                    required
                                    selected={dataCollectiveLeave.DATE_OF_LEAVE}
                                    onChange={(date: any) =>
                                        setDataCollectiveLeave({
                                            ...dataCollectiveLeave,
                                            DATE_OF_LEAVE:
                                                date.toLocaleDateString(
                                                    "en-CA"
                                                ),
                                        })
                                    }
                                    showMonthDropdown
                                    showYearDropdown
                                    dateFormat={"dd-MM-yyyy"}
                                    placeholderText="dd-mm-yyyyy"
                                    className="border-0 rounded-md shadow-md px-10 text-sm h-9 w-full focus:ring-2 focus:ring-inset focus:ring-red-600"
                                />
                            </div>
                        </div>
                    </>
                }
            /> */}

            <div className="grid grid-cols-4 gap-4 px-4 py-2 xs:grid xs:grid-cols-1 xs:gap-0 lg:grid lg:grid-cols-4 lg:gap-4 h-[100%]">
                <div className="flex flex-col relative">
                    <div className="bg-white mb-4 rounded-md shadow-md p-4">
                        <Button
                            className="p-2"
                            onClick={() => {
                                handleCollectiveLeave();
                            }}
                        >
                            {"Set Collective Leave"}
                        </Button>
                    </div>
                </div>

                <div className="relative col-span-3 bg-white shadow-md rounded-md p-5 max-h-[100rem] xs:mt-4 lg:mt-0">
                    <div className="ag-grid-layouts rounded-md shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-2.5">
                        <AGGrid
                            addButtonLabel={undefined}
                            addButtonModalState={undefined}
                            withParam={""}
                            searchParam={""}
                            // loading={isLoading.get_policy}
                            url={"getCollectiveLeaveForAgGrid"}
                            doubleClickEvent={handleEdit}
                            triggeringRefreshData={isSuccess}
                            colDefs={[
                                {
                                    headerName: "Request Date",
                                    flex: 3,
                                    valueGetter: function (params: any) {
                                        if (params.data) {
                                            return dateFormat(
                                                params.data.REQUEST_DATE,
                                                "dd-mm-yyyy"
                                            );
                                        }
                                    },
                                },
                                {
                                    headerName: "Status",
                                    // field: "POLICY_STATUS_ID",
                                    flex: 4,
                                    valueGetter: function (params: any) {
                                        if (params.data) {
                                            if (params.data.STATUS == 0) {
                                                return "Waiting Approval";
                                            } else if (
                                                params.data.STATUS == 1
                                            ) {
                                                return "Rejected";
                                            } else {
                                                return "Approved";
                                            }
                                        }
                                    },
                                },
                            ]}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
