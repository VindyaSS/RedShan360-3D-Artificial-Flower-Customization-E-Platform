import React from "react";
import "../../css/manager.css";

export default function MlowQuantityProductTable({
    t1 = "Product ID",
    t2 = "Product Name",
    t3 = "Quantity",
    t4 = "Price",
    lowStockProducts = []
}) {

    return (
        <table className="MPtable">

            <thead>
                <tr>
                    <th>{t1}</th>
                    <th>{t2}</th>
                    <th>{t3}</th>
                    <th>{t4}</th>
                </tr>
            </thead>

            <tbody>

                {lowStockProducts.length > 0 ? (

                    lowStockProducts.map((product) => (

                        <tr key={product.productId}>

                            <td>
                                {product.productId}
                            </td>

                            <td>
                                {product.productName}
                            </td>

                            <td>
                                {product.stockQuantity}
                            </td>

                            <td>
                                {product.price}
                            </td>

                        </tr>

                    ))

                ) : (

                    <tr>
                        <td
                            colSpan="4"
                            style={{
                                textAlign: "center",
                                padding: "20px"
                            }}
                        >
                            No low quantity products found.
                        </td>
                    </tr>

                )}

            </tbody>

        </table>
    );
}