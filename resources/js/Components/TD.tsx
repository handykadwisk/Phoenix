export default function TD(props: any) {
    const { children, className, rowSpan, colSpan } = props;
    return (
        <td
            className={`whitespace-nowrap ` + className}
            rowSpan={rowSpan}
            colSpan={colSpan}
        >
            {children}
        </td>
    );
}
