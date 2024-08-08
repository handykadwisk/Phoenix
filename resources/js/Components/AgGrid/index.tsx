import { useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { PropsWithChildren, useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import Button from "../Button/Button";
import { GridReadyEvent, IServerSideDatasource } from "ag-grid-community";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import axios from "axios";
// import "../../../css/style.css";

export default function AGGrid({
    colDefs,
    addButtonLabel,
    url,
    // loading,
    withParam,
    triggeringRefreshData,
    doubleClickEvent = () => {},
    addButtonModalState = () => {},
}: PropsWithChildren<{
    colDefs: any;
    url: string;
    addButtonLabel: string | null | undefined;
    // loading: boolean;
    withParam: number | string | null;
    triggeringRefreshData: string;
    doubleClickEvent: CallableFunction | undefined;
    addButtonModalState: CallableFunction | undefined;
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
                    }
                }

                let urlNew: any = "";

                if (withParam !== "") {
                    urlNew = `${url}?id=${withParam}`;
                } else if (withParam === "") {
                    urlNew = `${url}?`;
                }

                axios
                    .get(
                        `/${urlNew}page=${page}&perPage=${
                            endRow - startRow
                        }&sort=${sortParams}&filter=${JSON.stringify(
                            filterParams
                        )}`
                    )
                    .then((res) => {
                        params.success({
                            rowData: res.data.data,
                            rowCount: res.data.total,
                        });
                    })
                    .catch((err) => console.log(err));
            },
        };
    };

    const onGridReady = (params: GridReadyEvent<any, any>) => {
        var dataSource = getServerSideDatasource();
        params.api!.setGridOption("serverSideDatasource", dataSource);
        // params.api!.sizeColumnsToFit()
    };

    const doubleClicked = (params: any) => {
        doubleClickEvent(params.data);
    };

    useEffect(() => {
        if (triggeringRefreshData !== "") {
            gridRef.current!.api!.refreshServerSide({ purge: true });
        }
    }, [triggeringRefreshData, gridRef]);

    return (
        <div className="rounded-md border border-stroke bg-white px-5 py-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-2.5">
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
            <div
                className="ag-theme-quartz"
                style={{ height: 400, width: "100%" }}
            >
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
                    pagination={true}
                    paginationPageSize={10}
                    cacheBlockSize={10}
                    paginationPageSizeSelector={[1, 10, 25, 50, 100]}
                    onGridReady={onGridReady}
                    rowModelType="serverSide"
                    onRowDoubleClicked={doubleClicked}
                />
            </div>
        </div>
    );
}
