import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import Button from "@/Components/Button/Button";
import defaultImage from "../../Images/user/default.jpg";
import {
    EllipsisHorizontalIcon,
    MagnifyingGlassIcon,
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

export default function Group({ auth }: PageProps) {
    useEffect(() => {
        getRelationGroup();
    }, []);

    // variabel relation Group
    const [relationsGroup, setRelationsGroup] = useState<any>([]);
    // variabel succes
    const [isSuccess, setIsSuccess] = useState<string>("");

    // Get Relation Group
    const getRelationGroup = async (pageNumber = "page=1") => {
        await axios
            .get(`/getRelationGroup?${pageNumber}`)
            .then((res) => {
                setRelationsGroup(res.data);
                // console.log(relationsGroup.links);
            })
            .catch((err) => {
                console.log(err);
            });
        // setPolicies(policy)
    };

    const { xxx }: any = usePage().props;

    const { data, setData, errors, reset } = useForm({
        group_id: "",
        name_relation: "",
        parent_id: "",
        abbreviation: "",
        relation_aka: "",
        relation_email: "",
        relation_description: "",
        relation_lob_id: "",
        salutation_id: "",
        relation_status_id: "",
        tagging_name: "",
        is_managed: "",
        profession_id: "",
        relation_type_id: [],
    });

    const handleSuccess = (message: string) => {
        setIsSuccess("");
        reset();
        setData({
            group_id: "",
            name_relation: "",
            parent_id: "",
            abbreviation: "",
            relation_aka: "",
            relation_email: "",
            relation_description: "",
            relation_lob_id: "",
            salutation_id: "",
            relation_status_id: "",
            tagging_name: "",
            is_managed: "",
            profession_id: "",
            relation_type_id: [],
        });
        getRelationGroup();
        setIsSuccess(message);
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
                title={"Add Relation"}
                url={`/relation`}
                data={data}
                onSuccess={handleSuccess}
                panelWidth={"60%"}
                body={
                    <>
                        <div>
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="name_relation"
                                    value="Name Relation"
                                />
                                <TextInput
                                    id="name_relation"
                                    type="text"
                                    name="name_relation"
                                    value={data.name_relation}
                                    className="mt-2"
                                    autoComplete="name_relation"
                                    onChange={(e) =>
                                        setData("name_relation", e.target.value)
                                    }
                                    required
                                    placeholder="Name Relation"
                                />
                            </div>
                        </div>
                    </>
                }
            />
            {/* End Modal Add Group */}
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
                            className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8"
                        >
                            {/* {clients.map((client) => ( */}
                            {relationsGroup.data?.map(
                                (dataRelationGroup: any, i: number) => {
                                    return (
                                        <li
                                            key={i}
                                            className="overflow-hidden rounded-xl border border-gray-200"
                                        >
                                            <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
                                                <img
                                                    src={defaultImage}
                                                    alt={defaultImage}
                                                    className="h-13 w-14 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10"
                                                />
                                                <div className="text-sm font-medium leading-6 text-gray-900">
                                                    {
                                                        dataRelationGroup.RELATION_GROUP_NAME
                                                    }
                                                </div>
                                                <Menu
                                                    as="div"
                                                    className="relative ml-auto"
                                                >
                                                    <Menu.Button className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
                                                        <span className="sr-only">
                                                            Open options
                                                        </span>
                                                        <EllipsisHorizontalIcon
                                                            className="h-5 w-5"
                                                            aria-hidden="true"
                                                        />
                                                    </Menu.Button>
                                                    <Transition
                                                        as={Fragment}
                                                        enter="transition ease-out duration-100"
                                                        enterFrom="transform opacity-0 scale-95"
                                                        enterTo="transform opacity-100 scale-100"
                                                        leave="transition ease-in duration-75"
                                                        leaveFrom="transform opacity-100 scale-100"
                                                        leaveTo="transform opacity-0 scale-95"
                                                    >
                                                        <Menu.Items className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                                                            <Menu.Item>
                                                                {({
                                                                    active,
                                                                }) => (
                                                                    <a
                                                                        href="#"
                                                                        className={classNames(
                                                                            active
                                                                                ? "bg-gray-50"
                                                                                : "",
                                                                            "block px-3 py-1 text-sm leading-6 text-gray-900"
                                                                        )}
                                                                    >
                                                                        View
                                                                        <span className="sr-only">
                                                                            ,{" "}
                                                                            {""}
                                                                        </span>
                                                                    </a>
                                                                )}
                                                            </Menu.Item>
                                                            <Menu.Item>
                                                                {({
                                                                    active,
                                                                }) => (
                                                                    <a
                                                                        href="#"
                                                                        className={classNames(
                                                                            active
                                                                                ? "bg-gray-50"
                                                                                : "",
                                                                            "block px-3 py-1 text-sm leading-6 text-gray-900"
                                                                        )}
                                                                    >
                                                                        Edit
                                                                        <span className="sr-only">
                                                                            ,{" "}
                                                                            {""}
                                                                        </span>
                                                                    </a>
                                                                )}
                                                            </Menu.Item>
                                                        </Menu.Items>
                                                    </Transition>
                                                </Menu>
                                            </div>
                                            <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                                                <div className="flex justify-between gap-x-4 py-3">
                                                    <dt className="text-gray-500">
                                                        Last invoice
                                                    </dt>
                                                    <dd className="text-gray-700">
                                                        <time dateTime={""}>
                                                            {""}
                                                        </time>
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between gap-x-4 py-3">
                                                    <dt className="text-gray-500">
                                                        Amount
                                                    </dt>
                                                    <dd className="flex items-start gap-x-2">
                                                        <div className="font-medium text-gray-900">
                                                            {""}
                                                        </div>
                                                        <div className={""}>
                                                            {""}
                                                        </div>
                                                    </dd>
                                                </div>
                                            </dl>
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
