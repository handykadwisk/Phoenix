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
import { PencilIcon, PencilSquareIcon } from "@heroicons/react/20/solid";
import ModalToAction from "@/Components/Modal/ModalToAction";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import Switch from "@/Components/Switch";
import Checkbox from "@/Components/Checkbox";
import TextArea from "@/Components/TextArea";
import Swal from "sweetalert2";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import { Datepicker } from "flowbite-react";
import Select from "react-tailwindcss-select";
import { BeatLoader } from "react-spinners";

export default function MenuPlugin({
    top,
    left,
    marginLeft,
    marginTop,
    handleAddPluginProcess,
}: PropsWithChildren<{
    top: any;
    left: any;
    marginLeft: any | null;
    marginTop: any | null;
    handleAddPluginProcess: any;
}>) {
    const menuRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        getRPluginProcess();
    }, []);
    const [dataRPlugin, setDataRPlugin] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<any>({
        get_detail: false,
    });

    const getRPluginProcess = async () => {
        setIsLoading({
            ...isLoading,
            get_detail: true,
        });
        await axios
            .post(`/getRPluginProcess`)
            .then((res) => {
                setDataRPlugin(res.data);
                setIsLoading({
                    ...isLoading,
                    get_detail: false,
                });
                // setDataById(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // modal add t_tag_process
    const [modalPlugin, setModalPlugin] = useState<any>({
        add: false,
    });

    // const handleAddPluginProcess = async (e: FormEvent, idPlug: number) => {
    //     // e.preventDefault();

    //     setModalPlugin({
    //         add: !modalPlugin.add,
    //     });
    //     setDataPluginProcess({
    //         TAG_ID: idDiv.setIdName,
    //         PLUGIN_PROCESS_ID: idPlug,
    //     });

    //     if (modalPlugin.add === false) {
    //         alert("masuk");
    //         setShowContext({
    //             ...showContext,
    //             visible: false,
    //         });
    //     }
    // };

    return (
        <>
            {/* <ModalToAdd
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
                body={<></>}
            /> */}

            <div
                ref={menuRef}
                // className="absolute top-[110px] left-[208px] bg-white p-2 rounded-md shadow-lg z-999 border border-red-600"
                style={{
                    position: "absolute",
                    top: `${top}px`,
                    left: `${left}px`,
                    marginTop: `-${marginTop}px`,
                    marginLeft: `-${marginLeft}px`,
                    width: "300px",
                    backgroundColor: "white",
                    border: "px solid black",
                    borderRadius: "5px",
                    padding: "5px",
                    boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
                    zIndex: 9999999999,
                }}
            >
                {isLoading.get_detail ? (
                    <div className="flex justify-center items-center sweet-loading h-[199px]">
                        <BeatLoader
                            // cssOverride={override}
                            size={10}
                            color={"#ff4242"}
                            loading={true}
                            speedMultiplier={1.5}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                    </div>
                ) : (
                    dataRPlugin?.map((dataPlug: any, i: number) => {
                        return (
                            <div key={i}>
                                <div
                                    className="text-sm hover:cursor-pointer hover:bg-red-400 p-2 rounded-md w-full"
                                    onClick={(e: any) => {
                                        handleAddPluginProcess(
                                            e,
                                            dataPlug.PLUGIN_PROCESS_ID
                                        );
                                    }}
                                >
                                    <span>{dataPlug.PLUGIN_PROCESS_NAME}</span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </>
    );
}
