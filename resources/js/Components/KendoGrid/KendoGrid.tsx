import { useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { PropsWithChildren, useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import Button from "../Button/Button";
import {
    Grid,
    GridColumn as Column,
    GridDataStateChangeEvent,
} from "@progress/kendo-react-grid";
import "@progress/kendo-theme-default/dist/all.css";
import axios from "axios";
import { DataResult, process, State } from "@progress/kendo-data-query";
// import "../../../css/style.css";

export default function KendoGrid({
    dataResult,
}: PropsWithChildren<{ dataResult: any }>) {
    // const dataResult = [
    //     {
    //         ProductID: 1,
    //         ProductName: "Chai",
    //         SupplierID: 1,
    //         CategoryID: 1,
    //         QuantityPerUnit: "10 boxes x 20 bags",
    //         UnitPrice: 18.0,
    //         UnitsInStock: 39,
    //         UnitsOnOrder: 0,
    //         ReorderLevel: 10,
    //         Discontinued: false,
    //         Category: {
    //             CategoryID: 1,
    //             CategoryName: "Beverages",
    //             Description: "Soft drinks, coffees, teas, beers, and ales",
    //         },
    //     },
    //     {
    //         ProductID: 2,
    //         ProductName: "Chang",
    //         SupplierID: 1,
    //         CategoryID: 1,
    //         QuantityPerUnit: "24 - 12 oz bottles",
    //         UnitPrice: 19.0,
    //         UnitsInStock: 17,
    //         UnitsOnOrder: 40,
    //         ReorderLevel: 25,
    //         Discontinued: false,
    //         Category: {
    //             CategoryID: 1,
    //             CategoryName: "Beverages",
    //             Description: "Soft drinks, coffees, teas, beers, and ales",
    //         },
    //     },
    //     {
    //         ProductID: 3,
    //         ProductName: "Aniseed Syrup",
    //         SupplierID: 1,
    //         CategoryID: 2,
    //         QuantityPerUnit: "12 - 550 ml bottles",
    //         UnitPrice: 10.0,
    //         UnitsInStock: 13,
    //         UnitsOnOrder: 70,
    //         ReorderLevel: 25,
    //         Discontinued: false,
    //         Category: {
    //             CategoryID: 2,
    //             CategoryName: "Condiments",
    //             Description:
    //                 "Sweet and savory sauces, relishes, spreads, and seasonings",
    //         },
    //     },
    //     {
    //         ProductID: 4,
    //         ProductName: "Chef Anton's Cajun Seasoning",
    //         SupplierID: 2,
    //         CategoryID: 2,
    //         QuantityPerUnit: "48 - 6 oz jars",
    //         UnitPrice: 22.0,
    //         UnitsInStock: 53,
    //         UnitsOnOrder: 0,
    //         ReorderLevel: 0,
    //         Discontinued: false,
    //         Category: {
    //             CategoryID: 2,
    //             CategoryName: "Condiments",
    //             Description:
    //                 "Sweet and savory sauces, relishes, spreads, and seasonings",
    //         },
    //     },
    //     {
    //         ProductID: 5,
    //         ProductName: "Chef Anton's Gumbo Mix",
    //         SupplierID: 2,
    //         CategoryID: 2,
    //         QuantityPerUnit: "36 boxes",
    //         UnitPrice: 21.35,
    //         UnitsInStock: 0,
    //         UnitsOnOrder: 0,
    //         ReorderLevel: 0,
    //         Discontinued: true,
    //         Category: {
    //             CategoryID: 2,
    //             CategoryName: "Condiments",
    //             Description:
    //                 "Sweet and savory sauces, relishes, spreads, and seasonings",
    //         },
    //     },
    //     {
    //         ProductID: 6,
    //         ProductName: "Grandma's Boysenberry Spread",
    //         SupplierID: 3,
    //         CategoryID: 2,
    //         QuantityPerUnit: "12 - 8 oz jars",
    //         UnitPrice: 25.0,
    //         UnitsInStock: 120,
    //         UnitsOnOrder: 0,
    //         ReorderLevel: 25,
    //         Discontinued: false,
    //         Category: {
    //             CategoryID: 2,
    //             CategoryName: "Condiments",
    //             Description:
    //                 "Sweet and savory sauces, relishes, spreads, and seasonings",
    //         },
    //     },
    //     {
    //         ProductID: 7,
    //         ProductName: "Uncle Bob's Organic Dried Pears",
    //         SupplierID: 3,
    //         CategoryID: 7,
    //         QuantityPerUnit: "12 - 1 lb pkgs.",
    //         UnitPrice: 30.0,
    //         UnitsInStock: 15,
    //         UnitsOnOrder: 0,
    //         ReorderLevel: 10,
    //         Discontinued: false,
    //         Category: {
    //             CategoryID: 7,
    //             CategoryName: "Produce",
    //             Description: "Dried fruit and bean curd",
    //         },
    //     },
    //     {
    //         ProductID: 8,
    //         ProductName: "Northwoods Cranberry Sauce",
    //         SupplierID: 3,
    //         CategoryID: 2,
    //         QuantityPerUnit: "12 - 12 oz jars",
    //         UnitPrice: 40.0,
    //         UnitsInStock: 6,
    //         UnitsOnOrder: 0,
    //         ReorderLevel: 0,
    //         Discontinued: false,
    //         Category: {
    //             CategoryID: 2,
    //             CategoryName: "Condiments",
    //             Description:
    //                 "Sweet and savory sauces, relishes, spreads, and seasonings",
    //         },
    //     },
    //     {
    //         ProductID: 9,
    //         ProductName: "Mishi Kobe Niku",
    //         SupplierID: 4,
    //         CategoryID: 6,
    //         QuantityPerUnit: "18 - 500 g pkgs.",
    //         UnitPrice: 97.0,
    //         UnitsInStock: 29,
    //         UnitsOnOrder: 0,
    //         ReorderLevel: 0,
    //         Discontinued: true,
    //         Category: {
    //             CategoryID: 6,
    //             CategoryName: "Meat/Poultry",
    //             Description: "Prepared meats",
    //         },
    //     },
    // ];

    // State for Grid
    const [dataState, setDataState] = useState<State>({
        skip: 0,
        take: 10,
        sort: [],
        filter: undefined,
    });
    // Proses data dengan pagination
    const processedData = process(dataResult, dataState);

    const [gridData, setGridData] = useState<any>(dataResult);
    // Handler for data state changes (pagination, sorting, filtering)
    const onDataStateChange = (e: GridDataStateChangeEvent) => {
        setDataState(e.dataState);
    };
    const handleRowDoubleClick = (event: any) => {
        console.log(event.dataItem.COMPANY_NAME);
        // const dataItem = event.dataItem; // Access the data item for the row
        // alert(dataItem); // Replace with your action
    };

    return (
        <>
            <div className="ag-grid-layouts">
                <Grid
                    data={processedData.data}
                    {...dataState}
                    skip={dataState.skip} // Posisi item yang dilewatkan
                    take={dataState.take} // Jumlah item per halaman
                    total={processedData.total} // Total jumlah data untuk pagination
                    sortable={true} // Mengaktifkan sorting
                    filterable={true} // Mengaktifkan filtering
                    pageable={{
                        // Konfigurasi pagination
                        buttonCount: 10, // Jumlah tombol page yang ditampilkan
                        info: true, // Menampilkan informasi page (seperti: "Page 1 of 4")
                        type: "numeric", // Tipe pagination (bisa juga 'input' untuk input langsung)
                        pageSizes: [5, 10, 20], // Pilihan jumlah item per halaman
                        previousNext: true, // Menampilkan tombol next dan previous
                    }}
                    onDataStateChange={onDataStateChange}
                    style={{ height: "420px" }}
                    onRowDoubleClick={handleRowDoubleClick}
                >
                    <Column
                        title="No"
                        cell={(props: any) => {
                            const { dataIndex, page, pageSize } = props;
                            return <td>{dataIndex + 1}</td>;
                        }}
                        width="50px"
                        filterable={false}
                    />
                    <Column
                        field="COMPANY_ALIAS"
                        title="Name Company"
                        filter="text"
                    />
                </Grid>
            </div>
        </>
    );
}
