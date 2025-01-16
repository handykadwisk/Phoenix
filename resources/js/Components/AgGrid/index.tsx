import { useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { PropsWithChildren, useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import Button from "../Button/Button";
import { GridReadyEvent, IServerSideDatasource } from "ag-grid-community";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import axios from "axios";
import { router } from "@inertiajs/react";
// import "../../../css/style.css";

export default function AGGrid({
    colDefs,
    addButtonLabel,
    url,
    // loading,
    withParam,
    searchParam,
    triggeringRefreshData,
    doubleClickEvent = () => { },
    addButtonModalState = () => { },
    rowHeight,
    rowSelection,
    onSelectionChanged,
    suppressRowClickSelection,
    buttonExcelExport,
    suppressCsvExport,
    noRowsOverlayComponent,
}: PropsWithChildren<{
    colDefs: any;
    url: string;
    addButtonLabel: string | null | undefined;
    // loading: boolean;
    withParam: string | null;
    searchParam: any | string | null;
    triggeringRefreshData: string;
    doubleClickEvent: CallableFunction | undefined;
    addButtonModalState: CallableFunction | undefined;
    rowHeight?: number | undefined;
    rowSelection?: any;
    onSelectionChanged?: any;
    suppressRowClickSelection?: boolean;
    buttonExcelExport?: boolean;
    suppressCsvExport?: boolean;
    noRowsOverlayComponent?: boolean;
}>) {
    const gridRef = useRef<AgGridReact>(null);
    const getServerSideDatasource = (): IServerSideDatasource => {
        return {
            getRows: (params) => {
                const startRow = params.request.startRow!;
                const endRow = params.request.endRow!;

                const page =
                    params.request.startRow === 0
                        ? 1
                        : Math.ceil(endRow / (endRow - startRow));

                const sortModel = params.request.sortModel;
                const sortParams = sortModel
                    .map((model) => `${model.colId},${model.sort}`)
                    .join(";");

                const filterModel: any = params.request.filterModel;
                const filterParams: any = {};

                for (const colId in filterModel) {
                    if (filterModel[colId].filterType === "text") {
                        filterParams[colId] = filterModel[colId].filter;
                    } else if (filterModel[colId].filterType === "date") {
                        filterParams[colId] = filterModel[colId].dateFrom;
                    } else if (filterModel[colId].filterType === "set") {
                        filterParams[colId] = filterModel[colId].values;
                    }
                }

                let urlNew: any = "";

                if (withParam !== "") {
                    urlNew = `${url}?id=${withParam}`;
                } else if (withParam === "") {
                    urlNew = `${url}?`;
                }

                // console.log("Filter model from AG Grid:", filterModel);
                // console.log("Filter params sent to API:", filterParams);

                axios
                    .get(
                        `/${urlNew}page=${page}&perPage=${endRow - startRow
                        }&sort=${sortParams}&filter=${JSON.stringify(
                            filterParams
                        )}&newFilter=${JSON.stringify(searchParam)}`
                    )
                    .then((res) => {
                        params.success({
                            rowData: res.data.data,
                            rowCount: res.data.total,
                        });
                        if (res.data.data.length === 0) {
                            params.api.showNoRowsOverlay();
                        } else {
                            params.api.hideOverlay();
                        }
                    })
                    .catch((err) => {
                        if (
                            err.status === 401 ||
                            err.status === 403 ||
                            err.status === 419
                        ) {
                            router.visit("/logout", { method: "post" });
                        } else {
                            console.log(err);
                        }
                    });
            },
        };
    };

    const onGridReady = (params: GridReadyEvent<any, any>) => {
        var dataSource = getServerSideDatasource();
        params.api!.setGridOption("serverSideDatasource", dataSource);
    };

    const doubleClicked = (params: any) => {
        doubleClickEvent(params.data);
    };

    const handleRowSelectedChange = (params: any) => {
        const dataSelected = params.api.getSelectedRows();
        // console.log("Selected Row", dataSelected);
        onSelectionChanged(dataSelected);
    };

    const handleButtonExcelExport = useCallback(() => {
        if (gridRef.current?.api) {
            gridRef.current.api.exportDataAsExcel({
                fileName: "Receipt",
            });
        }
    }, []);

    const customNoRowsOverlayComponent = () => {
        return (
            <>
                {noRowsOverlayComponent && (
                    <div className="text-slate-500 font-bold text-xl">
                        No Data Available
                    </div>
                )}
            </>
        );
    };

    useEffect(() => {
        if (triggeringRefreshData !== "") {
            gridRef.current!.api!.refreshServerSide({ purge: true });
            gridRef.current!.api!.deselectAll();
        }
    }, [triggeringRefreshData]);

    // console.log("Trigger Refresh Data", triggeringRefreshData);

    return (
        // <div className="rounded-md shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-2.5">
        <>
            {buttonExcelExport && (
                <button
                    onClick={handleButtonExcelExport}
                    className="border border-gray-200 hover:bg-gray-200 font-bold text-sm px-3 py-2 mb-5 rounded-md"
                >
                    Export to Excel
                </button>
            )}
            <div className="flex flex-row items-center h-[100%]">
                {addButtonLabel && (
                    <div className="w-96">
                        <Button
                            className="text-sm w-full lg:w-1/2 font-semibold px-3 py-1.5 mb-4 md:col-span-2 text-white"
                            onClick={() => addButtonModalState()}
                        >
                            {addButtonLabel}
                        </Button>
                    </div>
                )}
                <div className="w-full h-[100%] overflow-x-auto ag-grid-table custom-scrollbar overflow-visible ag-theme-quartz">
                    <AgGridReact
                        ref={gridRef}
                        columnDefs={colDefs}
                        getRowStyle={(params: any) => {
                            if (params.node.rowIndex % 2 !== 0) {
                                return {
                                    background: "#fafafb",
                                };
                            }
                        }}
                        suppressServerSideFullWidthLoadingRow={true}
                        pagination={true}
                        paginationPageSize={10}
                        // paginationAutoPageSize={true}
                        cacheBlockSize={10}
                        paginationPageSizeSelector={[1, 10, 25, 50, 100]}
                        onGridReady={onGridReady}
                        rowModelType="serverSide"
                        onRowDoubleClicked={doubleClicked}
                        rowHeight={rowHeight}
                        rowSelection={rowSelection}
                        onSelectionChanged={handleRowSelectedChange}
                        suppressRowClickSelection={suppressRowClickSelection}
                        suppressCsvExport={suppressCsvExport}
                        noRowsOverlayComponent={customNoRowsOverlayComponent}
                    />
                </div>
            </div>
        </>
        // </div>
    );
}
