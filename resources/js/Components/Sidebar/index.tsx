import React, { useEffect, useRef, useState, Fragment } from "react";
import { Link, usePage } from "@inertiajs/react";
import NavLink from "@/Components/NavLink";
import SidebarLinkGroup from "./SidebarLinkGroup";
import Logo from "../../Images/phoenix.png";

import { Dialog, Transition } from "@headlessui/react";
import { Cog6ToothIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { log } from "node:console";

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (arg: boolean) => void;
    sidebarDesktopOpen: boolean;
    setSidebarDesktopOpen: (arg: boolean) => void;
}

const Sidebar = ({
    sidebarOpen,
    setSidebarOpen,
    sidebarDesktopOpen,
    setSidebarDesktopOpen,
}: SidebarProps) => {
    const { auth }: any = usePage().props;

    const trigger = useRef<any>(null);
    const sidebar = useRef<any>(null);

    const pathname = window.location.pathname.split("/")[1];

    const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
    const [sidebarExpanded, setSidebarExpanded] = useState(
        storedSidebarExpanded === null
            ? false
            : storedSidebarExpanded === "true"
    );

    // close on click outside
    useEffect(() => {
        const clickHandler = ({ target }: MouseEvent) => {
            if (!sidebar.current || !trigger.current) return;
            if (
                !sidebarOpen ||
                sidebar.current.contains(target) ||
                trigger.current.contains(target)
            )
                return;
            setSidebarOpen(false);
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    });

    // close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ keyCode }: KeyboardEvent) => {
            if (!sidebarOpen || keyCode !== 27) return;
            setSidebarOpen(false);
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    });

    useEffect(() => {
        localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
        if (sidebarExpanded) {
            document.querySelector("body")?.classList.add("sidebar-expanded");
        } else {
            document
                .querySelector("body")
                ?.classList.remove("sidebar-expanded");
        }
    }, [sidebarExpanded]);

    

    return (
        <div>
            <Transition.Root show={sidebarOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-50 lg:hidden"
                    onClose={setSidebarOpen}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-900/80" />
                    </Transition.Child>

                    <div className="fixed inset-0 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                        <button
                                            type="button"
                                            className="-m-2.5 p-2.5"
                                            onClick={() =>
                                                setSidebarOpen(false)
                                            }
                                        >
                                            <span className="sr-only">
                                                Close sidebar
                                            </span>
                                            <XMarkIcon
                                                className="h-6 w-6 text-white"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>
                                </Transition.Child>
                                {/* Sidebar component, swap this element with another sidebar if you like */}
                                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                                    <div className="flex h-16 shrink-0 items-center">
                                        <img
                                            className="h-8 w-auto"
                                            src={Logo}
                                            alt="Phoenix"
                                        />
                                    </div>
                                    <nav className="flex flex-1 flex-col">
                                        <ul
                                            role="list"
                                            className="flex flex-1 flex-col gap-y-7"
                                        >
                                            <li>
                                                <ul
                                                    role="list"
                                                    className="-mx-2 space-y-1"
                                                >
                                                    <NavLink
                                                        href={route(
                                                            `dashboard`
                                                        )}
                                                        active={route().current(
                                                            `dashboard`
                                                        )}
                                                        className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold hover:bg-red-600 hover:text-white`}
                                                    >
                                                        {"Dashboard"}
                                                    </NavLink>
                                                    {auth.menu
                                                        ?.filter(
                                                            (m: any) =>
                                                                m.menu_parent_id ===
                                                                null
                                                        )
                                                        .map(
                                                            (
                                                                menu: any,
                                                                index: number
                                                            ) => {
                                                                return menu.menu_url !==
                                                                    null ? (
                                                                    <li
                                                                        key={
                                                                            index
                                                                        }
                                                                    >
                                                                        {
                                                                            route().has(menu.menu_name) ?
                                                                                <NavLink
                                                                                    href={route(
                                                                                        `${menu.menu_url}`
                                                                                    )}
                                                                                    active={
                                                                                        route().current(
                                                                                            `${menu.menu_url}.*`
                                                                                        ) ||
                                                                                        route().current(
                                                                                            `${menu.menu_url}`
                                                                                        )
                                                                                    }
                                                                                    className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold hover:bg-red-600 hover:text-white`}
                                                                                >
                                                                                    {
                                                                                        menu.menu_name
                                                                                    }
                                                                                </NavLink> :
                                                                                <span className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ">
                                                                                    {
                                                                                        menu.menu_url
                                                                                    }
                                                                                </span>

                                                                        }
                                                                        {
                                                                            route().has(menu.name) ?
                                                                                <NavLink
                                                                                    href={route(
                                                                                        `${menu.menu_url}`
                                                                                    )}
                                                                                    active={
                                                                                        route().current(
                                                                                            `${menu.menu_url}.*`
                                                                                        ) ||
                                                                                        route().current(
                                                                                            `${menu.menu_url}`
                                                                                        )
                                                                                    }
                                                                                    className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold hover:bg-red-600 hover:text-white`}
                                                                                >
                                                                                    {
                                                                                        menu.menu_name
                                                                                    }
                                                                                </NavLink> :
                                                                                <span className=" group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold opacity-25 ">
                                                                                    {
                                                                                        menu.menu_url
                                                                                    }
                                                                                </span>
                                                                        }
                                                                    </li>
                                                                ) : (
                                                                    <SidebarLinkGroup
                                                                        activeCondition={pathname.includes(
                                                                            menu.menu_name.toLowerCase()
                                                                        )}
                                                                        key={
                                                                            index
                                                                        }
                                                                    >
                                                                        {(
                                                                            handleClick,
                                                                            open
                                                                        ) => {
                                                                            return (
                                                                                <React.Fragment>
                                                                                    <NavLink
                                                                                        active={
                                                                                            false
                                                                                        }
                                                                                        href="#"
                                                                                        className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold relative items-center gap-2.5 py-2 text-bodydark1 duration-300 ease-in-out hover:bg-red-600 hover:text-white`}
                                                                                        onClick={(
                                                                                            e
                                                                                        ) => {
                                                                                            e.preventDefault();
                                                                                            sidebarExpanded
                                                                                                ? handleClick()
                                                                                                : setSidebarExpanded(
                                                                                                    true
                                                                                                );
                                                                                        }}
                                                                                    >
                                                                                        {
                                                                                            menu.menu_name
                                                                                        }
                                                                                        <svg
                                                                                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open &&
                                                                                                "rotate-180"
                                                                                                }`}
                                                                                            width="20"
                                                                                            height="20"
                                                                                            viewBox="0 0 20 20"
                                                                                            fill="none"
                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                        >
                                                                                            <path
                                                                                                fillRule="evenodd"
                                                                                                clipRule="evenodd"
                                                                                                d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                                                                                fill=""
                                                                                            />
                                                                                        </svg>
                                                                                    </NavLink>
                                                                                    {/* <!-- Dropdown Menu Start --> */}
                                                                                    <div
                                                                                        className={`translate transform overflow-hidden ${!open &&
                                                                                            "hidden"
                                                                                            }`}
                                                                                    >
                                                                                        <ul className="mt-2 flex flex-col pl-6">
                                                                                            {menu.children
                                                                                                ?.filter((children: any) => {
                                                                                                    // Jika user type adalah 1 (admin), tampilkan semua children tanpa filter access
                                                                                                    if (auth.user.user_type_id === 1) {
                                                                                                        return children // Tampilkan semua children
                                                                                                    }

                                                                                                    // Jika bukan admin, filter children berdasarkan access
                                                                                                    return children?.access?.length > 0;
                                                                                                })
                                                                                                .map(
                                                                                                    (
                                                                                                        filteredChildren: any,
                                                                                                        index: number
                                                                                                    ) => (
                                                                                                        <li
                                                                                                            key={
                                                                                                                index
                                                                                                            }
                                                                                                        >
                                                                                                            {
                                                                                                                route().has(filteredChildren.menu_url) ?
                                                                                                                    <NavLink
                                                                                                                        href={route(
                                                                                                                            filteredChildren.menu_url
                                                                                                                        )}
                                                                                                                        active={route().current(
                                                                                                                            filteredChildren.menu_url
                                                                                                                        )}
                                                                                                                        className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold  hover:text-red-700`}
                                                                                                                    >
                                                                                                                        {
                                                                                                                            filteredChildren.menu_name
                                                                                                                        }
                                                                                                                    </NavLink> :
                                                                                                                    <span className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold opacity-25">
                                                                                                                        {
                                                                                                                            filteredChildren.menu_name
                                                                                                                        }
                                                                                                                    </span>
                                                                                                            }

                                                                                                        </li>
                                                                                                    )
                                                                                                )}
                                                                                        </ul>
                                                                                    </div>
                                                                                    {/* <!-- Dropdown Menu End --> */}
                                                                                </React.Fragment>
                                                                            );
                                                                        }}
                                                                    </SidebarLinkGroup>
                                                                );
                                                            }
                                                        )}
                                                </ul>
                                            </li>
                                            {/* <li className="mt-auto">
                          <a
                            href="#"
                            className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                          >
                            <Cog6ToothIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
                            Settings
                          </a>
                        </li> */}
                                        </ul>
                                    </nav>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* Static sidebar for desktop */}
            <div
                className={`hidden lg:fixed lg:inset-y-0 lg:z-50 ${!sidebarDesktopOpen ? "lg:flex lg:w-72 lg:flex-col" : ""
                    }`}
            >
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center justify-center">
                        <img className="h-8 w-auto" src={Logo} alt="Phoenix" />
                    </div>
                    <nav className="flex flex-1 flex-col">
                        <ul
                            role="list"
                            className="flex flex-1 flex-col gap-y-7"
                        >
                            <li>
                                <ul role="list" className="-mx-2 space-y-1">
                                    {/* DASHBOARD */}
                                    <NavLink
                                        href={route(`dashboard`)}
                                        active={route().current(`dashboard`)}
                                        className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold hover:bg-red-600 hover:text-white`}
                                    >
                                        {"Dashboard"}
                                    </NavLink>
                                    {auth.menu
                                        ?.filter(
                                            (m: any) =>
                                                m.menu_parent_id === null
                                        )
                                        .map((menu: any, index: number) =>
                                            menu.menu_url !== null ? (
                                                <li key={index}>
                                                    {
                                                        route().has(menu.menu_url)
                                                            ?
                                                            <NavLink
                                                                href={route(
                                                                    `${menu.menu_url}`
                                                                )}
                                                                active={
                                                                    route().current(
                                                                        `${menu.menu_url}.*`
                                                                    ) ||
                                                                    route().current(
                                                                        `${menu.menu_url}`
                                                                    )
                                                                }
                                                                className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold hover:bg-red-600 hover:text-white`}
                                                            >
                                                                {menu.menu_name}
                                                            </NavLink>
                                                            :
                                                            <span className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold opacity-25">
                                                                {
                                                                    menu.menu_name
                                                                }
                                                            </span>
                                                    }
                                                </li>
                                            ) : (
                                                <SidebarLinkGroup
                                                    activeCondition={pathname.includes(
                                                        menu.menu_name.toLowerCase()
                                                    )}
                                                    key={index}
                                                >
                                                    {(handleClick, open) => {
                                                        return (
                                                            <React.Fragment>
                                                                <NavLink
                                                                    active={
                                                                        false
                                                                    }
                                                                    href="#"
                                                                    className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold relative items-center gap-2.5 py-2 duration-300 ease-in-out hover:bg-red-600 hover:text-white`}
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.preventDefault();
                                                                        sidebarExpanded
                                                                            ? handleClick()
                                                                            : setSidebarExpanded(
                                                                                true
                                                                            );
                                                                    }}
                                                                >
                                                                    {
                                                                        menu.menu_name
                                                                    }
                                                                    <svg
                                                                        className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open &&
                                                                            "rotate-180"
                                                                            }`}
                                                                        width="20"
                                                                        height="20"
                                                                        viewBox="0 0 20 20"
                                                                        fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path
                                                                            fillRule="evenodd"
                                                                            clipRule="evenodd"
                                                                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                                                            fill=""
                                                                        />
                                                                    </svg>
                                                                </NavLink>
                                                                {/* <!-- Dropdown Menu Start --> */}
                                                                <div
                                                                    className={`translate transform overflow-hidden ${!open &&
                                                                        "hidden"
                                                                        }`}
                                                                >
                                                                    <ul className="mt-2 flex flex-col pl-6 space-y-1">
                                                                        {menu.children?.filter((children: any) => {
                                                                            if (auth.user.user_type_id === 1) {
                                                                                return children // Tampilkan semua children
                                                                            }

                                                                            // Jika bukan admin, filter children berdasarkan access
                                                                            return children?.access?.length > 0;
                                                                        }).map((filteredChildren: any, index: number) => (
                                                                            <li key={index}>
                                                                                {/* menu dropdown */}
                                                                                {
                                                                                    route().has(filteredChildren.menu_url) ?
                                                                                        <NavLink
                                                                                            href={route(
                                                                                                filteredChildren.menu_url
                                                                                            )}
                                                                                            active={route().current(
                                                                                                filteredChildren.menu_url
                                                                                            )}
                                                                                            className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold hover:bg-red-600 hover:text-white`}
                                                                                        >
                                                                                            {
                                                                                                filteredChildren.menu_name
                                                                                            }
                                                                                        </NavLink>
                                                                                        :
                                                                                        <span className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold opacity-25">
                                                                                            {
                                                                                                filteredChildren.menu_name
                                                                                            }
                                                                                        </span>
                                                                                }

                                                                                {/* end menu dropdown */}
                                                                            </li>
                                                                        )
                                                                        )}
                                                                    </ul>
                                                                </div>
                                                                {/* <!-- Dropdown Menu End --> */}
                                                            </React.Fragment>
                                                        );
                                                    }}
                                                </SidebarLinkGroup>
                                            )
                                        )}
                                </ul>
                            </li>
                            {/* <li className="mt-auto">
                  <a
                    href="#"
                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                  >
                    <Cog6ToothIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
                    Settings
                  </a>
                </li> */}
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
