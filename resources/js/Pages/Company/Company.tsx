import { PageProps } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import Button from "@/Components/Button/Button";
import TextInput from "@/Components/TextInput";
import AGGrid from "@/Components/AgGrid";
import { useState } from "react";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import InputLabel from "@/Components/InputLabel";
import TextArea from "@/Components/TextArea";
import ToastMessage from "@/Components/ToastMessage";
import ModalToAction from "@/Components/Modal/ModalToAction";
import DetailCompany from "./DetailCompany";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import "@progress/kendo-theme-default/dist/all.css";

export default function Company({ auth }: PageProps) {
    // modal for commpany
    const [modalCompany, setModalCompany] = useState<any>({
        add: false,
        view: false,
    });

    const users = [
        { id: 1, name: "Alice", age: 30 },
        { id: 2, name: "Bob", age: 25 },
        { id: 3, name: "Charlie", age: 35 },
    ];

    // data Request Add Company
    const [dataCompany, setDataCompany] = useState<any>({
        COMPANY_NAME: "",
        COMPANY_ABBREVIATION: "",
        COMPANY_AKA: "",
        COMPANY_EMAIL: "",
        COMPANY_WEBSITE: "",
        COMPANY_DESCRIPTION: "",
        COMPANY_SIGNATURE_NAME: "",
        COMPANY_SIGNATURE_TITLE: "",
        COMPANY_BANK_ACCOUNT_NUMBER: "",
        COMPANY_BANK_ACCOUNT_NAME: "",
    });
    const [isSuccess, setIsSuccess] = useState<string>("");
    const handleSuccessAddCompany = (message: string) => {
        setIsSuccess("");
        if (message != "") {
            setIsSuccess(message[0]);
            setDataCompany({
                COMPANY_NAME: "",
                COMPANY_ABBREVIATION: "",
                COMPANY_AKA: "",
                COMPANY_EMAIL: "",
                COMPANY_WEBSITE: "",
                COMPANY_DESCRIPTION: "",
                COMPANY_SIGNATURE_NAME: "",
                COMPANY_SIGNATURE_TITLE: "",
                COMPANY_BANK_ACCOUNT_NUMBER: "",
                COMPANY_BANK_ACCOUNT_NAME: "",
            });
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
        }
    };

    const [detailCompany, setDetailCompany] = useState<any>({
        COMPANY_NAME: "",
        COMPANY_ID: "",
    });

    const handleDetailCompany = async (data: any) => {
        setDetailCompany({
            COMPANY_NAME: data.COMPANY_NAME,
            COMPANY_ID: data.COMPANY_ID,
        });

        setModalCompany({
            add: false,
            view: !modalCompany.view,
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={"Company"}>
            <Head title="Company" />
            {isSuccess && (
                <ToastMessage
                    message={isSuccess}
                    isShow={true}
                    type={"success"}
                />
            )}
            {/* Modal Add Company */}
            <ModalToAdd
                buttonAddOns={""}
                show={modalCompany.add}
                onClose={() =>
                    setModalCompany({
                        add: false,
                    })
                }
                title={"Add Company"}
                url={`/addCompany`}
                data={dataCompany}
                onSuccess={handleSuccessAddCompany}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[70%]"
                }
                body={
                    <>
                        <div className="mb-2">
                            <div className="">
                                <div className="relative">
                                    <InputLabel
                                        className="absolute"
                                        value={"Company Name"}
                                    />
                                    <div className="ml-[7.5rem] text-red-600">
                                        *
                                    </div>
                                    <TextInput
                                        type="text"
                                        value={dataCompany.COMPANY_NAME}
                                        className="mt-1"
                                        onChange={(e) => {
                                            setDataCompany({
                                                ...dataCompany,
                                                COMPANY_NAME: e.target.value,
                                            });
                                        }}
                                        required
                                        placeholder="Company Name"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div className="relative">
                                    <InputLabel
                                        className="absolute"
                                        value={"Abbreviation"}
                                    />
                                    <div className="ml-[5.8rem] text-red-600">
                                        *
                                    </div>
                                    <TextInput
                                        type="text"
                                        value={dataCompany.COMPANY_ABBREVIATION}
                                        className="mt-1"
                                        onChange={(e) => {
                                            setDataCompany({
                                                ...dataCompany,
                                                COMPANY_ABBREVIATION:
                                                    e.target.value,
                                            });
                                        }}
                                        required
                                        placeholder="Abbreviation"
                                    />
                                </div>
                                <div className="relative">
                                    <InputLabel
                                        className="absolute"
                                        value={"AKA"}
                                    />
                                    <div className="ml-[1.9rem] text-red-600">
                                        *
                                    </div>
                                    <TextInput
                                        type="text"
                                        value={dataCompany.COMPANY_AKA}
                                        className="mt-1"
                                        onChange={(e) => {
                                            setDataCompany({
                                                ...dataCompany,
                                                COMPANY_AKA: e.target.value,
                                            });
                                        }}
                                        required
                                        placeholder="AKA"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div className="">
                                    <InputLabel className="" value={"Email"} />
                                    <TextInput
                                        type="text"
                                        value={dataCompany.COMPANY_EMAIL}
                                        className="mt-1"
                                        onChange={(e) => {
                                            setDataCompany({
                                                ...dataCompany,
                                                COMPANY_EMAIL: e.target.value,
                                            });
                                        }}
                                        placeholder="email@example.com"
                                    />
                                </div>
                                <div className="">
                                    <InputLabel
                                        className=""
                                        value={"Website"}
                                    />
                                    <TextInput
                                        type="text"
                                        value={dataCompany.COMPANY_WEBSITE}
                                        className="mt-1"
                                        onChange={(e) => {
                                            setDataCompany({
                                                ...dataCompany,
                                                COMPANY_WEBSITE: e.target.value,
                                            });
                                        }}
                                        placeholder="www.example.com"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div className="">
                                    <InputLabel
                                        className=""
                                        value={"Signature Name"}
                                    />
                                    <TextInput
                                        type="text"
                                        value={
                                            dataCompany.COMPANY_SIGNATURE_NAME
                                        }
                                        className="mt-1"
                                        onChange={(e) => {
                                            setDataCompany({
                                                ...dataCompany,
                                                COMPANY_SIGNATURE_NAME:
                                                    e.target.value,
                                            });
                                        }}
                                        placeholder="Signature Name
"
                                    />
                                </div>
                                <div className="">
                                    <InputLabel
                                        className=""
                                        value={"Signature Position"}
                                    />
                                    <TextInput
                                        type="text"
                                        value={
                                            dataCompany.COMPANY_SIGNATURE_TITLE
                                        }
                                        className="mt-1"
                                        onChange={(e) => {
                                            setDataCompany({
                                                ...dataCompany,
                                                COMPANY_SIGNATURE_TITLE:
                                                    e.target.value,
                                            });
                                        }}
                                        placeholder="Signature Position"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div className="relative">
                                    <InputLabel
                                        className="absolute"
                                        value={"Account Number"}
                                    />
                                    <div className="ml-[7.8rem] text-red-600">
                                        *
                                    </div>
                                    <TextInput
                                        type="text"
                                        value={
                                            dataCompany.COMPANY_BANK_ACCOUNT_NUMBER
                                        }
                                        className="mt-1"
                                        onChange={(e) => {
                                            setDataCompany({
                                                ...dataCompany,
                                                COMPANY_BANK_ACCOUNT_NUMBER:
                                                    e.target.value,
                                            });
                                        }}
                                        required
                                        placeholder="Account Number"
                                    />
                                </div>
                                <div className="relative">
                                    <InputLabel
                                        className="absolute"
                                        value={"Account Name"}
                                    />
                                    <div className="ml-[6.9rem] text-red-600">
                                        *
                                    </div>
                                    <TextInput
                                        type="text"
                                        value={
                                            dataCompany.COMPANY_BANK_ACCOUNT_NAME
                                        }
                                        className="mt-1"
                                        onChange={(e) => {
                                            setDataCompany({
                                                ...dataCompany,
                                                COMPANY_BANK_ACCOUNT_NAME:
                                                    e.target.value,
                                            });
                                        }}
                                        required
                                        placeholder="Account Name"
                                    />
                                </div>
                            </div>
                            <div className="mt-2">
                                <InputLabel
                                    htmlFor="COMPANY_DESCRIPTION"
                                    value="Company Description"
                                />
                                <TextArea
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                    defaultValue={
                                        dataCompany.COMPANY_DESCRIPTION
                                    }
                                    onChange={(e: any) =>
                                        setDataCompany({
                                            ...dataCompany,
                                            COMPANY_DESCRIPTION: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </>
                }
            />
            {/* End Modal Add Company */}

            {/* Detail Company */}
            <ModalToAction
                show={modalCompany.view}
                onClose={() =>
                    setModalCompany({
                        add: false,
                        view: false,
                    })
                }
                title={detailCompany.COMPANY_NAME}
                url={""}
                data={""}
                onSuccess={""}
                method={""}
                headers={""}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[85%]"
                }
                submitButtonName={""}
                body={
                    <>
                        <DetailCompany
                            isSuccess={isSuccess}
                            idCompany={detailCompany.COMPANY_ID}
                            setIsSuccess={setIsSuccess}
                            setDetailCompanyNew={setDetailCompany}
                        />
                    </>
                }
            />

            {/* End y */}

            <div className="grid grid-cols-4 gap-4 px-4 py-2 xs:grid xs:grid-cols-1 xs:gap-0 lg:grid lg:grid-cols-4 lg:gap-4 h-[100%]">
                <div className="flex flex-col relative">
                    <div className="bg-white mb-4 rounded-md shadow-md p-4">
                        <Button
                            className="p-2"
                            onClick={() => {
                                setModalCompany({
                                    add: !modalCompany.add,
                                });
                            }}
                        >
                            {"Add Company"}
                        </Button>
                    </div>
                    <div className="bg-white rounded-md shadow-md p-4 h-[100%] relative">
                        <TextInput
                            type="text"
                            // value={
                            //     searchRelation.relation_search[0]
                            //         .RELATION_ORGANIZATION_NAME === ""
                            //         ? ""
                            //         : searchRelation.relation_search[0]
                            //               .RELATION_ORGANIZATION_NAME
                            // }
                            className="mt-2 ring-1 ring-red-600"
                            placeholder="Search Company Name"
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <div className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer">
                                Search
                            </div>
                            <div className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer">
                                Clear Search
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="col-span-3 bg-white shadow-md rounded-md p-5 xs:mt-4 lg:mt-0">
                    <div className="ag-grid-layouts rounded-md shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-2.5">
                        {/* <AGGrid
                            addButtonLabel={undefined}
                            addButtonModalState={undefined}
                            withParam={""}
                            searchParam={null}
                            // loading={isLoading.get_policy}
                            url={"getCompany"}
                            doubleClickEvent={handleDetailCompany}
                            triggeringRefreshData={isSuccess}
                            colDefs={[
                                {
                                    headerName: "No.",
                                    valueGetter: "node.rowIndex + 1",
                                    flex: 1,
                                },
                                {
                                    headerName: "Company Name",
                                    field: "COMPANY_NAME",
                                    flex: 7,
                                },
                            ]}
                        /> */}
                        <Grid data={users}>
                            <Column field="name" title="Name Relation" />
                        </Grid>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
