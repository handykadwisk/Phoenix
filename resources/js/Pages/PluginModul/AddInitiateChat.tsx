import {
    FormEvent,
    PropsWithChildren,
    useEffect,
    useRef,
    useState,
} from "react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import TextArea from "@/Components/TextArea";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import SelectTailwind from "react-tailwindcss-select";
import axios from "axios";
import PrimaryButton from "@/Components/Button/PrimaryButton";

export default function AddInitiateChat({
    setIsSuccessChat,
    getObjectChat,
    setShowAddInitiate,
}: PropsWithChildren<{
    setIsSuccessChat: any;
    getObjectChat: any;
    setShowAddInitiate: any;
}>) {
    useEffect(() => {
        getDataParticipant();
    }, []);
    const [optionsParticipant, setOptionsParticipant] = useState<any>([]);
    const getDataParticipant = async () => {
        await axios
            .post(`/getDataParticipant`)
            .then((res) => {
                setOptionsParticipant(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const dataParticipant = optionsParticipant?.map((query: any) => {
        return {
            value: query.PARTICIPANT_NAME + "+" + query.PARTICIPANT_ID,
            label: query.PARTICIPANT_NAME,
        };
    });

    // state for data plugin chat
    const [dataPluginProcess, setDataPluginProcess] = useState<any>({
        TAG_ID: "",
        PLUGIN_PROCESS_ID: "",
        TITLE_CHAT: "",
        OBJECT_CHAT: "",
        INITIATE_YOUR_CHAT: "",
        PARTICIPANT: null,
    });

    const permissionObject = (e: any) => {
        // e.preventDefault();

        const removeSymbol = e.target.value.replace(/[^a-zA-Z0-9\s]/g, "");
        const changeString = removeSymbol.split(" ").join("_").toLowerCase();

        setDataPluginProcess({
            ...dataPluginProcess,
            OBJECT_CHAT: "chat_" + changeString,
        });
    };

    const action = async (e: any) => {
        const url = "/addPluginProcess";
        // return false;
        e.preventDefault();
        await axios
            .post(url, dataPluginProcess, {
                headers: {
                    "Content-type": "multipart/form-data",
                },
            })
            .then((res) => {
                setIsSuccessChat(res.data[5]);
                getObjectChat();
                setShowAddInitiate({
                    addChat: false,
                });
                setTimeout(() => {
                    setIsSuccessChat("");
                }, 5000);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            <form onSubmit={action}>
                <div className="grid grid-cols-1 p-2 h-auto">
                    <div>
                        <InputLabel
                            className="text-xs"
                            value={"Title Chat"}
                            required={true}
                        />
                        <TextInput
                            type="text"
                            value={dataPluginProcess.TITLE_CHAT}
                            className="mt-1 ring-1 ring-red-600"
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
                    <div className="mt-1">
                        <InputLabel
                            className="text-xs"
                            value={"Participant"}
                            required={false}
                        />
                        <SelectTailwind
                            classNames={{
                                menuButton: () =>
                                    `flex text-sm text-gray-500 mt-2 rounded-md shadow-sm ring-1 ring-red-600 cursor-pointer transition-all duration-300 focus:outline-none bg-white hover:border-red-400`,
                                menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                listItem: ({ isSelected }: any) =>
                                    `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                        isSelected
                                            ? `text-white bg-red-600`
                                            : `text-gray-500 hover:bg-red-100 hover:text-black`
                                    }`,
                            }}
                            options={dataParticipant}
                            isSearchable={true}
                            isMultiple={true}
                            placeholder={"Select to Add Participant"}
                            isClearable={true}
                            value={dataPluginProcess.PARTICIPANT}
                            onChange={(val: any) => {
                                setDataPluginProcess({
                                    ...dataPluginProcess,
                                    PARTICIPANT: val,
                                });
                            }}
                            primaryColor={"bg-red-500"}
                        />
                    </div>
                    <div className="mt-1">
                        <InputLabel
                            className="text-xs"
                            htmlFor="Initiate_Your_Chat"
                            value="Initiate Your Chat"
                            required={true}
                        />
                        <TextArea
                            className="mt-2 ring-1 ring-red-600"
                            defaultValue={dataPluginProcess.INITIATE_YOUR_CHAT}
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
                <PrimaryButton
                    className="bottom-0 right-0 absolute mb-2 mr-2 bg-red-600 p-2 text-white rounded-md cursor-pointer hover:bg-red-500"
                    // disabled={
                    //     isProcessing
                    // }
                >
                    <span>Start Chat</span>
                </PrimaryButton>
                {/* <div className="bottom-0 right-0 absolute mb-2 mr-2 bg-red-600 p-2 text-white rounded-md cursor-pointer hover:bg-red-500">
                    <span>Start Chat</span> */}
                {/* </div> */}
            </form>
        </>
    );
}
