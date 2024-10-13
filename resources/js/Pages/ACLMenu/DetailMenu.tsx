import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import Button from "@/Components/Button/Button";
import defaultImage from "../../Images/user/default.jpg";
import {
    EllipsisHorizontalIcon,
    EnvelopeIcon,
    EyeIcon,
    MagnifyingGlassIcon,
    PencilIcon,
    PencilSquareIcon,
    PhoneIcon,
} from "@heroicons/react/20/solid";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";
import { FormEvent, PropsWithChildren, useEffect, useState } from "react";
import axios from "axios";
import Pagination from "@/Components/Pagination";
import ToastMessage from "@/Components/ToastMessage";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import TextArea from "@/Components/TextArea";
import ModalToAction from "@/Components/Modal/ModalToAction";
import TableTH from "@/Components/Table/TableTH";
import TableTD from "@/Components/Table/TableTD";
import ModalSearch from "@/Components/Modal/ModalSearch";
import Swal from "sweetalert2";
import PrimaryButton from "@/Components/PrimaryButton";
import ModalEdit from "@/Components/Modal/ModalEdit";
import ModalToResetPassword from "@/Components/Modal/ModalToResetPassword";
import Select from "react-tailwindcss-select";

export default function DetailGroup({
    idMenu,
    comboMenu,
    handleSuccess,
    modal,
    setModal,
}: PropsWithChildren<{
    idMenu: any;
    comboMenu: any;
    handleSuccess: any;
    modal: any;
    setModal: any;
}>) {

    useEffect(() => {
        getMenuById();
    }, [idMenu]);


    const getMenuById = async () => {
        await axios
            .post(`/getMenuById`, {
                idMenu,
                // menu_name: searchMenu.menu_name,
            })
            .then((res) => {
                setDataById(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [show, setShow] = useState<any>([]);
    useEffect(() => {
        const getmenusShow = async () => {
            try {
                const res = await axios.get(`/showMenu`);
                setShow(res.data);
            } catch (error) {
                console.log(error);
            }
        };

        getmenusShow();
    }, []);

    const [dataById, setDataById] = useState<any>({
        menu_parent_id: "",
        menu_name: "",
        menu_url: "",
        menu_sequence: "",
        menu_is_deleted: "",
    });

    const toggleMenuDeleteStatus = (id: number) => {
        // Periksa apakah id menu yang ingin diubah sesuai dengan id dalam state
        setDataById({
            ...dataById,
            menu_is_deleted: dataById.menu_is_deleted === 1 ? 0 : 1
        });
    };


    const actionDelete = async (e: any, idMenu: any, flag: any) => {
        e.preventDefault();
        // console.log(idMenu, flag);
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, do it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // send request to server
                    const response = await axios.post(`/changeMenuStatus`, { idMenu, flag });
                    // check status response
                    if (response.status === 200) {
                        Swal.fire(
                            'Deleted!',
                            'Your menu has been deleted.',
                            'success'
                        );
                        handleSuccess(response.data); // Panggil fungsi sukses untuk memperbarui UI atau state
                    } else {
                        throw new Error('Unexpected response status');
                    }
                } catch (error) {
                    console.error(error);
                    Swal.fire(
                        'Error!',
                        'There was an error deleting the menu.',
                        'error'
                    );
                }
            }
        });
    };

    const optionsParent = show.map((mData: any, i: number) => {
        return {
            value: mData.id,
            label: mData.text_combo,
        };
    });

    console.log(dataById);
    
    
    return (
        <>

            <ModalEdit
                show={modal}
                onClose={()=>{
                    setModal(false);
                    setDataById({
                        menu_parent_id: "",
                        menu_name: "",
                        menu_url: "",
                        menu_sequence: "",
                        menu_is_deleted: "",
                    });
                }}
                title={"Edit Menu"}
                url={`/setting/editMenu`}
                data={dataById}
                onSuccess={handleSuccess}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-1xl"
                }
                buttonAddOns={dataById.menu_is_deleted === 1 ? "Reactivate" : "Delete"}
                actionDelete={actionDelete}
                toggleMenuDeleteStatus={toggleMenuDeleteStatus}
                body={
                    <>
                        {/* Parent */}
                        <div className="mb-3">
                            <div>
                                <InputLabel
                                    className=""
                                    htmlFor="menu_parent_id"
                                    value={"Parent"}
                                />
                                {/* <select
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                    value={dataById.menu_parent_id || ''}
                                    onChange={(e) => {
                                        setDataById({
                                            ...dataById,
                                            menu_parent_id: e.target.value,
                                        });
                                    }}
                                >
                                    <option value={dataById.menu_id}>
                                        {dataById.menu_id ? dataById.menu_name : '-- Choose Parent --'}
                                    </option>
                                    {show.map((mData: any, i: number) => {
                                        return (
                                            <option value={mData.id} key={i}>
                                                {mData.text_combo}
                                            </option>
                                        );
                                    })}
                                </select> */}
                                <Select
                                    classNames={{
                                        menuButton: () =>
                                            `flex text-sm text-gray-500 mt-2 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                        menu: "text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                        listItem: ({ isSelected }: any) =>
                                            `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${isSelected
                                                ? `text-white bg-primary-pelindo`
                                                : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
                                            }`,
                                    }}
                                    options={optionsParent}
                                    isSearchable={true}
                                    isMultiple={false}
                                    placeholder={"Choose Parent"}
                                    isClearable={true}
                                    value={optionsParent.find((el: { value: any }) => el.value === dataById.menu_parent_id) || null}
                                    onChange={
                                        (value: any) => {
                                            setDataById({
                                                ...dataById,
                                                menu_parent_id: value.value,
                                            });
                                        }
                                    }
                                    primaryColor={"red"}
                                />
                            </div>
                            <div className="mt-2">
                                <InputLabel
                                    className="absolute"
                                    htmlFor="menu_name"
                                    value={"Menu Name"}
                                />
                                <div className="ml-[5.5rem] text-red-600">
                                    *
                                </div>
                                <TextInput
                                    id="menu_name"
                                    type="text"
                                    name="menu_name"
                                    value={dataById.menu_name || ''}
                                    className="mt-2"
                                    onChange={(e) => {
                                        setDataById({
                                            ...dataById,
                                            menu_name: e.target.value,
                                        });
                                    }}
                                    required
                                    placeholder="Name Menu"
                                />
                            </div>
                            <div className="mt-2">
                                <InputLabel
                                    className=""
                                    htmlFor="menu_url"
                                    value={"Menu URL"}
                                />
                                {/* <div className="ml-[4.3rem] text-red-600">
                                    *
                                </div> */}
                                <TextInput
                                    id="menu_url"
                                    type="text"
                                    name="menu_url"
                                    value={dataById.menu_url || ''}
                                    className="mt-2"
                                    onChange={(e) => {
                                        setDataById({
                                            ...dataById,
                                            menu_url: e.target.value,
                                        });
                                    }}
                                    // required
                                    placeholder="Menu URL"
                                />
                            </div>
                        </div>
                    </>
                }
            />
        </>
    );
}
