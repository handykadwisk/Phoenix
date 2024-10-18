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

export default function AddChatPlugin({
    modalPlugin,
    setModalPlugin,
    dataPluginProcess,
    setDataPluginProcess,
    handleSuccessPlugin,
    optionsParticipant,
}: PropsWithChildren<{
    modalPlugin: any;
    setModalPlugin: any;
    dataPluginProcess: any;
    setDataPluginProcess: any;
    handleSuccessPlugin: any;
    optionsParticipant: any;
}>) {
    // useEffect(() => {
    //     getDataParticipant();
    // }, []);
    const permissionObject = (e: any) => {
        // e.preventDefault();

        const removeSymbol = e.target.value.replace(/[^a-zA-Z0-9\s]/g, "");
        const changeString = removeSymbol.split(" ").join("_").toLowerCase();

        setDataPluginProcess({
            ...dataPluginProcess,
            OBJECT_CHAT: "chat_" + changeString,
        });
    };

    // const [optionsParticipant, setOptionsParticipant] = useState<any>([]);
    // const getDataParticipant = async () => {
    //     await axios
    //         .post(`/getDataParticipant`)
    //         .then((res) => {
    //             setOptionsParticipant(res.data);
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // };

    const dataParticipant = optionsParticipant?.map((query: any) => {
        return {
            value: query.PARTICIPANT_NAME + "+" + query.PARTICIPANT_ID,
            label: query.PARTICIPANT_NAME,
        };
    });
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
                title={"Add Chat"}
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
                            <div className="cursor-pointer">
                                <InputLabel value="Add Participant" />
                                <SelectTailwind
                                    classNames={{
                                        menuButton: () =>
                                            `flex text-sm text-gray-500 mt-2 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
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
                            <div className="mt-4">
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
