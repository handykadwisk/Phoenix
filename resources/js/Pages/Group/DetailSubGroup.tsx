import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import defaultImage from "../../Images/user/default.jpg";
import BreadcrumbPage from "@/Components/Breadcrumbs/BreadcrumbPage";
import { PageProps } from "@/types";
import {
    FormEvent,
    PropsWithChildren,
    useEffect,
    useRef,
    useState,
} from "react";
import { spawn } from "child_process";
import axios from "axios";
import {
    PencilIcon,
    PencilSquareIcon,
    XMarkIcon,
} from "@heroicons/react/20/solid";
import ModalToAction from "@/Components/Modal/ModalToAction";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import Switch from "@/Components/Switch";
import Checkbox from "@/Components/Checkbox";
import TextArea from "@/Components/TextArea";
import Swal from "sweetalert2";
import PersonPopup from "../Person/Person";
import StructurePopup from "../Structure/Structure";
import Division from "../Division/Division";
import AddressPopup from "../Address/Address";
import JobDesk from "../Job/JobDesk";
import SelectTailwind from "react-tailwindcss-select";
import ModalToAdd from "@/Components/Modal/ModalToAdd";

export default function DetailSubGroup({
    show,
    modal,
    dataDetailGroups,
    handleSuccessEdit,
}: PropsWithChildren<{
    show: any;
    modal: any;
    dataDetailGroups: any;
    handleSuccessEdit: any;
}>) {
    // console.log("xx", dataDetailGroups);
    useEffect(() => {
        setDetailGroups(dataDetailGroups);
    }, [dataDetailGroups]);

    const [dataDetailGroup, setDataDetailGroup] = useState<any>({
        RELATION_GROUP_NAME: "",
        RELATION_GROUP_DESCRIPTION: "",
    });

    const setDetailGroups = async (dataDetailGroupNew: any) => {
        setDataDetailGroup(dataDetailGroupNew);
    };

    return (
        <>
            <ModalToAdd
                show={show}
                buttonAddOns={""}
                onClose={modal}
                title={"Detail Group"}
                url={`/editSubGroup`}
                data={dataDetailGroup}
                onSuccess={handleSuccessEdit}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-2xl"
                }
                body={
                    <>
                        <div className="mb-3">
                            <div className="mt-1">
                                <InputLabel
                                    className="absolute"
                                    htmlFor="RELATION_GROUP_NAME"
                                    value="Name Group"
                                />
                                <div className="ml-[5.8rem] text-red-600">
                                    *
                                </div>
                                <TextInput
                                    type="text"
                                    value={dataDetailGroup.RELATION_GROUP_NAME}
                                    className="mt-0"
                                    onChange={(e) => {
                                        setDataDetailGroup({
                                            ...dataDetailGroup,
                                            RELATION_GROUP_NAME: e.target.value,
                                        });
                                    }}
                                    required
                                />
                            </div>
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="RELATION_GROUP_DESCRIPTION"
                                    value="Group Description"
                                />
                                <TextArea
                                    className="mt-2"
                                    defaultValue={
                                        dataDetailGroup.RELATION_GROUP_DESCRIPTION
                                    }
                                    onChange={(e: any) =>
                                        setDataDetailGroup({
                                            ...dataDetailGroup,
                                            RELATION_GROUP_DESCRIPTION:
                                                e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </>
                }
            />
        </>
    );
}
