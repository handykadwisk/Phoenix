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
import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import Pagination from "@/Components/Pagination";
import ToastMessage from "@/Components/ToastMessage";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import TextArea from "@/Components/TextArea";
import ModalToAction from "@/Components/Modal/ModalToAction";

export default function Group({ auth }: PageProps) {
    useEffect(() => {
        getRelationGroup();
    }, []);

    // variabel relation Group
    const [relationsGroup, setRelationsGroup] = useState<any>([]);
    // detail Group
    const [detailGroup, setDetailGroup] = useState<any>([]);
    // variabel succes
    const [isSuccess, setIsSuccess] = useState<string>("");

    // Get Relation Group
    const getRelationGroup = async (pageNumber = "page=1") => {
        await axios
            .get(`/getRelationGroup?${pageNumber}`)
            .then((res) => {
                setRelationsGroup(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
        // setPolicies(policy)
    };

    const { xxx }: any = usePage().props;

    const { data, setData, errors, reset } = useForm({
        RELATION_GROUP_NAME: "",
        RELATION_GROUP_DESCRIPTION: "",
    });

    const handleSuccess = (message: string) => {
        setIsSuccess("");
        reset();
        setData({
            RELATION_GROUP_NAME: "",
            RELATION_GROUP_DESCRIPTION: "",
        });
        getRelationGroup();
        setIsSuccess(message);
    };

    const clickDetailRelation = async (e: FormEvent, id: number) => {
        e.preventDefault();
        window.open(`/relation/detailRelation/${id}`, "_self");
        // await axios
        //     .get(`/relation/detailRelation/${id}`)
        //     .then((res) => {})
        //     .catch((err) => console.log(err));
    };

    const handleViewModal = async (e: FormEvent, id: number) => {
        e.preventDefault();

        await axios
            .get(`/getGroup/${id}`)
            .then((res) => {
                console.log(res.data);
                setDetailGroup(res.data);
            })
            .catch((err) => console.log(err));

        setModal({
            add: false,
            delete: false,
            edit: false,
            view: !modal.view,
            document: false,
            search: false,
        });
    };

    // Modal Button Handle
    const [modal, setModal] = useState({
        add: false,
        delete: false,
        edit: false,
        view: false,
        document: false,
        search: false,
    });

    function classNames(...classes: any) {
        return classes.filter(Boolean).join(" ");
    }

    return (
        <AuthenticatedLayout user={auth.user} header={"Group"}>
            <Head title="Group" />

            {isSuccess && (
                <ToastMessage
                    message={isSuccess}
                    isShow={true}
                    isSuccess={true}
                />
            )}

            {/* Modal Add Group */}
            <ModalToAdd
                show={modal.add}
                onClose={() =>
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                    })
                }
                title={"Add Group"}
                url={`/group`}
                data={data}
                onSuccess={handleSuccess}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-2xl"
                }
                body={
                    <>
                        <div>
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="RELATION_GROUP_NAME"
                                    value="Name Relation Group"
                                />
                                <TextInput
                                    id="RELATION_GROUP_NAME"
                                    type="text"
                                    name="RELATION_GROUP_NAME"
                                    value={data.RELATION_GROUP_NAME}
                                    className="mt-2"
                                    autoComplete="RELATION_GROUP_NAME"
                                    onChange={(e) =>
                                        setData(
                                            "RELATION_GROUP_NAME",
                                            e.target.value
                                        )
                                    }
                                    required
                                    placeholder="Name Relation Group"
                                />
                            </div>
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="RELATION_GROUP_DESCRIPTION"
                                    value="Relation Group Description"
                                />
                                <TextArea
                                    className="mt-2"
                                    id="RELATION_GROUP_DESCRIPTION"
                                    name="RELATION_GROUP_DESCRIPTION"
                                    defaultValue={
                                        data.RELATION_GROUP_DESCRIPTION
                                    }
                                    onChange={(e: any) =>
                                        setData({
                                            ...data,
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
            {/* End Modal Add Group */}

            {/* Modal Detail Group */}
            <ModalToAction
                show={modal.view}
                onClose={() =>
                    setModal({
                        add: false,
                        delete: false,
                        edit: false,
                        view: false,
                        document: false,
                        search: false,
                    })
                }
                addOns={""}
                title={"View Policy"}
                classPanel={
                    "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-7xl"
                }
                url={``}
                data={null}
                onSuccess={null}
                method={""}
                headers={null}
                submitButtonName={null}
                body={<></>}
            />
            {/* End Modal Detail Group */}
            <div>
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <div className="md:grid md:grid-cols-8 md:gap-4">
                        <Button
                            className="text-sm w-full lg:w-1/2 font-semibold px-3 py-1.5 mb-4 md:col-span-2"
                            onClick={() => {
                                setModal({
                                    add: true,
                                    delete: false,
                                    edit: false,
                                    view: false,
                                    document: false,
                                    search: false,
                                });
                            }}
                        >
                            Add Group
                        </Button>
                        <hr className="mb-3 md:mb-0 md:hidden" />
                        <button
                            className="md:mb-4 mb-2 relative md:ml-auto lg:w-1/2 md:w-3/4 w-full inline-flex rounded-md text-left border-0 py-1.5 text-gray-400 ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6 lg:col-span-5 md:col-span-4"
                            // onClick={() => searchButtonModalState()}
                        >
                            <MagnifyingGlassIcon
                                className="mx-2 h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                            Search...
                        </button>
                        <Button
                            className="mb-4 md:col-span-2 lg:col-span-1 w-full py-1.5 px-2"
                            // onClick={() => clearSearchButtonAction()}
                        >
                            Clear Search
                        </Button>
                    </div>

                    {/* card Group */}
                    <div>
                        <ul
                            role="list"
                            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                        >
                            {/* {clients.map((client) => ( */}
                            {relationsGroup.data?.map(
                                (dataRelationGroup: any, i: number) => {
                                    return (
                                        <li
                                            key={i}
                                            className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow-lg border"
                                        >
                                            <div className="flex w-full items-center justify-between space-x-6 p-6">
                                                <div className="flex-1 truncate">
                                                    <div className="flex items-center space-x-3">
                                                        <h3 className="mt-1 truncate text-sm text-gray-500 ">
                                                            Group
                                                        </h3>
                                                    </div>
                                                    <p className="truncate text-xl font-medium text-gray-900">
                                                        {
                                                            dataRelationGroup.RELATION_GROUP_NAME
                                                        }
                                                    </p>
                                                </div>
                                                <img
                                                    className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"
                                                    src={defaultImage}
                                                    alt="Relation Group"
                                                />
                                            </div>
                                            <div>
                                                <div className="-mt-px flex divide-x divide-gray-200">
                                                    <div className="flex w-0 flex-1">
                                                        <a
                                                            href={`/group/detailGroup/${dataRelationGroup.RELATION_GROUP_ID}`}
                                                            className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900 hover:text-red-600"
                                                            // onClick={(e) =>
                                                            //     handleViewModal(
                                                            //         e,
                                                            //         dataRelationGroup.RELATION_GROUP_ID
                                                            //     )
                                                            // }
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 24 24"
                                                                fill="currentColor"
                                                                className="size-4"
                                                            >
                                                                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                            Detail
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                }
                            )}
                            {/* ))} */}
                        </ul>
                        <Pagination
                            links={relationsGroup.links}
                            fromData={relationsGroup.from}
                            toData={relationsGroup.to}
                            totalData={relationsGroup.total}
                            clickHref={(url: string) =>
                                getRelationGroup(url.split("?").pop())
                            }
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
