import { useState } from "react";
import "./listPurchaseComponent.css";



const ListPurchaseComponent = (
    {purchaseItem}
) => {

 

    return (
        <>
            <table className="table">
                <thead className="table-borderless__theder">
                    <tr>
                        <th scope="col"></th>
                        <th scope="col">Артикул</th>
                        <th scope="col">Наименование</th>
                        <th scope="col">Кол-во</th>
                        <th scope="col">Цена</th>
                        <th scope="col">Стоимость</th>
                        <th scope="col">Поставщик</th>
                    </tr>
                </thead>
                <tbody>
                   {purchaseItem.map((item)=>{
                        return(
                                <>
                                    <tr>
                                        <td>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                            />
                                        </td>
                                        <td>{item.vendorCodeComponent}</td>
                                        <td>{item.nameComponent}</td>
                                        <td>{item.requiredQuantityItem}</td>
                                        <td>{Intl.NumberFormat("ru").format(item.purchaseItemPrice)}</td>
                                        <td>{Intl.NumberFormat("ru").format(Number(item.requiredQuantityItem) * Number(item.purchaseItemPrice))}</td>
                                        <td>{item.bestComponentProvider}</td>
                                    </tr>
                                </>
                            );
                    })}
                        
                  
                </tbody>
            </table>
        </>
    );
};

export default ListPurchaseComponent;