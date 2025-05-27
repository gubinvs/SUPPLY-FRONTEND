import React, { useState, useEffect } from "react";
import ApiUrl from "../js/ApiUrl.js";
import "./EditPriceComponent.css";

const EditPriceComponent = () => {
    const [component, setComponent] = useState("s");

    return (
        <>
            <div className="container edit-price-component__container">
                {/* Форма для ввода данных об артикуле */}
                <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="Артикул" aria-label="Recipient’s username" aria-describedby="button-addon2" />
                    <button class="btn btn-outline-secondary" type="button" id="button-addon2">Найти</button>
                </div>
                {/* Форма для изменения данных */}
                {component==null ? "Нет данных" : 
                    // Если данные появились
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Артикул</th>
                                <th scope="col">Наименование</th>
                                <th scope="col">Цена</th>
                                <th scope="col">Срок поставки</th>
                                <th scope="col">Поставщик</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{component.vendorCodeComponent}LC1D32BD</td>
                                <td>{component.nameComponent}Пускатель магнитный 32А катушка управления 24В DС 1НО+1НЗ LC1D (LC1D32BD)</td>
                                <td>
                                    <input class="form-control" type="text" placeholder="Новая цена" aria-label=".form-control-sm example" />
                                </td>
                                <td>
                                     <input class="form-control" type="text" placeholder="Новый срок" aria-label=".form-control-sm example" />
                                </td>
                                <td>
                                    <select class="form-select" aria-label="Default select example">
                                        <option selected>Выбери поставщика</option>
                                        <option value="1">ООО "ПТЦ"</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </select>
                                </td>
                                <td><button type="button" class="btn btn-outline-success">Записать</button></td>
                            </tr>
                        </tbody>
                    </table>
                }
            </div>
            
            

        </>
    );
};

export default EditPriceComponent;