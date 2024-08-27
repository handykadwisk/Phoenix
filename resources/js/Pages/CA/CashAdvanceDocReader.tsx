import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";
import { usePage } from "@inertiajs/react";

export default function CashAdvanceDocReader() {
    const { uri } = usePage().props;

    const docs = [
        {
            uri: `${uri}`,
        },
    ];

    return (
        <>
            <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} />
        </>
    );
}
