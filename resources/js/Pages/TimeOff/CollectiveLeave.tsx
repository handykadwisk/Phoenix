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
        modalDetailCollectiveLeave: false,
    });

    const fieldCollectiveLeave = {
        TITLE: "",
        detail: [{ DATE_OF_LEAVE :""}],
    };

    const [dataCollectiveLeave, setDataCollectiveLeave] = useState<any>({});
    const handleCollectiveLeave = () => {
        setDataCollectiveLeave(fieldCollectiveLeave)
        setModal({
            modalSetCollectiveLeave: true,
            modalDetailCollectiveLeave: false,
        });
    };
    console.log("dataCollectiveLeave: ", dataCollectiveLeave);

    const handleSuccessCollectiveLeave = (message: string) => {
        setIsSuccess("");
        if (message != "") {
            setIsSuccess(message);
            setDataCollectiveLeave(fieldCollectiveLeave);
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
        setModal({
            modalSetCollectiveLeave: false,
            modalDetailCollectiveLeave: false,
        });
    };

    const collectiveLeaveDetail = ( value: any, i:number) => {
         const items = [...dataCollectiveLeave.detail];
         items[i]["DATE_OF_LEAVE"] = value;
         setDataCollectiveLeave({
             ...dataCollectiveLeave,
             detail: items,
         });        
    };

    const deleteRowDate = (i: number) => {
        const val = [...dataCollectiveLeave.detail];
        val.splice(i, 1);
        setDataCollectiveLeave({
            ...dataCollectiveLeave,
            detail: val,
        });
    };

    const addRowDate = (e: FormEvent) => {
        e.preventDefault();
        setDataCollectiveLeave({
            ...dataCollectiveLeave,
            detail: [
                ...dataCollectiveLeave.detail,
                {
                    DATE_OF_LEAVE: "",
                },
            ],
        });

        // setDailyOff([...dailyOff, { DATE: null }]);
    };

    // End Collective Leave


    // Edit Collective Leave
    const [detailCollectiveLeave, setDetailCollectiveLeave] = useState<any>({});
    const handleDetailCollectiveLeave = async (data: any) => {
        await axios
            .get(`/getCollectiveLeaveById/${data.COLLECTIVE_LEAVE_ID}`)
            .then((res) => setDetailCollectiveLeave(res.data))
            .catch((err) => console.log(err));


        setModal({
            modalSetCollectiveLeave: false,
            modalDetailCollectiveLeave: !modal.modalDetailCollectiveLeave,
        });
    };
    console.log("detailCollectiveLeave: ", detailCollectiveLeave);

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
                            <div className="relative mt-3 grid grid-cols-2 ">
                                <div>
                                    <label htmlFor="title">Title</label>
                                </div>
                                <div className=" text-red-600">*</div>
                            </div>
                            <div className="relative mt-2 col-span-4">
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    value={dataCollectiveLeave.TITLE}
                                    onChange={(e: any) => {
                                        setDataCollectiveLeave({
                                            ...dataCollectiveLeave,
                                            TITLE: e.target.value,
                                        });
                                    }}
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        {dataCollectiveLeave.detail &&
                            dataCollectiveLeave.detail.map(
                                (cLD: any, i: number) => (
                                    <div className="grid grid-cols-5 mt-2">
                                        <div className="relative mt-3 grid grid-cols-2 ">
                                            <div>
                                                <label htmlFor="date">
                                                    {i == 0 ? "Date" : ""}
                                                </label>
                                            </div>
                                            <div className=" text-red-600">
                                                {i == 0 ? "*" : ""}
                                            </div>
                                        </div>
                                        <div className="flex mt-2 col-span-2 gap-4">
                                            <div className="relative max-w-sm">
                                                <div className="absolute inset-y-0 z-99999 start-0 flex items-center px-3  pointer-events-none">
                                                    <svg
                                                        className="w-3 h-3 text-gray-500 dark:text-gray-400"
                                                        aria-hidden="true"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                                    </svg>
                                                </div>
                                                <DatePicker
                                                    required
                                                    selected={cLD.DATE_OF_LEAVE}
                                                    onChange={(date: any) =>
                                                        collectiveLeaveDetail(
                                                            date.toLocaleDateString(
                                                                "en-CA"
                                                            ),
                                                            i
                                                        )
                                                    }
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dateFormat={"dd-MM-yyyy"}
                                                    placeholderText="dd-mm-yyyyy"
                                                    className="border-0 rounded-md shadow-md px-10 text-sm h-9 w-full focus:ring-2 focus:ring-inset focus:ring-red-600"
                                                />
                                            </div>
                                            <div className=" mt-2 ">
                                                {i > 0 ? (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="mx-auto h-6 text-red-500 cursor-pointer"
                                                        onClick={() => {
                                                            deleteRowDate(i);
                                                        }}
                                                    >
                                                        <path
                                                            fill="#AB7C94"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M6 18 18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                ) : (
                                                    ""
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}

                        <div className="grid grid-cols-5">
                            <div className="relative mt-3 grid grid-cols-2 "></div>
                            <div className="relative mt-3 col-span-4">
                                <a
                                    href=""
                                    className="rounded bg-indigo-600 px-2 py-1 text-xs text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    // className="text-xs mt-2 text-slate-800 ms-1 py-1 px-1.5 bg-blue-400 rounded-md"
                                    onClick={(e) => addRowDate(e)}
                                >
                                    + Add Date
                                </a>
                            </div>
                        </div>
                    </>
                }
            />
            {/* End Modal Set Collective Leave */}

            <ModalToAction
                show={modal.modalDetailCollectiveLeave}
                onClose={() =>
                    setModal({
                        modalDetailCollectiveLeave: false,
                    })
                }
                headers={null}
                submitButtonName={"Cancel Collective Leave"}
                title={"Detail Collective Leave"}
                url={`/cancelCollectiveLeave`}
                method={"post"}
                data={detailCollectiveLeave}
                onSuccess={handleSuccessCollectiveLeave}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[50%]"
                }
                body={
                    <>
                        <div className="grid grid-cols-5">
                            <div className="relative mt-3 grid grid-cols-2 ">
                                <div>
                                    <label htmlFor="title">Title</label>
                                </div>
                            </div>
                            <div className="relative mt-2 col-span-4">
                                {detailCollectiveLeave.TITLE}
                            </div>
                        </div>

                        {detailCollectiveLeave.detail &&
                            detailCollectiveLeave.detail.map(
                                (cLD: any, i: number) => (
                                    <div className="grid grid-cols-5 mt-2">
                                        <div className="relative mt-3 grid grid-cols-2 ">
                                            <div>
                                                <label htmlFor="date">
                                                    {i == 0 ? "Date" : ""}
                                                </label>
                                            </div>
                                        </div>
                                        <div className="flex mt-2 col-span-2 gap-4">
                                            {dateFormat(
                                                cLD.COLLECTIVE_LEAVE_DETAIL_DATE,
                                                "dd-mm-yyyy"
                                            )}
                                        </div>
                                    </div>
                                )
                            )}
                    </>
                }
            />

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
                            doubleClickEvent={handleDetailCollectiveLeave}
                            triggeringRefreshData={isSuccess}
                            colDefs={[
                                {
                                    headerName: "No.",
                                    valueGetter: "node.rowIndex + 1",
                                    flex: 1,
                                },
                                {
                                    headerName: "Collective Leave Title",
                                    flex: 10,
                                    field: "TITLE",
                                    // valueGetter: function (params: any) {
                                    //     if (params.data) {
                                    //         return params.data.TITLE;
                                    //     }
                                    // },
                                },
                            ]}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
