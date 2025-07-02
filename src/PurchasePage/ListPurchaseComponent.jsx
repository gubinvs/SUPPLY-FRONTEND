import { useState } from "react";
import "./listPurchaseComponent.css";



const ListPurchaseComponent = () => {

 

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
                   
                        <tr>
                            <td>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                />
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                  
                </tbody>
            </table>
        </>
    );
};

export default ListPurchaseComponent;