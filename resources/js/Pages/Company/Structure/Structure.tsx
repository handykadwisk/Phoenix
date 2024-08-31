import AGGrid from "@/Components/AgGrid";
import InputLabel from "@/Components/InputLabel";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import TextInput from "@/Components/TextInput";
import { PencilSquareIcon, XMarkIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import { FormEvent, PropsWithChildren, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SelectTailwind from "react-tailwindcss-select";
import { useForm } from "@inertiajs/react";
import ModalToAction from "@/Components/Modal/ModalToAction";
import TextArea from "@/Components/TextArea";
import DetailStructure from "./DetailStructure";

export default function Structure({
    idCompany,
    setIsSuccess,
    isSuccess,
    nameCompany,
}: PropsWithChildren<{
    idCompany: any;
    setIsSuccess: any | string | null;
    isSuccess: any | string | null;
    nameCompany: string;
}>) {
    const [refreshGrid, setRefreshGrid] = useState<any>("");
    // modal Structure
    const [modalStructure, setModalStructure] = useState<any>({
        add: false,
        view: false,
    });

    const handleAddStructure = async (e: FormEvent) => {
        e.preventDefault();
        getGrade();
        getStructureCombo(idCompany);
        setModalStructure({
            add: !modalStructure.add,
        });
    };

    // state grade
    const [grade, setGrade] = useState<any>([]);
    // state combo structure
    const [structureCombo, setSetStructureCombo] = useState<any>([]);

    const getStructureCombo = async (id: string) => {
        await axios
            .post(`/getCompanyStructureCombo`, { id })
            .then((res) => {
                setSetStructureCombo(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getGrade = async () => {
        await axios
            .post(`/getGrade`)
            .then((res) => {
                setGrade(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const { data, setData, errors, reset } = useForm<any>({
        COMPANY_STRUCTURE_NAME: "",
        COMPANY_STRUCTURE_ALIAS: "",
        COMPANY_STRUCTURE_DESCRIPTION: "",
        COMPANY_STRUCTURE_PARENT_ID: "",
        COMPANY_ID: idCompany,
        COMPANY_STRUCTURE_MAPPING: "",
        COMPANY_GRADE_ID: "",
    });

    const handleSuccessAddCompanyStructure = (message: string) => {
        setIsSuccess("");
        if (message != "") {
            // getDetailCompany(message[0]);
            setData({
                COMPANY_STRUCTURE_NAME: "",
                COMPANY_STRUCTURE_ALIAS: "",
                COMPANY_STRUCTURE_DESCRIPTION: "",
                COMPANY_STRUCTURE_PARENT_ID: "",
                COMPANY_ID: idCompany,
                COMPANY_STRUCTURE_MAPPING: "",
                COMPANY_GRADE_ID: "",
            });
            setIsSuccess(message[2]);
            setTimeout(() => {
                setIsSuccess("");
            }, 5000);
            setRefreshGrid("success");
            setTimeout(() => {
                setRefreshGrid("");
            }, 1000);
        }
    };

    const [detailStructure, setDetailStructure] = useState<any>({
        COMPANY_STRUCTURE_NAME: "",
        COMPANY_STRUCTURE_ID: "",
    });

    const handleClickDetailCompanyStructure = async (data: any) => {
        getGrade();
        getStructureCombo(idCompany);
        setDetailStructure({
            COMPANY_STRUCTURE_NAME: data.COMPANY_STRUCTURE_ALIAS,
            COMPANY_STRUCTURE_ID: data.COMPANY_STRUCTURE_ID,
        });
        setModalStructure({
            add: false,
            view: !modalStructure.view,
        });
    };

    const [searchStructure, setSearchStructure] = useState<any>({
        company_structure: [
            {
                COMPANY_STRUCTURE_NAME: "",
                COMPANY_STRUCTURE_ID: "",
                flag: "",
            },
        ],
    });

    const inputDataSearch = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...searchStructure.company_structure];
        changeVal[i][name] = value;
        setSearchStructure({
            ...searchStructure,
            company_structure: changeVal,
        });
    };

    // search
    const clearSearchStructure = async (e: FormEvent) => {
        e.preventDefault();
        inputDataSearch("COMPANY_STRUCTURE_NAME", "", 0);
        inputDataSearch("flag", "", 0);
        setRefreshGrid("success");
        setTimeout(() => {
            setRefreshGrid("");
        }, 1000);
    };
    return (
        <>
            {/* modal add structure */}
            <ModalToAdd
                buttonAddOns={""}
                show={modalStructure.add}
                onClose={() =>
                    setModalStructure({
                        add: false,
                    })
                }
                title={"Add Structure"}
                url={`/addCompanyStructure`}
                data={data}
                onSuccess={handleSuccessAddCompanyStructure}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-2xl"
                }
                body={
                    <>
                        <div>
                            <InputLabel
                                className=""
                                htmlFor="COMPANY_ORGANIZATION_NAME"
                                value={"Relation"}
                            />
                            <div className="bg-gray-400 rounded-md py-1 px-2 shadow-md mt-2">
                                {nameCompany}
                            </div>
                        </div>
                        <div className="xs:grid xs:grid-cols-1 xs:gap-4 mt-2 lg:grid lg:grid-cols-2 lg:gap-4">
                            <div className="relative">
                                <InputLabel
                                    className="absolute"
                                    htmlFor="COMPANY_STRUCTURE_NAME"
                                    value={"Structure Name"}
                                />
                                <div className="ml-[7.2rem] text-red-600">
                                    *
                                </div>
                                <TextInput
                                    type="text"
                                    value={data.COMPANY_STRUCTURE_ALIAS}
                                    className="mt-2"
                                    onChange={(e) => {
                                        setData(
                                            "COMPANY_STRUCTURE_ALIAS",
                                            e.target.value
                                        );
                                    }}
                                    required
                                    placeholder="Structure Name"
                                />
                            </div>
                            <div className="relative">
                                <InputLabel
                                    className="absolute"
                                    htmlFor="COMPANY_GRADE_ID"
                                    value={"Grade"}
                                />
                                <div className="ml-[3rem] text-red-600">*</div>
                                <select
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                    value={data.COMPANY_GRADE_ID}
                                    onChange={(e) => {
                                        setData(
                                            "COMPANY_GRADE_ID",
                                            e.target.value
                                        );
                                    }}
                                >
                                    <option value={""}>
                                        -- Choose Grade --
                                    </option>
                                    {grade?.map((dGrade: any, i: number) => {
                                        return (
                                            <option
                                                value={dGrade.GRADE_ID}
                                                key={i}
                                            >
                                                {dGrade.GRADE_AKA}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="mt-2">
                            <InputLabel
                                className=""
                                htmlFor="COMPANY_STRUCTURE_PARENT_ID"
                                value={"Parent Structure"}
                            />
                            <select
                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                value={data.COMPANY_STRUCTURE_PARENT_ID}
                                onChange={(e) => {
                                    setData(
                                        "COMPANY_STRUCTURE_PARENT_ID",
                                        e.target.value
                                    );
                                }}
                            >
                                <option value={""}>-- Choose Parent --</option>
                                {structureCombo?.map(
                                    (comboStructure: any, i: number) => {
                                        return (
                                            <option
                                                value={
                                                    comboStructure.COMPANY_STRUCTURE_ID
                                                }
                                                key={i}
                                            >
                                                {comboStructure.text_combo}
                                            </option>
                                        );
                                    }
                                )}
                            </select>
                        </div>
                        <div className="mt-4 mb-2">
                            <InputLabel
                                htmlFor="COMPANY_STRUCTURE_DESCRIPTION"
                                value="Description"
                            />
                            <TextArea
                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                defaultValue={
                                    data.COMPANY_STRUCTURE_DESCRIPTION
                                }
                                onChange={(e: any) =>
                                    setData(
                                        "COMPANY_STRUCTURE_DESCRIPTION",
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                    </>
                }
            />
            {/* end modal structure */}

            <ModalToAction
                show={modalStructure.view}
                onClose={() => {
                    setModalStructure({
                        add: false,
                        view: false,
                    });
                }}
                title={detailStructure.COMPANY_STRUCTURE_NAME}
                url={""}
                data={""}
                onSuccess={""}
                method={""}
                headers={""}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[50%]"
                }
                submitButtonName={""}
                body={
                    <>
                        <DetailStructure
                            setIsSuccess={setIsSuccess}
                            setDetailStructure={setDetailStructure}
                            idStructure={detailStructure.COMPANY_STRUCTURE_ID}
                            grade={grade}
                            structureCombo={structureCombo}
                        />
                    </>
                }
            />

            <div className="grid grid-cols-4 gap-4 py-2 xs:grid xs:grid-cols-1 xs:gap-0 lg:grid lg:grid-cols-4 lg:gap-4">
                <div className="flex flex-col">
                    <div className="bg-white mb-4 rounded-md shadow-md p-4">
                        <div
                            className="bg-red-600 w-fit p-2 rounded-md text-white hover:bg-red-500 hover:cursor-pointer"
                            onClick={(e) => handleAddStructure(e)}
                        >
                            <span>Add Structure</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-md shadow-md p-4 max-h-[80rem] h-[100%]">
                        <TextInput
                            id="PERSON_FIRST_NAME"
                            type="text"
                            name="PERSON_FIRST_NAME"
                            value={
                                searchStructure.company_structure[0]
                                    .COMPANY_STRUCTURE_NAME === ""
                                    ? ""
                                    : searchStructure.company_structure[0]
                                          .COMPANY_STRUCTURE_NAME
                            }
                            className="mt-2 ring-1 ring-red-600"
                            onChange={(e) => {
                                inputDataSearch(
                                    "COMPANY_STRUCTURE_NAME",
                                    e.target.value,
                                    0
                                );
                                if (
                                    searchStructure.company_structure[0]
                                        .COMPANY_STRUCTURE_NAME === ""
                                ) {
                                    inputDataSearch("flag", "flag", 0);
                                } else {
                                    inputDataSearch("flag", "", 0);
                                }
                            }}
                            placeholder="Search Employee Name"
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer"
                                onClick={() => {
                                    if (
                                        searchStructure.company_structure[0]
                                            .COMPANY_STRUCTURE_NAME === ""
                                    ) {
                                        inputDataSearch("flag", "", 0);
                                    } else {
                                        inputDataSearch("flag", "", 0);
                                    }
                                    setRefreshGrid("success");
                                    setTimeout(() => {
                                        setRefreshGrid("");
                                    }, 1000);
                                }}
                            >
                                Search
                            </div>
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer"
                                onClick={(e) => clearSearchStructure(e)}
                            >
                                Clear Search
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-3 bg-white shadow-md rounded-md p-5 xs:mt-4 lg:mt-0">
                    <div className="ag-grid-employee rounded-md shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-2.5">
                        <AGGrid
                            addButtonLabel={undefined}
                            addButtonModalState={undefined}
                            withParam={idCompany}
                            searchParam={searchStructure.company_structure}
                            // loading={isLoading.get_policy}
                            url={"getCompanyStructure"}
                            doubleClickEvent={handleClickDetailCompanyStructure}
                            triggeringRefreshData={refreshGrid}
                            colDefs={[
                                {
                                    headerName: "No.",
                                    valueGetter: "node.rowIndex + 1",
                                    flex: 3,
                                },
                                {
                                    headerName: "Company Structure Name",
                                    field: "COMPANY_STRUCTURE_ALIAS",
                                    flex: 7,
                                },
                                {
                                    headerName: "Grade",
                                    field: "GRADE_AKA",
                                    flex: 7,
                                },
                            ]}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
