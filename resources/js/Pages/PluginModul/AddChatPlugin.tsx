import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
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
import Checkbox from "@/Components/Checkbox";
import TextArea from "@/Components/TextArea";
import Swal from "sweetalert2";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import SelectTailwind from "react-tailwindcss-select";
import Input from "@/Components/Input";
import Select from "react-tailwindcss-select";
import DatePicker from "react-datepicker";
import SwitchPage from "@/Components/Switch";

export default function AddChatPlugin({
    modalPlugin,
    setModalPlugin,
    dataPluginProcess,
    setDataPluginProcess,
    handleSuccessPlugin,
}: PropsWithChildren<{
    modalPlugin: any;
    setModalPlugin: any;
    dataPluginProcess: any;
    setDataPluginProcess: any;
    handleSuccessPlugin: any;
}>) {
    // const { data, setData } = useForm<any>({
    //     PERMISSION_NAME: "",
    //     UID_CHAT: "clsf_",
    // });

    const permissionObject = (e: any) => {
        // e.preventDefault();

        const removeSymbol = e.target.value.replace(/[^a-zA-Z0-9\s]/g, "");
        const changeString = removeSymbol.split(" ").join("_").toLowerCase();

        setDataPluginProcess({
            ...dataPluginProcess,
            OBJECT_CHAT: "chat_" + changeString,
        });
        // setDataPluginProcess(
        //     "UID_CHAT",
        //     "chat_" + e.target.value.split(" ").join("_").toLowerCase()
        // );
    };
    return (
        <>
            <ModalToAdd
                buttonAddOns={""}
                show={modalPlugin.add}
                onClose={() =>
                    setModalPlugin({
                        add: false,
                    })
                }
                title={"Add Plugin"}
                url={`/addPluginProcess`}
                data={dataPluginProcess}
                onSuccess={handleSuccessPlugin}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-2xl"
                }
                body={
                    <>
                        <div>
                            <div className="mb-2">
                                <InputLabel
                                    htmlFor="UID_CHAT"
                                    value="Title Chat"
                                    required={true}
                                />
                                <TextInput
                                    type="text"
                                    value={dataPluginProcess.TITLE_CHAT}
                                    className="mt-2"
                                    onChange={(e) =>
                                        setDataPluginProcess({
                                            ...dataPluginProcess,
                                            TITLE_CHAT: e.target.value.replace(
                                                /[^a-zA-Z0-9\s]/g,
                                                ""
                                            ),
                                        })
                                    }
                                    required
                                    onKeyUp={(e) => {
                                        permissionObject(e);
                                    }}
                                    // onChange={(e) => permissionObject(e)}
                                    placeholder="Title Chat"
                                />
                            </div>
                            <div className="mb-2 hidden">
                                <InputLabel
                                    htmlFor="Object_Chat"
                                    value="Object Chat"
                                    required={true}
                                />
                                <TextInput
                                    type="text"
                                    value={dataPluginProcess.OBJECT_CHAT}
                                    className="mt-2 bg-gray-400"
                                    onChange={(e) =>
                                        setDataPluginProcess({
                                            ...dataPluginProcess,
                                            OBJECT_CHAT: e.target.value,
                                        })
                                    }
                                    disabled
                                    readOnly
                                    // onChange={(e) => permissionObject(e)}
                                    placeholder=""
                                />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="Initiate_Your_Chat"
                                    value="Initiate Your Chat"
                                    required={true}
                                />
                                <TextArea
                                    className="mt-2"
                                    defaultValue={
                                        dataPluginProcess.INITIATE_YOUR_CHAT
                                    }
                                    onChange={(e: any) =>
                                        setDataPluginProcess({
                                            ...dataPluginProcess,
                                            INITIATE_YOUR_CHAT: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                        </div>
                    </>
                }
            />
        </>
    );
}
