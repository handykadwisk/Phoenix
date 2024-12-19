import React, { useEffect, useRef, useState, Fragment } from "react";
import { Link, usePage } from "@inertiajs/react";
import NavLink from "@/Components/NavLink";
import SidebarLinkGroup from "./SidebarLinkGroup";
import Logo from "../../Images/phoenix.png";

import { Dialog, Transition } from "@headlessui/react";
import { Cog6ToothIcon, XMarkIcon } from "@heroicons/react/24/outline";

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

    // console.log(auth,'<<<<<<<<authhhhh');

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

    const renderMenu = (menu: any, index: number) => {
        const hasChildren = menu.children && menu.children.length > 0;
        // console.log(hasChildren,'hassschild');

        return (
            <li key={index}>
                {menu.menu_url ? (
                    route().has(menu.menu_url) ? (
                        <NavLink
                            href={route(menu.menu_url)}
                            active={
                                route().current(`${menu.menu_url}.*`) ||
                                route().current(menu.menu_url)
                            }
                            className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold hover:bg-red-600 hover:text-white"
                        >
                            {menu.menu_name}
                        </NavLink>
                    ) : (
                        <span className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold opacity-25">
                            {menu.menu_name}
                        </span>
                    )
                ) : (
                    <SidebarLinkGroup
                        activeCondition={pathname.includes(
                            menu.menu_name.toLowerCase()
                        )}
                        key={index}
                    >
                        {(handleClick, open) => (
                            <Fragment>
                                <NavLink
                                    href="#"
                                    active={false}
                                    className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold relative items-center gap-2.5 py-2 duration-300 ease-in-out hover:bg-red-600 hover:text-white"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        sidebarExpanded
                                            ? handleClick()
                                            : setSidebarExpanded(true);
                                    }}
                                >
                                    {menu.menu_name}
                                    <svg
                                        className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                                            open && "rotate-180"
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
                                        />
                                    </svg>
                                </NavLink>

                                {/* Dropdown menu untuk children */}
                                <div
                                    className={`translate transform overflow-hidden ${
                                        !open && "hidden"
                                    }`}
                                >
                                    <ul className="mt-2 flex flex-col pl-6 space-y-1">
                                        {/* Render children secara rekursif */}
                                        {hasChildren &&
                                            menu.children.map(
                                                (
                                                    child: any,
                                                    childIndex: number
                                                ) => (
                                                    <Fragment
                                                        key={`${index}-${childIndex}`}
                                                    >
                                                        {renderMenu(
                                                            child,
                                                            childIndex
                                                        )}
                                                    </Fragment>
                                                )
                                            )}
                                    </ul>
                                </div>
                            </Fragment>
                        )}
                    </SidebarLinkGroup>
                )}
            </li>
        );
    };

    interface MenuItem {
        id: number;
        menu_parent_id: number | null;
        menu_name: string;
        children?: MenuItem[]; // optional because it might not exist initially
    }

    const organizeMenu = (
        menu: MenuItem[],
        parentId: number | null = null
    ): MenuItem[] => {
        // console.log(menu, '<<<<<<<<menuuuuu');

        const filteredMenu = menu.filter(
            (item: MenuItem) => item.menu_parent_id === parentId
        );
        // console.log('Filtered Menu:', filteredMenu); // Lihat hasil filtering berdasarkan parentId

        return filteredMenu.map((item: MenuItem) => {
            const children = organizeMenu(menu, item.id);
            // console.log(`Menu Item: ${item.menu_name}, Children: `, children);  // Cek apakah children ditemukan

            return {
                ...item,
                children: children.length > 0 ? children : [], // Rekursif mencari children
            };
        });
    };

    const organizedMenu = organizeMenu(auth.menu);
    // console.log(organizeMenu(auth.menu), '<<<<<<<<Organizeddd');

    // console.log(auth.menu,'<<<<<<<<menuuuuu');
    // console.log(organizedMenu, '<<<<<<<<Organizeddd');

    return (
        <div>
            {/* Sidebar mobile */}
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
                                                    {/* {organizedMenu.map((menu: any, index: number) => renderMenu(menu, index))} */}
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
                                                            ) =>
                                                                renderMenu(
                                                                    menu,
                                                                    index
                                                                )
                                                        )}
                                                </ul>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* Sidebar desktop */}
            <div
                className={`hidden lg:fixed lg:inset-y-0 lg:z-50 ${
                    !sidebarDesktopOpen ? "lg:flex lg:w-72 lg:flex-col" : ""
                }`}
            >
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
                                            renderMenu(menu, index)
                                        )}
                                </ul>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
