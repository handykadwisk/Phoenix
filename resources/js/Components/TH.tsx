export default function TH(props: any) {
    const { label, className, rowSpan, colSpan } = props;
    return (
        <th className={className} rowSpan={rowSpan} colSpan={colSpan}>
            {label}
        </th>
    );
}
