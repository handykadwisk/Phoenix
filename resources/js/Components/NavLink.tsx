import { Link, InertiaLinkProps } from "@inertiajs/react";

export default function NavLink({
    active = false,
    className = "",
    children,
    ...props
}: InertiaLinkProps & { active: boolean }) {
    return (
        <Link
            {...props}
            className={
                " " +
                (active ? "bg-red-600 text-white " : "hover:text-white") +
                className
            }
        >
            {children}
        </Link>
    );
}
