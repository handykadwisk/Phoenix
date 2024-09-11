export default function Content(props: any) {
    const { buttonOnAction, search, th, td, pagination } = props;
    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-4 mb-5 mt-5">
                <div className="flex flex-col">
                    <div className="rounded-md bg-white pt-5 pb-1 px-10 shadow-default dark:border-strokedark dark:bg-boxdark">
                        {buttonOnAction}
                    </div>
                    <div className="bg-white rounded-md mb-5 lg:mb-0 p-10 mt-5">
                        <fieldset className="py-3 rounded-lg border-slate-100 border-2">
                            <legend className="ml-8 text-sm">Search</legend>
                            <div className="mt-3 px-4">{search}</div>
                        </fieldset>
                    </div>
                </div>
                <div className="bg-white rounded-md col-span-2 p-10">
                    <div
                        className={`max-w-full overflow-x-auto ring-1 ring-stone-200 shadow-xl rounded-lg custom-table overflow-visible`}
                    >
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-100">{th}</thead>
                            <tbody>{td}</tbody>
                        </table>
                    </div>
                    {pagination}
                </div>
            </div>
        </>
    );
}
