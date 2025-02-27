import InputLabel from "@/Components/InputLabel";
import ModalToAction from "@/Components/Modal/ModalToAction";
import TextInput from "@/Components/TextInput";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import axios from "axios";
import { set } from "date-fns";
import { useEffect, useState } from "react";
import Select from "react-tailwindcss-select";
import {
    AdjustmentsHorizontalIcon,
    AdjustmentsVerticalIcon,
    ClipboardDocumentCheckIcon,
    ClipboardDocumentIcon,
    PlusCircleIcon
} from "@heroicons/react/20/solid";
import { start } from "node:repl";
import ToastMessage from "@/Components/ToastMessage";
import AGGrid from "@/Components/AgGrid";
import { event } from "jquery";
import Swal from "sweetalert2";
import PrimaryButton from "@/Components/PrimaryButton";
import Alert from "@/Components/Alert";
import { NumberFilter } from "ag-grid-community";
import SequenceEditComponent from "@/Components/sequenceEditComponent";
import ActionModal from "@/Components/Modal/ActionModal";
import Loader from "@/Components/Loader";
// import TreeView from "@/Components/ThreeView";

//Initial Data
const InitialData = {
    workbook_id: 0,
    workbook_name: "",
    cob_id: 0,
    workbookCode: "",
    description: "",
    milestone: [
        {
            milestone_name: "",
            duration_type_id: 0,
            milestone_duration_min: 0,
            milestone_duration_max: 0,
            milestone_duration_description: "",
            milestone_sequence: 0
        }
    ]
}

const InitialMilestone = {
    workbook_id: 0,
    milestone_parent_id: 0,
    milestone_name: "",
    duration_type_id: 0,
    milestone_duration_min: 0,
    milestone_duration_max: 0,
    milestone_duration_description: "",
    milestone_sequence: 0

}

export default function WorkBook({ auth, cob, duration, milestones, workbook }: any) {

    //state search
    const [isError, setIsError] = useState<string>("");

    //loading
    const [loading, setLoading] = useState<boolean>(false)

    //state data
    const [data, setData] = useState<any>(InitialData)

    //state milestone
    const [milestone, setMilestone] = useState<any>(InitialMilestone)

    const milestoneOptions = milestones.map((milestone: any) => {
        return {
            value: milestone.MILESTONE_ID,
            label: milestone.MILESTONE_NAME
        }
    })

    // state modal
    const [modal, setModal] = useState({
        add: false,
        edit: false,
        addMilestone: false,
        detailMilestone: false,
        editMilestone: false,
        editSequence: false,
        copyMilestone: false

    })

    const [workbooks, setWorkbooks] = useState<any[]>([{
        description: "",
        duration_id: 0,
        start_day: 0,
        end_day: 0,
        desc_duration: ""
    }]);


    const [workbookId, setWorkbookId] = useState<any>(null)
    const workbookOptions = workbook.map((workbook: any) => {
        return {
            value: workbook.WORKBOOK_ID,
            label: workbook.WORKBOOK_NAME
        }
    }
    )

    //cob options
    const cobOptions = cob.map((cob: any) => {
        return {
            value: cob.INSURANCE_TYPE_ID,
            label: cob.INSURANCE_TYPE_NAME
        }
    })

    //duration options
    const durationOptions = duration.map((duration: any) => {
        return {
            value: duration.DURATION_ID,
            label: duration.DURATION_NAME
        }
    })

    const [search, setSearch] = useState<any>({
        workbook_search: [
            {
                WORKBOOK_ID: "",
                WORKBOOK_NAME: "",
                flag: "flag"
            },
        ],
    });


    const inputDataSearch = (
        name: string,
        value: string | undefined,
        i: number
    ) => {
        const changeVal: any = [...search.workbook_search];
        changeVal[i][name] = value;
        setSearch({ ...search, workbook_search: changeVal });
    };

    const handleInputChangeMilestone = (index: number, field: string) => (event: any) => {
        const value = event && event.target ? event.target.value : event;
        const updatedWorkbooks = [...workbooks];
        updatedWorkbooks[index] = {
            ...updatedWorkbooks[index],
            [field]: Array.isArray(value) ? value.map((item: any) => item.value) : value
        };
        setWorkbooks(updatedWorkbooks);
    };

    //handle success
    const [isSuccess, setIsSuccess] = useState<any>("");
    const handleSuccessAddWorkbook = (message: any) => {
        const workbookId = message.workbook_id;

        setIsSuccess('')
        if (message !== '') {
            setIsSuccess(message[0])
            setTimeout(() => {
                setIsSuccess('')
            }, 5000)
            handleDetail(workbookId);
        }
    }

    const handleSuccess = (response: any) => {

        setIsSuccess('');

        if (response[0]) {
            setIsSuccess(response[0]);
            setTimeout(() => {
                setIsSuccess('');
            }, 5000);
        }
        // setModal({ ...modal, addMilestone: false });
    };

    //handle detail
    const [detail, setDetail] = useState<any>({})
    const handleDetail = async (data: any) => {
        const id = data.WORKBOOK_ID || data;
        setLoading(true)
        // console.log(id, '<<<<');

        try {
            const res = await axios.get(`/workbookId/${id}`)
            setDetail(res.data)

            setData({
                ...data,
                workbook_name: res.data.WORKBOOK_NAME,
                cob_id: res.data.COB_ID,
                description: res.data.WORKBOOK_DESCRIPTION,
                milestone: res.data.milestone,
                workbook_id: res.data.WORKBOOK_ID,
                workbookCode: res.data.WORKBOOK_CODE

            })
            setModal({ ...modal, edit: true, add: false, addMilestone: false, editMilestone: false, copyMilestone: false, editSequence: false })
            setMilestone({ ...milestone, workbook_id: id })
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    }


    const handleSuccessAddMilestone = (response: any) => {
        setIsSuccess('');
        if (response[0]) {
            setIsSuccess(response[0]);
            setTimeout(() => {
                setIsSuccess('');
            }, 5000);
        }
        handleDetail(data?.WORKBOOK_ID || milestone?.workbook_id); // Refresh data
    };

    const handleEditSequence = () => {
        Swal.fire({
            title: 'Set Milestone Sequence?',
            text: "Are you sure you want to set the milestone sequence?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Set it!'
        }).then((result) => {
            if (result.isConfirmed) {
                setModal({ ...modal, copyMilestone: false, editSequence: true });
            }

        });
    };


    const handleSuccessCopyMilestone = (response: any) => {
        setIsSuccess('');
        if (response[0]) {
            setIsSuccess(response[0]);
            setTimeout(() => {
                setIsSuccess('');
            }, 5000);
        }
        handleDetail(data?.WORKBOOK_ID || milestone?.workbook_id); // Refresh data


    };

    // handleMilestoneId
    const [milestoneId, setMilestoneId] = useState<any>([])
    const handleMilestoneId = async (data: any) => {
        const id = data.MILESTONE_ID || data;
        try {
            const res = await axios.get(`/getMilestoneById/${id}`)
            const data = res.data
            setMilestoneId([...milestoneId, data])
            setModal({ ...modal, detailMilestone: true })
        } catch (error) {
            console.log(error);
        }
    }

    //handleSave
    const handleSave = async (e: any) => {
        e.preventDefault();
        setLoading(true)
        try {
            const res = await axios.post(`/editWorkbook/${data.WORKBOOK_ID || data.workbook_id}`, data)
            if (res.status === 200) {
                handleSuccess(res.data)
            } else {
                throw new Error('Unexpected response status');
            }
        } catch (error: any) {
            console.log(error.response.data[0]);

            console.log(error.response.data[0], 'ini erornya');
            setIsError(error.response.data)
        } finally {
            setLoading(false)
        }
        handleDetail(data.WORKBOOK_ID)
    }

    setTimeout(() => {
        setIsError('')
    }, 5000)

    //editMilestone
    const handleEditMilestone = async (data: any) => {
        const id = data.MILESTONE_ID || data;
        try {
            const res = await axios.get(`/getMilestoneById/${id}`)
            const data = res.data
            setMilestone(data)
            setModal({ ...modal, editMilestone: true })
        } catch (error) {
            console.log(error);
        }
    }

    //handleDeleted
    const handleDeleted = async (e: any, d: any) => {
        e.preventDefault();
        const status = d.MILESTONE_IS_DELETED === 1 ? 'Active' : 'Delete';
        Swal.fire({
            title: 'Are you sure?',
            text: `You are about to ${status} this milestone!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes, ${status} it!`
        }).then(async (result) => {
            if (result.isConfirmed) {
                const id = d.MILESTONE_ID || d;
                try {
                    const res = await axios.post(`/deleteMilestone/${id}`)
                    if (res.status === 200) {
                        Swal.fire(
                            'Success!',
                            `Milestone has been ${status}d.`,
                            'success'
                        );
                        handleDetail(data.workbook_id)
                    } else {
                        throw new Error('Unexpected response status');
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        })
    }

    //threeview
    interface Milestone {
        MILESTONE_ID: number;
        MILESTONE_NAME: string;
        MILESTONE_PARENT_ID?: number | null;
        children?: Milestone[];
        CREATED_DATE: string;
        MILESTONE_DURATION_MIN: number;
        MILESTONE_DURATION_MAX: number;
        MILESTONE_DURATION_DESCRIPTION: string;
        MILESTONE_IS_DELETED: number
        MILESTONE_SEQUENCE: number
    }

    interface Props {
        milestones: Milestone[];
        showButtons?: boolean;
    }

    const TreeView: React.FC<Props> = ({ milestones, showButtons }) => {
        const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
        const handleSelect = (milestone: Milestone) => {
            setSelectedMilestone((prev) =>
                prev?.MILESTONE_ID === milestone.MILESTONE_ID ? null : milestone
            );
        };
        // Fungsi untuk mendapatkan sequence dari parent
        const findParentSequence = (milestone: Milestone, allMilestones: Milestone[]): any => {
            if (!milestone?.MILESTONE_PARENT_ID) return milestone?.MILESTONE_SEQUENCE;
            const parent = allMilestones.find(m => m?.MILESTONE_ID === milestone?.MILESTONE_PARENT_ID);
            return parent ? `${findParentSequence(parent, allMilestones)}.${milestone?.MILESTONE_SEQUENCE}` : milestone?.MILESTONE_SEQUENCE;
        };
        const renderTree = (nodes: Milestone[]) => {
            return (
                <>
                    {
                        <>
                            <ul className='mt-1' >
                                {nodes.map((node, index) => (
                                    <li key={index} className="relative pl-4 mb-2">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`min-w-3 min-h-3 rounded-full ${node?.MILESTONE_PARENT_ID === null ||
                                                    (node?.children && node?.children.length > 0)
                                                    ? `bg-red-500`
                                                    : `bg-green-500`
                                                    }`}
                                            ></div>
                                            {/* Menampilkan sequence dengan format yang benar */}
                                            <div className="text-sm font-bold">
                                                {findParentSequence(node, milestones)}
                                            </div>

                                            <span
                                                className={`ml-1 cursor-pointer ${selectedMilestone?.MILESTONE_ID === node?.MILESTONE_ID
                                                    ? "text-blue-600"
                                                    : node?.MILESTONE_IS_DELETED === 1
                                                        ? "text-red-600 hover:text-blue-600"
                                                        : "hover:text-red-400 "
                                                    // : "hover:text-red-400 hover:border hover: px-2  hover:border-red-300 hover:rounded-lg "
                                                    }`}
                                                onClick={() => {
                                                    showButtons && handleSelect(node)
                                                }}
                                            >
                                                {node?.MILESTONE_NAME} {node?.MILESTONE_IS_DELETED === 1 && "(deleted)"}
                                            </span>
                                            {
                                                node?.MILESTONE_PARENT_ID === null &&
                                                <>
                                                    {/* Render duration */}
                                                    <div className=" flex gap-4 text-gray-500 text-sm">
                                                        <span>/</span>
                                                        {node?.MILESTONE_DURATION_MIN && node?.MILESTONE_DURATION_MAX
                                                            ? `${node?.MILESTONE_DURATION_MIN} to ${node?.MILESTONE_DURATION_MAX}  ${node?.MILESTONE_DURATION_DESCRIPTION}`
                                                            : `${node?.MILESTONE_DURATION_MAX}  ${node?.MILESTONE_DURATION_DESCRIPTION}`}
                                                    </div>
                                                </>
                                            }
                                        </div>

                                        {/* Render tombol jika item dipilih */}
                                        {(selectedMilestone?.MILESTONE_ID === node?.MILESTONE_ID) && (
                                            <div className="flex gap-2 mt-2 ml-6">
                                                <button className="bg-blue-500 hover:bg-blue-400 text-white px-2 py-1 rounded-md text-sm" onClick={() => {
                                                    setModal({ ...modal, addMilestone: true })
                                                    setMilestone({ ...milestone, milestone_parent_id: node.MILESTONE_ID })
                                                }
                                                }>
                                                    Add Sub
                                                </button>
                                                <button className="bg-orange-400 hover:bg-orange-500 text-white px-2 py-1 rounded-md text-sm"
                                                    onClick={
                                                        () => {
                                                            handleEditMilestone(node)
                                                        }
                                                    }>
                                                    Edit
                                                </button>
                                                <button className="bg-yellow-400 hover:bg-yellow-300 text-white px-2 py-1 rounded-md text-sm"
                                                    onClick={() => handleMilestoneId(node)}>
                                                    Detail
                                                </button>
                                                <button className={`${node?.MILESTONE_IS_DELETED === 1 ? "bg-green-400 hover:bg-green-500" : "bg-red-500 hover:bg-red-600"} text-white px-2 py-1 rounded-md text-sm`}
                                                    onClick={(e) => {
                                                        handleDeleted(e, node)
                                                    }
                                                    }>
                                                    {node?.MILESTONE_IS_DELETED === 1 ? "Active" : "Delete"}
                                                </button>
                                            </div>
                                        )}

                                        {/* Render anak jika ada */}
                                        {node?.children && node?.children.length > 0 && renderTree(node?.children)}
                                    </li>
                                ))}
                            </ul>
                        </>
                    }
                </>
            );
        };

        return (
            <>
                {

                    milestones.length === 0 ?
                        <div className="text-center text-red-500">No Milestone Added</div>
                        : <div className=" bg-white border rounded-md overflow-x-auto  max-h-96 round</div>ed-md">{renderTree(milestones)}</div>
                }

            </>
        )


    };

    const [seqMenu, setSeqMenu] = useState<any>([]);

    const handleItemsChange = (updatedItems: any) => {
        setSeqMenu(updatedItems);
    };

    return (
        <Authenticated user={auth.user} header="Workbook Management">

            <Head title="Workbook" />

            {/* Toast Message */}
            {isSuccess && (
                <ToastMessage
                    message={isSuccess}
                    isShow={true}
                    type={"success"}
                />
            )}
            {isError && (
                <ToastMessage
                    message={isError}
                    isShow={true}
                    type={"error"}
                />
            )}

            <ActionModal
                headers={"Workbook"}
                title="Add Workbook"
                show={modal.add}
                onClose={() => {
                    setModal({ ...modal, add: false })
                    setData(InitialData)
                }}
                method="post"
                url="/storeWorkbook"
                onSuccess={handleSuccessAddWorkbook}
                data={data}
                submitButtonName={'Create & Add Milestone'}
                // classPanel={
                //     "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-1xl"
                // }
                // classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 lg:w-3/4 w-5/4`}
                classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 lg:w-3/4 w-full mx-5`}

                body={
                    <>
                        <div className="mt-2">
                            <InputLabel
                                className="absolute"
                                htmlFor="workbook_name_1"
                                value="Name"
                            />
                            <div className="ml-[3rem] text-red-600">*</div>
                            <TextInput
                                name="workbook_name_1"
                                type="text"
                                className="w-full mt-2"
                                placeholder="Enter Work Book Name"
                                onChange={(e: any) => { setData({ ...data, workbook_name: e.target.value }) }}
                            />
                        </div>
                        <div className="mt-2">
                            <InputLabel
                                className="absolute"
                                htmlFor="Class Of Bussiness"
                                value="Class Of Bussiness"
                            />
                            <div className="ml-[8.6rem] text-red-600">*</div>
                            <Select
                                classNames={{
                                    menuButton: () =>
                                        `flex text-sm text-gray-500 mt-2 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                    menu: "text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                    listItem: ({ isSelected }: any) =>
                                        `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${isSelected
                                            ? `text-white bg-red-500`
                                            : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
                                        }`,
                                }}
                                primaryColor="red"
                                options={cobOptions}
                                isSearchable={true}
                                placeholder="Select Class Of Bussiness"
                                value={
                                    cobOptions.find((el: { value: any }) => el.value === data.cob_id) || null
                                }
                                onChange={
                                    (e: any) => {
                                        const id = e ? e.value : null;
                                        setData({ ...data, cob_id: id });
                                    }
                                }
                            // isMultiple={true}
                            />
                        </div>
                        <div className="mt-2">
                            <InputLabel
                                className=""
                                htmlFor="workbook_name_1"
                                value="Description"
                            />
                            {/* <div className="ml-[5.5rem] text-red-600">*</div> */}
                            <TextInput
                                name="workbook_name_1"
                                type="text"
                                className="w-full mt-2"
                                placeholder="Enter Work Book Description (Optional)"
                                onChange={(e: any) => { setData({ ...data, description: e.target.value }) }}
                            />
                        </div>
                    </>
                }
            />

            {
                loading ? (<Loader />) : (
                    // Modal Edit Workbook
                    <ActionModal
                        cancelButtonName={'Close'}
                        headers={"Workbook"}
                        title="Setup Workbook"
                        show={modal.edit}
                        onClose={() => {
                            setModal({ ...modal, edit: false })
                            setData(InitialData)
                            setMilestone(InitialMilestone)
                        }}
                        method="post"
                        url={`/editWorkbook/${data.WORKBOOK_ID}`}
                        onSuccess={'handleSuccess'}
                        data={data}
                        submitButtonName={''}
                        // classPanel={
                        //     "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-1xl"
                        // }
                        // classPanel={
                        //     "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-1xl"
                        // }
                        classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 lg:w-3/4 w-5/4 mx-5`}
                        body={
                            <>
                                <div className="w-full block lg:flex gap-2 text-lg">
                                    {isError && (
                                        <Alert body={isError} />
                                    )}
                                    {/* workbook name */}
                                    <div className="w-full mt-2 lg:w-1/2">
                                        <InputLabel
                                            className="absolute"
                                            htmlFor="workbook_name_1"
                                            value="Name"
                                        />
                                        <div className="ml-[3rem] text-red-600">*</div>
                                        <TextInput
                                            autoComplete="off"
                                            name="workbook_name_1"
                                            type="text"
                                            className="w-full mt-2"
                                            placeholder="Enter Work Book Name"
                                            value={data.workbook_name}
                                            onChange={(e: any) => { setData({ ...data, workbook_name: e.target.value }) }}
                                        />
                                    </div>
                                    {/* cob */}
                                    <div className="w-full mt-2 lg:w-1/2">
                                        <InputLabel
                                            className="absolute"
                                            htmlFor="Class Of Bussiness"
                                            value="Class Of Bussiness"
                                        />
                                        <div className="ml-[8.6rem] text-red-600">*</div>
                                        <Select
                                            classNames={{
                                                menuButton: () =>
                                                    `flex text-sm text-gray-500 mt-2 rounded-md shadow-md transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                listItem: ({ isSelected }: any) =>
                                                    ` block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${isSelected
                                                        ? `text-white bg-red-500`
                                                        : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
                                                    }`,
                                            }}
                                            primaryColor="red"
                                            options={cobOptions}
                                            isSearchable={true}
                                            placeholder="Select Class Of Bussiness"
                                            value={
                                                cobOptions.find((el: { value: any }) => el.value === data.cob_id) || null
                                            }
                                            onChange={
                                                (e: any) => {
                                                    const id = e ? e.value : null;
                                                    setData({ ...data, cob_id: id });
                                                }
                                            }
                                        // isMultiple={true}
                                        />
                                    </div>
                                    {/* workbook code */}
                                    <div className="w-full mt-2 lg:w-1/2">
                                        <InputLabel
                                            className="relative"
                                            htmlFor="workbook_code"
                                            value="Workbook Code"
                                        />
                                        <TextInput
                                            disabled
                                            name="workbook_code"
                                            type="text"
                                            className="w-full mt-3"
                                            placeholder="Workbook Code"
                                            value={data.workbookCode}
                                        // onChange={(e: any) => { setData({ ...data, workbookCode: e.target.value }) }}
                                        />
                                    </div>

                                </div>
                                {/* workbook desc */}
                                <div className="mt-2">
                                    <InputLabel
                                        className=""
                                        htmlFor="workbook_description"
                                        value="Description"
                                    />
                                    <TextInput
                                        autoComplete="off"
                                        name="workbook_description"
                                        type="text"
                                        className="w-full mt-2"
                                        placeholder="Enter Work Book Description"
                                        value={data.description}
                                        onChange={(e: any) => { setData({ ...data, description: e.target.value }) }}
                                    />
                                </div>
                                <div className="mt-2 flex justify-end">
                                    <PrimaryButton
                                        title="Save"
                                        children="Save"
                                        className="bg-red-500 text-white hover:bg-red-600"
                                        onClick={
                                            (e: any) => {
                                                handleSave(e)
                                            }
                                        }
                                    />
                                </div>
                                <div className="mt-1 border-b"></div>


                                {/* modal add milestone */}
                                <ActionModal
                                    headers={"Milestone"}
                                    title={`Add Milestone ${data?.workbook_name}`}
                                    show={modal.addMilestone}
                                    onClose={() => {
                                        // handleDetail(data?.WORKBOOK_ID || milestone?.workbook_id)
                                        setModal({ ...modal, addMilestone: false })
                                        setMilestone({
                                            ...milestone,
                                            milestone_name: "",
                                            duration_type_id: 0,
                                            milestone_parent_id: 0,
                                            milestone_duration_min: 0,
                                            milestone_duration_max: 0,
                                            milestone_duration_description: ""
                                        })
                                    }}
                                    method="post"
                                    url="/addMilestone"
                                    onSuccess={handleSuccessAddMilestone}
                                    data={milestone}
                                    submitButtonName={'Submit'}
                                    // classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 lg:w-3/4 w-5/4`}
                                    classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 lg:w-2/3 w-3/4`}

                                    body={
                                        <>
                                            {/* milestone name */}
                                            <div className="w-full">
                                                <InputLabel
                                                    className="absolute"
                                                    htmlFor="milestone_name"
                                                    value="Milestone Name"
                                                />
                                                <div className="ml-[7.4rem] text-red-600">*</div>
                                                <TextInput
                                                    name="milestone_name"
                                                    type="text"
                                                    className="w-full mt-2"
                                                    placeholder="Enter Milestone Name"
                                                    onChange={(e: any) => { setMilestone({ ...milestone, milestone_name: e.target.value }) }}
                                                />
                                            </div>
                                            <div className="block lg:flex justify-between gap-4 mt-2">
                                                {
                                                    milestone?.milestone_parent_id === 0 &&
                                                    <>
                                                        {/* milestone duration */}
                                                        <div className="w-full lg:w-1/4 mt-2">
                                                            <InputLabel
                                                                className="absolute"
                                                                htmlFor="milestone_duration"
                                                                value="Duration"
                                                            />
                                                            <div className="ml-[4rem] text-red-600">*</div>
                                                            <Select
                                                                classNames={{
                                                                    menuButton: () =>
                                                                        ` mb-2 flex text-sm text-gray-500 mt-2 rounded-md shadow-md transition-all duration-300 focus:outline-none bg-white hover:border-gray-400 w-full`,
                                                                    menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                                    listItem: ({ isSelected }: any) =>
                                                                        `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded  ${isSelected
                                                                            ? `text-white bg-red-500`
                                                                            : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
                                                                        }`,
                                                                }}
                                                                primaryColor="red"
                                                                options={durationOptions}
                                                                isSearchable={true}
                                                                placeholder="Select Duration"
                                                                value={durationOptions.find((el: { value: any }) => el?.value === milestone?.duration_type_id) || null}
                                                                onChange={(e: any) => {
                                                                    const id = e ? e.value : [];
                                                                    setMilestone({ ...milestone, duration_type_id: id });
                                                                }}
                                                            />
                                                        </div>


                                                        {/* if milestone.duration_id === 1 */}
                                                        {
                                                            milestone.duration_type_id === 1 &&
                                                            <>
                                                                <div className="w-full lg:w-1/4 mt-2">
                                                                    <InputLabel
                                                                        className=""
                                                                        htmlFor="milestone_duration_min"
                                                                        value="Day"
                                                                    />
                                                                    <TextInput
                                                                        name="milestone_duration_min"
                                                                        type="number"
                                                                        className="w-1/2 mt-2"
                                                                        placeholder="Day"
                                                                        onChange={(e: any) => { setMilestone({ ...milestone, milestone_duration_max: parseInt(e.target.value) }) }}
                                                                    />

                                                                </div>

                                                                {/* milestone description */}
                                                                <div className="w-full mb-2 mt-2">
                                                                    <InputLabel
                                                                        className=""
                                                                        htmlFor="milestone_name"
                                                                        value="Duration Description"
                                                                    />
                                                                    <TextInput
                                                                        name="milestone_name"
                                                                        type="text"
                                                                        className="w-full mt-2"
                                                                        placeholder="Enter Duration Description"
                                                                        onChange={(e: any) => { setMilestone({ ...milestone, milestone_duration_description: e.target.value }) }}
                                                                    />
                                                                </div>
                                                            </>
                                                        }

                                                        {/* if milestone.duration_id === 2 */}
                                                        {
                                                            milestone?.duration_type_id === 2 &&
                                                            <>
                                                                <div className=" w-full flex gap-2 justify-between">

                                                                    <div className="w-full mt-2">
                                                                        <InputLabel
                                                                            className=""
                                                                            htmlFor="milestone_duration_min"
                                                                            value="Day min"
                                                                        />
                                                                        <TextInput
                                                                            name="milestone_duration_min"
                                                                            type="number"
                                                                            className="w-full mt-2"
                                                                            placeholder="Day"
                                                                            onChange={(e: any) => { setMilestone({ ...milestone, milestone_duration_min: parseInt(e.target.value) }) }}
                                                                        />
                                                                    </div>
                                                                    <div className=" flex items-center mt-10 lg:mt-8 ">To</div>
                                                                    <div className="w-full mt-2">
                                                                        <InputLabel
                                                                            className=""
                                                                            htmlFor="milestone_duration_max"
                                                                            value="Day max"
                                                                        />
                                                                        <TextInput
                                                                            name="milestone_duration_max"
                                                                            type="number"
                                                                            className="w-full mt-2"
                                                                            placeholder=" Day"
                                                                            onChange={(e: any) => { setMilestone({ ...milestone, milestone_duration_max: parseInt(e.target.value) }) }}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                {/* milestone description */}
                                                                <div className="w-full mb-2 mt-2">
                                                                    <InputLabel
                                                                        className=""
                                                                        htmlFor="milestone_name"
                                                                        value="Duration Description"
                                                                    />
                                                                    <TextInput
                                                                        name="milestone_name"
                                                                        type="text"
                                                                        className="w-full mt-2"
                                                                        placeholder="Enter Duration Description"
                                                                        onChange={(e: any) => { setMilestone({ ...milestone, milestone_duration_description: e.target.value }) }}
                                                                    />
                                                                </div>
                                                            </>
                                                        }
                                                    </>

                                                }
                                            </div>
                                        </>

                                    }
                                />
                                {/* end modal add milestone */}
                                <div className="flex gap-5 ml-10 mb-4 mt-2">
                                    <span className="flex gap-2 text-gray-500 text-sm italic hover:text-red-400 cursor-pointer"
                                        onClick={() => {
                                            setModal({ ...modal, addMilestone: true })
                                            setMilestone({ ...milestone, milestone_parent_id: 0 })
                                        }} >
                                        <PlusCircleIcon className="w-5 h-5"
                                            title="Add Milestone"
                                        />
                                        Add Milestone
                                    </span>
                                    <div className="flex gap-2 text-gray-500 text-sm italic hover:text-red-400 cursor-pointer"
                                        onClick={() => {
                                            setModal({ ...modal, copyMilestone: true })
                                            // setMilestone({ ...milestone, milestone_parent_id: 0 })
                                        }}>
                                        <ClipboardDocumentIcon className="w-5 h-5"
                                            title="Add Milestone"
                                        />
                                        <span>Copy Milestone From Other Workbook</span>
                                    </div>
                                    <div className="flex gap-2 text-gray-500 text-sm italic hover:text-red-400 cursor-pointer"
                                        onClick={() => {
                                            setModal({ ...modal, editSequence: true })
                                            // setMilestone({ ...milestone, milestone_parent_id: 0 })
                                        }}>
                                        <AdjustmentsVerticalIcon className="w-5 h-5"
                                            title="Add Milestone"
                                        />
                                        <span>Set Milestone Sequence</span>
                                    </div>
                                </div>

                                {/* TreeViwe Milestone */}
                                <TreeView milestones={data?.milestone} showButtons={true} />
                                {/* end TreeViwe Milestone */}

                                {/* modal edit seqeunce */}
                                <ActionModal
                                    headers={"Milestone"}
                                    title="Set Sequence Milestone"
                                    show={modal.editSequence}
                                    onClose={() => {
                                        setModal({ ...modal, editSequence: false })
                                        setMilestone(InitialMilestone)
                                        handleDetail(data?.WORKBOOK_ID || milestone?.workbook_id)
                                    }}
                                    method="post"
                                    url="/updateSequence"
                                    onSuccess={handleSuccess}
                                    data={seqMenu}
                                    submitButtonName={'Save'}
                                    // classPanel={
                                    //     "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full lg:w-3/4"
                                    // }
                                    classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 lg:w-full w-full overflow-y-auto`}

                                    body={
                                        <>
                                            <div className="max-h-full">
                                                <SequenceEditComponent
                                                    initialItems={data?.milestone}
                                                    onItemsChange={handleItemsChange}
                                                />
                                            </div>
                                        </>
                                    }
                                />
                                {/* end modal edit seqeunce */}

                                {/* Detail Milestone */}
                                <ActionModal
                                    headers={"Milestone"}
                                    title="Detail Milestone"
                                    show={modal.detailMilestone}
                                    onClose={() => {
                                        setModal({ ...modal, detailMilestone: false })
                                        setMilestoneId([])
                                    }}
                                    method=""
                                    url=""
                                    onSuccess={''}
                                    data={milestone}
                                    submitButtonName={''}
                                    // classPanel={
                                    //     "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full lg:w-3/4"
                                    // }
                                    classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 lg:w-3/4 w-full`}

                                    body={
                                        <>
                                            <div className="mx-auto mt-2 overflow-y-auto">
                                                <TreeView milestones={milestoneId} />
                                            </div>
                                        </>
                                    }
                                />
                                {/*end Detail Milestone */}



                                {/* Edit Miilestone */}
                                <ActionModal
                                    headers={"Milestone"}
                                    title="Edit Milestone"
                                    show={modal.editMilestone}
                                    onClose={() => {
                                        setMilestone(InitialMilestone)
                                        setModal({ ...modal, editMilestone: false })
                                        handleDetail(milestone.WORKBOOK_ID)
                                    }}
                                    method="post"
                                    url="editMilestone"
                                    onSuccess={handleSuccess}
                                    data={milestone}
                                    submitButtonName={'Save'}
                                    // classPanel={
                                    //     "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full lg:w-3/4"
                                    // }
                                    classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 lg:w-3/4 w-full`}
                                    body={
                                        <>
                                            {/* milestone name */}
                                            <div className="w-full">
                                                <InputLabel
                                                    className="absolute"
                                                    htmlFor="milestone_name"
                                                    value="Milestone Name"
                                                />
                                                <div className="ml-[7.4rem] text-red-600">*</div>
                                                <TextInput
                                                    name="milestone_name"
                                                    type="text"
                                                    className="w-full mt-2"
                                                    placeholder="Enter Milestone Name"
                                                    value={milestone?.MILESTONE_NAME}
                                                    onChange={(e: any) => { setMilestone({ ...milestone, MILESTONE_NAME: e.target.value }) }}
                                                />
                                            </div>
                                            <div className="flex justify-between gap-4 mt-2">
                                                {
                                                    (milestone?.MILESTONE_PARENT_ID === 0 || milestone?.MILESTONE_PARENT_ID === null) &&
                                                    <>
                                                        {/* milestone duration */}
                                                        <div className="w-full lg:w-1/4 mt-2">
                                                            <InputLabel
                                                                className="absolute"
                                                                htmlFor="milestone_duration"
                                                                value="Duration"
                                                            />
                                                            <div className="ml-[4rem] text-red-600">*</div>
                                                            <Select
                                                                classNames={{
                                                                    menuButton: () =>
                                                                        `mb-2 flex text-sm text-gray-500 mt-2 rounded-md shadow-md transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                                    menu: "text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                                    listItem: ({ isSelected }: any) =>
                                                                        `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${isSelected
                                                                            ? `text-white bg-red-500`
                                                                            : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
                                                                        }`,
                                                                }}
                                                                primaryColor="red"
                                                                options={durationOptions}
                                                                isSearchable={true}
                                                                placeholder="Select Duration"
                                                                value={durationOptions.find((el: { value: any }) => el.value === (milestone?.duration_type_id || milestone?.DURATION_TYPE_ID)) || null}
                                                                onChange={(e: any) => {
                                                                    const id = e ? e.value : [];
                                                                    setMilestone({ ...milestone, duration_type_id: id });
                                                                }}
                                                            />
                                                        </div>


                                                        {/* if milestone.duration_id === 1 */}
                                                        {
                                                            (milestone?.duration_type_id || milestone?.DURATION_TYPE_ID) === 1 &&
                                                            <>
                                                                <div className="w-1/4 mt-2">
                                                                    <InputLabel
                                                                        className=""
                                                                        htmlFor="milestone_duration_min"
                                                                        value="Day"
                                                                    />
                                                                    <TextInput
                                                                        name="milestone_duration_min"
                                                                        type="number"
                                                                        className="w-1/2 mt-2"
                                                                        placeholder="Day"
                                                                        value={milestone?.MILESTONE_DURATION_MAX}
                                                                        onChange={(e: any) => { setMilestone({ ...milestone, MILESTONE_DURATION_MAX: parseInt(e.target.value) }) }}
                                                                    />

                                                                </div>
                                                                {/* <div className="flex items-center "><span className="">Day</span>
                                                </div> */}
                                                                {/* milestone description */}
                                                                <div className="w-full mb-2 mt-2">
                                                                    <InputLabel
                                                                        className=""
                                                                        htmlFor="milestone_name"
                                                                        value="Duration Description"
                                                                    />
                                                                    <TextInput
                                                                        name="milestone_name"
                                                                        type="text"
                                                                        className="w-full mt-2"
                                                                        placeholder="Enter Duration Description"
                                                                        value={milestone?.MILESTONE_DURATION_DESCRIPTION
                                                                        }
                                                                        onChange={(e: any) => {
                                                                            setMilestone({
                                                                                ...milestone, MILESTONE_DURATION_DESCRIPTION
                                                                                    : e.target.value
                                                                            })
                                                                        }}
                                                                    />
                                                                </div>
                                                            </>
                                                        }

                                                        {/* if milestone.duration_id === 2 */}
                                                        {
                                                            (milestone?.duration_type_id || milestone?.DURATION_TYPE_ID) === 2 &&
                                                            <>
                                                                <div className="w-1/4 mt-2">
                                                                    <InputLabel
                                                                        className=""
                                                                        htmlFor="milestone_duration_min"
                                                                        value="Day min"
                                                                    />
                                                                    <TextInput
                                                                        name="milestone_duration_min"
                                                                        type="number"
                                                                        className="w-full mt-2"
                                                                        placeholder="Day"
                                                                        value={milestone?.MILESTONE_DURATION_MIN}
                                                                        onChange={(e: any) => { setMilestone({ ...milestone, MILESTONE_DURATION_MIN: parseInt(e.target.value) }) }}
                                                                    />
                                                                </div>
                                                                <div className="mt-2 block lg:mt-4 lg:flex items-center "><span className="lg:mt-2">To</span>
                                                                </div>
                                                                <div className="w-1/4 mt-2">
                                                                    <InputLabel
                                                                        className=""
                                                                        htmlFor="milestone_duration_max"
                                                                        value="Day max"
                                                                    />
                                                                    <TextInput
                                                                        name="milestone_duration_max"
                                                                        type="number"
                                                                        className="w-full mt-2"
                                                                        placeholder=" Day"
                                                                        value={milestone?.MILESTONE_DURATION_MAX}
                                                                        onChange={(e: any) => { setMilestone({ ...milestone, MILESTONE_DURATION_MAX: parseInt(e.target.value) }) }}
                                                                    />
                                                                </div>
                                                                {/* milestone description */}
                                                                <div className="w-full mb-2 mt-2">
                                                                    <InputLabel
                                                                        className=""
                                                                        htmlFor="milestone_name"
                                                                        value="Duration Description"
                                                                    />
                                                                    <TextInput
                                                                        name="milestone_name"
                                                                        type="text"
                                                                        className="w-full mt-2"
                                                                        placeholder="Enter Duration Description"
                                                                        value={milestone?.MILESTONE_DURATION_DESCRIPTION}
                                                                        onChange={(e: any) => { setMilestone({ ...milestone, MILESTONE_DURATION_DESCRIPTION: e.target.value }) }}
                                                                    />
                                                                </div>
                                                            </>
                                                        }
                                                    </>

                                                }
                                            </div>
                                        </>
                                    }
                                />
                                {/* end edit */}

                                {/* modal copy milestone */}
                                <ActionModal
                                    title="Copy Milestone from Workbook"
                                    headers={"Milestone"}
                                    show={modal.copyMilestone}
                                    onClose={() => {
                                        setModal({ ...modal, copyMilestone: false })
                                        setWorkbookId(null)
                                        handleEditSequence()

                                    }}
                                    method="post"
                                    url={`/copyWorkbookMilestone/${data.WORKBOOK_ID || data.workbook_id}`}
                                    onSuccess={handleSuccessCopyMilestone}
                                    data={{ workbook_id: workbookId }}
                                    submitButtonName={'Copy'}
                                    classPanel={`relative transform overflow-hidden rounded-lg bg-red-900 text-left shadow-xl transition-all sm:my-12 lg:w-1/2 w-full`}
                                    body={
                                        <>
                                            {
                                                workbook && workbook.length > 0 && (
                                                    <div className="mt-2">
                                                        <Select
                                                            classNames={{
                                                                menuButton: () =>
                                                                    `mb-2 flex text-sm text-gray-500 mt-2 rounded-md shadow-md transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                                menu: "text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                                listItem: ({ isSelected }: any) =>
                                                                    `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${isSelected
                                                                        ? `text-white bg-red-500`
                                                                        : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
                                                                    }`,
                                                            }}
                                                            primaryColor="red"
                                                            options={workbookOptions}
                                                            isSearchable={true}
                                                            placeholder="Select Workbook"
                                                            value={
                                                                workbookOptions.find((el: { value: any }) => el.value === workbookId) || null
                                                            }
                                                            onChange={(e: any) => {
                                                                const id = e ? e.value : [];
                                                                setWorkbookId(id);
                                                            }}
                                                        />
                                                    </div>
                                                )
                                            }
                                        </>
                                    }
                                />
                                {/* end modal copy milestone */}
                            </>


                        }
                    />
                )

            }





            {/* body */}
            <div className="grid grid-cols-4 py-4 xs:grid xs:grid-cols-1 xs:gap-0 lg:grid lg:grid-cols-4 lg:gap-4">
                <div className="flex flex-col">
                    <div className="bg-white mb-4 rounded-md p-4">

                        <div
                            className="bg-red-600 w-fit p-2 rounded-md text-white hover:bg-red-500 hover:cursor-pointer"
                            onClick={
                                () => setModal({
                                    ...modal,
                                    add: true
                                })
                            }
                        >
                            <span>Add Workbook</span>
                        </div>

                    </div>

                    <div className="bg-white rounded-md shadow-md p-4 max-h-[80rem] h-[100%]">
                        <TextInput
                            type="text"
                            className="mt-2 ring-1 ring-red-600"

                            value={search.workbook_search[0].WORKBOOK_NAME}

                            onChange={(e) => inputDataSearch("WORKBOOK_NAME", e.target.value, 0)}

                            onKeyDown={
                                (e) => {
                                    if (e.key === "Enter") {
                                        if (
                                            search.workbook_search[0].WORKBOOK_NAME === ""
                                        ) {
                                            setIsSuccess("Get All Workbooks");
                                        } else {
                                            setIsSuccess("Search");
                                        }
                                        setTimeout(() => {
                                            setIsSuccess("");
                                        }, 5000);
                                    }
                                }
                            }


                            placeholder="Search Workbook"
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer"
                                onClick={() => {
                                    if (
                                        search.workbook_search[0]
                                            .WORKBOOK_ID === "" &&
                                        search.workbook_search[0]
                                            .WORKBOOK_NAME === ""
                                    ) {
                                        inputDataSearch("flag", "", 0);
                                    } else {
                                        inputDataSearch("flag", "", 0);
                                    }
                                    setIsSuccess("Search");
                                    setTimeout(() => {
                                        setIsSuccess("");
                                    }, 5000);
                                }
                                }
                            >
                                Search
                            </div>
                            <div
                                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer"

                                onClick={
                                    () => {
                                        inputDataSearch("WORKBOOK_NAME", "", 0);
                                        setIsSuccess("Clear Search");
                                        setTimeout(() => {
                                            setIsSuccess("");
                                        }, 5000);
                                    }
                                }
                            >
                                Clear Search
                            </div>
                        </div>
                    </div>

                </div>
                {/* AGGrid */}
                <div className="col-span-3 bg-white shadow-md rounded-md p-5 xs:mt-4 lg:mt-0">
                    <div className="ag-grid-layouts rounded-md shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-2.5">
                        <AGGrid
                            addButtonLabel={null}
                            addButtonModalState={undefined}
                            withParam={''}
                            searchParam={search.workbook_search}
                            // loading={}
                            url={"getWorkbook"}
                            doubleClickEvent={handleDetail}
                            triggeringRefreshData={isSuccess}
                            colDefs={[
                                {
                                    headerName: "No.",
                                    valueGetter: "node.rowIndex + 1",
                                    flex: 1.5,
                                    sortable: false,
                                    filter: false,
                                },
                                {
                                    headerName: 'Workbook Code'
                                    , field: 'WORKBOOK_CODE'

                                }
                                ,
                                {
                                    headerName: "Workbook Name",
                                    field: "WORKBOOK_NAME",
                                    flex: 7,

                                },

                            ]}
                        />
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}