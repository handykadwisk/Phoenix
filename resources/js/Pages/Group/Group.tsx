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
import TextArea from "@/Components/TextArea";

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
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
        // setPolicies(policy)
    };
    const testReturn = (props: any) => {
        const testrun = <span>aaaa</span>;

        return testrun;
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
                className={
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
                                            <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6 mb-5">
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
                                            {dataRelationGroup.r_group
                                                .length === 0 ? (
                                                <dl className="-my-3 divide-y divide-gray-100 px-6 py-2 text-sm leading-6">
                                                    <summary className="bg-gray-50 p-4 rounded-lg cursor-pointer shadow-md mb-4">
                                                        {"Relation Not found"}
                                                    </summary>
                                                </dl>
                                            ) : (
                                                dataRelationGroup.r_group?.map(
                                                    (
                                                        rg: any,
                                                        index: number
                                                    ) => (
                                                        <dl
                                                            key={index}
                                                            className="-my-3 divide-y divide-gray-100 px-6 py-2 text-sm leading-6"
                                                        >
                                                            {rg.RELATION_ORGANIZATION_PARENT_ID ===
                                                                0 &&
                                                            rg.children
                                                                .length ===
                                                                0 ? (
                                                                <summary className="bg-gray-50 p-4 rounded-lg cursor-pointer shadow-md mb-4">
                                                                    {
                                                                        rg.RELATION_ORGANIZATION_NAME
                                                                    }
                                                                </summary>
                                                            ) : (
                                                                <>
                                                                    {rg.RELATION_ORGANIZATION_PARENT_ID !==
                                                                    0 ? (
                                                                        ""
                                                                    ) : (
                                                                        <details className="mb-2">
                                                                            <summary className="bg-gray-50 p-4 rounded-lg cursor-pointer shadow-md mb-4">
                                                                                <span>
                                                                                    {
                                                                                        rg.RELATION_ORGANIZATION_NAME
                                                                                    }
                                                                                </span>
                                                                            </summary>
                                                                            {rg.children?.map(
                                                                                (
                                                                                    c: any,
                                                                                    a: number
                                                                                ) => (
                                                                                    <ul
                                                                                        key={
                                                                                            a
                                                                                        }
                                                                                        className="ml-4"
                                                                                    >
                                                                                        <li>
                                                                                            <details className="mb-2">
                                                                                                <summary className="bg-gray-50 p-4 rounded-lg cursor-pointer shadow-md mb-4">
                                                                                                    <span>
                                                                                                        {
                                                                                                            c.RELATION_ORGANIZATION_NAME
                                                                                                        }
                                                                                                    </span>
                                                                                                </summary>
                                                                                                {c.children?.map(
                                                                                                    (
                                                                                                        z: any,
                                                                                                        b: number
                                                                                                    ) => (
                                                                                                        <summary
                                                                                                            key={
                                                                                                                b
                                                                                                            }
                                                                                                            className="bg-gray-50 p-4 rounded-lg cursor-pointer shadow-md mb-4 ml-5"
                                                                                                        >
                                                                                                            <span>
                                                                                                                {
                                                                                                                    z.RELATION_ORGANIZATION_NAME
                                                                                                                }
                                                                                                            </span>
                                                                                                        </summary>
                                                                                                    )
                                                                                                )}
                                                                                            </details>
                                                                                        </li>
                                                                                    </ul>
                                                                                )
                                                                            )}
                                                                        </details>
                                                                    )}
                                                                </>
                                                            )}
                                                        </dl>
                                                    )
                                                )
                                            )}
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
                    {testReturn()}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
