export default function TH(props: any) {
    const { label, children, className, rowSpan, colSpan } = props;
    return (
        <th
            className={`whitespace-nowrap ` + className}
            rowSpan={rowSpan}
            colSpan={colSpan}
        >
            {label ? label : children}
        </th>
    );
}
