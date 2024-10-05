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

export default function KendoGrid({}: PropsWithChildren<{}>) {
    const users = [
        {
            ProductID: 1,
            ProductName: "Chai",
            SupplierID: 1,
            CategoryID: 1,
            QuantityPerUnit: "10 boxes x 20 bags",
            UnitPrice: 18.0,
            UnitsInStock: 39,
            UnitsOnOrder: 0,
            ReorderLevel: 10,
            Discontinued: false,
            Category: {
                CategoryID: 1,
                CategoryName: "Beverages",
                Description: "Soft drinks, coffees, teas, beers, and ales",
            },
        },
        {
            ProductID: 2,
            ProductName: "Chang",
            SupplierID: 1,
            CategoryID: 1,
            QuantityPerUnit: "24 - 12 oz bottles",
            UnitPrice: 19.0,
            UnitsInStock: 17,
            UnitsOnOrder: 40,
            ReorderLevel: 25,
            Discontinued: false,
            Category: {
                CategoryID: 1,
                CategoryName: "Beverages",
                Description: "Soft drinks, coffees, teas, beers, and ales",
            },
        },
        {
            ProductID: 3,
            ProductName: "Aniseed Syrup",
            SupplierID: 1,
            CategoryID: 2,
            QuantityPerUnit: "12 - 550 ml bottles",
            UnitPrice: 10.0,
            UnitsInStock: 13,
            UnitsOnOrder: 70,
            ReorderLevel: 25,
            Discontinued: false,
            Category: {
                CategoryID: 2,
                CategoryName: "Condiments",
                Description:
                    "Sweet and savory sauces, relishes, spreads, and seasonings",
            },
        },
        {
            ProductID: 4,
            ProductName: "Chef Anton's Cajun Seasoning",
            SupplierID: 2,
            CategoryID: 2,
            QuantityPerUnit: "48 - 6 oz jars",
            UnitPrice: 22.0,
            UnitsInStock: 53,
            UnitsOnOrder: 0,
            ReorderLevel: 0,
            Discontinued: false,
            Category: {
                CategoryID: 2,
                CategoryName: "Condiments",
                Description:
                    "Sweet and savory sauces, relishes, spreads, and seasonings",
            },
        },
        {
            ProductID: 5,
            ProductName: "Chef Anton's Gumbo Mix",
            SupplierID: 2,
            CategoryID: 2,
            QuantityPerUnit: "36 boxes",
            UnitPrice: 21.35,
            UnitsInStock: 0,
            UnitsOnOrder: 0,
            ReorderLevel: 0,
            Discontinued: true,
            Category: {
                CategoryID: 2,
                CategoryName: "Condiments",
                Description:
                    "Sweet and savory sauces, relishes, spreads, and seasonings",
            },
        },
        {
            ProductID: 6,
            ProductName: "Grandma's Boysenberry Spread",
            SupplierID: 3,
            CategoryID: 2,
            QuantityPerUnit: "12 - 8 oz jars",
            UnitPrice: 25.0,
            UnitsInStock: 120,
            UnitsOnOrder: 0,
            ReorderLevel: 25,
            Discontinued: false,
            Category: {
                CategoryID: 2,
                CategoryName: "Condiments",
                Description:
                    "Sweet and savory sauces, relishes, spreads, and seasonings",
            },
        },
        {
            ProductID: 7,
            ProductName: "Uncle Bob's Organic Dried Pears",
            SupplierID: 3,
            CategoryID: 7,
            QuantityPerUnit: "12 - 1 lb pkgs.",
            UnitPrice: 30.0,
            UnitsInStock: 15,
            UnitsOnOrder: 0,
            ReorderLevel: 10,
            Discontinued: false,
            Category: {
                CategoryID: 7,
                CategoryName: "Produce",
                Description: "Dried fruit and bean curd",
            },
        },
        {
            ProductID: 8,
            ProductName: "Northwoods Cranberry Sauce",
            SupplierID: 3,
            CategoryID: 2,
            QuantityPerUnit: "12 - 12 oz jars",
            UnitPrice: 40.0,
            UnitsInStock: 6,
            UnitsOnOrder: 0,
            ReorderLevel: 0,
            Discontinued: false,
            Category: {
                CategoryID: 2,
                CategoryName: "Condiments",
                Description:
                    "Sweet and savory sauces, relishes, spreads, and seasonings",
            },
        },
        {
            ProductID: 9,
            ProductName: "Mishi Kobe Niku",
            SupplierID: 4,
            CategoryID: 6,
            QuantityPerUnit: "18 - 500 g pkgs.",
            UnitPrice: 97.0,
            UnitsInStock: 29,
            UnitsOnOrder: 0,
            ReorderLevel: 0,
            Discontinued: true,
            Category: {
                CategoryID: 6,
                CategoryName: "Meat/Poultry",
                Description: "Prepared meats",
            },
        },
    ];

    const initialDataState = {
        take: 10,
        skip: 0,
        filter: undefined,
        sort: undefined,
    };

    const [page, setPage] = useState(initialDataState);
    const [scrollable, setScrollable] = useState<any>(
        initialDataState.take > 10 ? "scrollable" : "none"
    );
    const [dataState, setDataState] = useState<State>(initialDataState);

    const handleDataStateChange = (event: GridDataStateChangeEvent) => {
        setDataState(event.dataState);
    };

    const pageChange = (event: any) => {
        setPage(event.page);
        event.page.take > 10
            ? setScrollable("scrollable")
            : setScrollable("none");
    };
    return (
        <>
            <div className="ag-grid-layouts">
                <Grid
                    data={users.slice(page.skip, page.take + page.skip)}
                    skip={page.skip}
                    take={page.take}
                    total={users.length}
                    style={{
                        height: "calc(100vh - 4rem - 40px - 16px - 5.1rem)",
                    }}
                    // scrollable={scrollable}
                    pageable={{
                        buttonCount: 5,
                        info: true,
                        type: "numeric",
                        pageSizes: true,
                        previousNext: true,
                    }}
                    onPageChange={pageChange}
                >
                    <Column
                        field="ProductID"
                        title="No"
                        columnMenu={(props) => ""}
                    />
                    <Column field="ProductName" title="Name Relation" />
                    <Column field="UnitPrice" title="Umur" />
                    <Column field="ProductName" title="Alamat" />
                </Grid>
            </div>
        </>
    );
}
