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
    const { timeOffTipes, employees }: any = usePage().props;

    const [isSuccess, setIsSuccess] = useState<string>("");
    const [successSearch, setSuccessSearch] = useState<string>("");

    // Collective Leave
    const [modal, setModal] = useState<any>({
        modalSetCollectiveLeave: false,
        modalDetailCollectiveLeave: false,
    });

    // const [searchDate, setSearchDate] = useState<any>({
    //     DATE: new Date().toLocaleDateString("en-CA"), //dateFormat(new Date(), "dd-mm-yyyy"),
    // });
    const [searchDate, setSearchDate] = useState<any>({
        time_off_search: [
            {
                DATE: new Date().toLocaleDateString("en-CA")
            },
        ],
    });

     const inputDataSearch = (
         name: string,
         value: string | undefined,
         i: number
     ) => {
         const changeVal: any = [...searchDate.time_off_search];
         changeVal[i][name] = value;
         setSearchDate({ ...searchDate, time_off_search: changeVal });
    };
    
    console.log("searchDate: ", searchDate);

     const getEmployeeById = (id: any) => {
         const datas = employees;
         const result = datas.find((value: any) => value.EMPLOYEE_ID == id);
         return result ? result : null;
     };

    const fieldCollectiveLeave = {
        TITLE: "",
        detail: [{ DATE_OF_LEAVE: "" }],
    };

    const [dataCollectiveLeave, setDataCollectiveLeave] = useState<any>({});
    const handleCollectiveLeave = () => {
        setDataCollectiveLeave(fieldCollectiveLeave);
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

    const collectiveLeaveDetail = (value: any, i: number) => {
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

    const cancelCollectiveLeave = async (e: any, data: any, flag: any) => {
        e.preventDefault();

        Swal.fire({
            // title: '',
            text: "Are you sure to Cancel this Collective Leave?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Sure!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // send request to server
                    const response = await axios.post(
                        `/cancelCollectiveLeave`,
                        {
                            data,
                        }
                    );
                    console.log("response: ", response);

                    // check status response
                    if (response.status) {
                        if (response.data.msg) {
                            // Swal.fire(
                            //     "Canceled!",
                            //     "Collective Leave has been canceled.",
                            //     "success"
                            // );
                        } else {
                            Swal.fire(
                                "Failed!",
                                "Failed Canceled Collective Leave."
                            );
                        }

                        handleSuccessCollectiveLeave(response.data.msg); // Panggil fungsi sukses untuk memperbarui UI atau state
                    } else {
                        throw new Error("Unexpected response status");
                    }
                } catch (error) {
                    console.error(error);
                    Swal.fire(
                        "Error!",
                        "There was an error canceled Collective Leave.",
                        "error"
                    );
                }
            }
        });
    };

    // End Edit Collective Leave

    return (
        <AuthenticatedLayout user={auth.user} header={"Time Off"}>
            <Head title="Time Off" />
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
                buttonAddOns={"Cancel Collective Leave"}
                actionDelete={cancelCollectiveLeave}
                show={modal.modalDetailCollectiveLeave}
                onClose={() =>
                    setModal({
                        modalDetailCollectiveLeave: false,
                    })
                }
                headers={null}
                submitButtonName={null}
                cancelButtonName={"Close"}
                title={"Detail Collective Leave"}
                url={''}
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

            <section className="bg-gray-100 py-2">
                <div className=" mx-auto  grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className=" p-3 bg-white shadow-md rounded-md">
                        <div className="">
                            <div className="flex justify-center items-center ">
                                <h3 className="text-2xl font-semibold text-gray-800">
                                    Time Off (Report)
                                </h3>
                            </div>
                            <div className="bg-white rounded-md shadow-md p-4 h-[100%] relative mt-1">
                                {"Search Time Off Date :    "}
                                <DatePicker
                                    required
                                    selected={
                                        searchDate.time_off_search[0].DATE
                                    }
                                    onChange={(date: any) => {
                                        inputDataSearch(
                                            "DATE",
                                            date.toLocaleDateString("en-CA"),
                                            0
                                        );
                                        setSuccessSearch("success");
                                        setTimeout(() => {
                                            setSuccessSearch("");
                                        }, 1000);
                                    }}
                                    showMonthDropdown
                                    showYearDropdown
                                    dateFormat={"dd-MM-yyyy"}
                                    placeholderText="dd-mm-yyyyy"
                                    className="border-0 rounded-md shadow-md ring-1 ring-inset ring-gray-300 px-10 text-sm h-9 w-44 focus:ring-2 focus:ring-inset focus:ring-red-600"
                                />
                            </div>

                            <div className="ag-grid-layouts w-full mt-4">
                                <AGGrid
                                    addButtonLabel={undefined}
                                    addButtonModalState={undefined}
                                    withParam={""}
                                    searchParam={searchDate.time_off_search}
                                    url={"agGridRequestTimeOffForHR"}
                                    doubleClickEvent={undefined}
                                    triggeringRefreshData={successSearch}
                                    colDefs={[
                                        {
                                            headerName: "No.",
                                            valueGetter: "node.rowIndex + 1",
                                            flex: 2,
                                        },
                                        {
                                            headerName: "Employee",
                                            flex: 6,
                                            // field: "TITLE",
                                            valueGetter: function (
                                                params: any
                                            ) {
                                                if (params.data) {
                                                    return (
                                                        getEmployeeById(
                                                            params.data
                                                                .EMPLOYEE_ID
                                                        ) &&
                                                        getEmployeeById(
                                                            params.data
                                                                .EMPLOYEE_ID
                                                        ).EMPLOYEE_FIRST_NAME
                                                    );

                                                    // return params.data.EMPLOYEE_ID
                                                }
                                            },
                                        },
                                        {
                                            headerName: "Time Off Date",
                                            flex: 3,
                                            valueGetter: function (
                                                params: any
                                            ) {
                                                if (params.data) {
                                                    return dateFormat(
                                                        params.data
                                                            .DATE_OF_LEAVE,
                                                        "dd mmm yyyy"
                                                    );
                                                }
                                            },
                                        },
                                        {
                                            headerName: "Description.",
                                            field: "DESCRIPTION",
                                            flex: 6,
                                        },
                                    ]}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="p-3 bg-white shadow-md rounded-md">
                        <div className="">
                            <div className="flex justify-center items-center">
                                <h3 className="text-2xl font-semibold text-gray-800">
                                    Collective Leave
                                </h3>
                            </div>
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
                            <div className="ag-grid-layouts w-full">
                                <AGGrid
                                    addButtonLabel={undefined}
                                    addButtonModalState={undefined}
                                    withParam={""}
                                    searchParam={""}
                                    url={"getCollectiveLeaveForAgGrid"}
                                    doubleClickEvent={
                                        handleDetailCollectiveLeave
                                    }
                                    triggeringRefreshData={isSuccess}
                                    colDefs={[
                                        {
                                            headerName: "No.",
                                            valueGetter: "node.rowIndex + 1",
                                            flex: 1,
                                        },
                                        {
                                            headerName:
                                                "Collective Leave Title",
                                            flex: 8,
                                            field: "TITLE",
                                        },
                                    ]}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    );
}
