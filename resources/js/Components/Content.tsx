export default function Content(props: any) {
    const { buttonOnAction, search, buttonSearch, dataList } = props;
    return (
        <>
            <div className="grid grid-cols-4 gap-4 px-4 py-2 xs:grid xs:grid-cols-1 xs:gap-0 lg:grid lg:grid-cols-4 lg:gap-4">
                <div className="flex flex-col">
                    <div className="bg-white mb-4 rounded-md shadow-md p-4">
                        {buttonOnAction}
                    </div>
                    <div className="bg-white rounded-md shadow-md p-4 h-[100%] relative">
                        {search}
                        {/* <div className="flex flex-col md:flex-row justify-end gap-2"> */}
                        {buttonSearch}
                        {/* </div> */}
                    </div>
                </div>
                <div className="col-span-3 bg-white shadow-md rounded-md p-5 xs:mt-4 lg:mt-0">
                    <div className="ag-grid-layouts rounded-md shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-2.5">
                        {dataList}
                    </div>
                </div>
            </div>
        </>
    );
}
