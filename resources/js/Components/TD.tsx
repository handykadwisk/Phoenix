export default function TD(props: any) {
    const { children, className, rowSpan, colSpan } = props;
    return (
        <th className={className} rowSpan={rowSpan} colSpan={colSpan}>
            {children}
        </th>
    );
}
