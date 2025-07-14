
import { useState } from "react";
import "./addItemPurchase.css"


// Блок с формой выбора номенклатуры для добавления ее в закупку
const AddItemPurchase = (
    {components}
) => {

    // Отфильтрованные данные о номенклатуре на основании соответствия введенных данных в input
    const [selectedComponents, setSelectedComponents] = useState([]);
    // Состояние блока выдачи результата поискового запроса
    const [resultSearch, setResultSearch] = useState(true)


    return(
        <>
            <div className="add-item-purchase-section">
                <div className="add-item-purchase__form-block">
                    <input className="form-control aip-block__input" type="text" placeholder="Добавить номенклатуру" aria-label="default input example" /> 
                    <button type="button" className="btn btn-outline-secondary aip-block__button">Обновить цены</button> 
                    <button className="btn btn-outline-success aip-block__purchase-save">Сохранить изменения</button>
                </div>
                {resultSearch?
                <>
                    <div className="add-item-purchase__result-search"></div>
                </>
                :""}
            </div>
            
        </>
    );

};

export default AddItemPurchase;