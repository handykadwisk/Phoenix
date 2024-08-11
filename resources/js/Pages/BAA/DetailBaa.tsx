import { Head, useForm, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import {
    FormEvent,
    PropsWithChildren,
    useEffect,
    useRef,
    useState,
} from "react";
import Button from "@/Components/Button/Button";
import TableTD from "@/Components/Table/TableTD";
import TableTH from "@/Components/Table/TableTH";
import axios from "axios";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";
import Pagination from "@/Components/Pagination";
import Swal from "sweetalert2";
import ModalToAction from "@/Components/Modal/ModalToAction";
import TextInput from "@/Components/TextInput";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import InputLabel from "@/Components/InputLabel";
import TextArea from "@/Components/TextArea";
import AGGrid from "@/Components/AgGrid";
import { BeatLoader } from "react-spinners";

export default function DetailBaa({
    auth,
    // isSuccessNew,
    // setIsSuccessNew,
    idPerson,
}: PropsWithChildren<{
    auth: any;
    // isSuccessNew: any;
    idPerson: any;
    // setIsSuccessNew: any;
}>) {
    useEffect(() => {
        getRelationByIdPerson(idPerson);
    }, [idPerson]);

    const [detailRelation, setDetailRelation] = useState<any>([]);

    const getRelationByIdPerson = async (idPerson: any) => {
        await axios
            .post(`/getRelationByIdPerson`, { idPerson })
            .then((res: any) => {
                setDetailRelation(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    console.log(detailRelation);
    return (
        <>
            <div>
                <div className="flex">
                    <div className="font-semibold">
                        <span>Relation Name </span>
                    </div>
                    <div className="font-semibold ml-[12px]">
                        <span>: </span>
                    </div>
                    <div className="ml-2 text-gray-500">
                        <span>
                            {detailRelation?.RELATION_ORGANIZATION_NAME}
                        </span>
                    </div>
                </div>
                <div className="flex">
                    <div className="font-semibold">
                        <span>Policy List </span>
                    </div>
                    <div className="font-semibold ml-[53px]">
                        <span>: </span>
                    </div>
                </div>
                {/* grid polic */}
                <div className="mb-28">
                    <AGGrid
                        searchParam={""}
                        addButtonLabel={null}
                        addButtonModalState={undefined}
                        withParam={""}
                        // loading={isLoading.get_policy}
                        url={"getPersonBAA"}
                        doubleClickEvent={undefined}
                        triggeringRefreshData={""}
                        colDefs={[
                            {
                                headerName: "No.",
                                valueGetter: "node.rowIndex + 1",
                                flex: 1,
                            },
                            {
                                headerName: "Policy Name",
                                field: "PERSON_FIRST_NAME",
                                flex: 11,
                            },
                        ]}
                    />
                </div>
            </div>
        </>
    );
}
