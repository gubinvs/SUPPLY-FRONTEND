
import { useState, useEffect } from "react";
import "./addItemPurchase.css"


// Блок с формой выбора номенклатуры для добавления ее в закупку
const AddItemPurchase = (
    {components}
) => {

    // Отфильтрованные данные о номенклатуре на основании соответствия введенных данных в input
    const [searchTerm, setSearchTerm] = useState("");
    // Состояние блока выдачи результата поискового запроса
    const [resultSearch, setResultSearch] = useState(true)
    // Начинаем выдавать данные для отображения на странице только после изменения (вводе данных в форму)
    const [filteredComponents, setFilteredComponents] = useState([]);
    useEffect(() => {
        const filtered = components.filter(item =>
            item.vendorCodeComponent?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.nameComponent?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 25); // Ограничение до ......;
        setFilteredComponents(filtered);
        if (filtered.length === 0) {
            setResultSearch(false)
        } else if (filtered.length > 0) {
             setResultSearch(true)
        }
    }, [searchTerm, components]);

    return(
        <>
            <div className="add-item-purchase-section">
                <div className="add-item-purchase__form-block">
                    <input className="form-control aip-block__input" type="text" placeholder="Добавить номенклатуру" aria-label="default input example" 
                            value={searchTerm}
                            onChange={(e) => {
                            setSearchTerm(e.target.value);
                        }}
                    /> 
                    <button type="button" className="btn btn-outline-secondary aip-block__button">Обновить цены</button> 
                    <button className="btn btn-outline-success aip-block__purchase-save">Сохранить изменения</button>
                </div>
                {resultSearch?
                <>
                    <div className="add-item-purchase__result-search">
                        <ul className="aip-result-search__list">
                            {filteredComponents.map((item)=>{
                                return(
                                    <>
                                        <li className="aip-result-search__item">
                                            <div className="aip-rs-item_vendor">{item.vendorCodeComponent}</div>
                                            <div className="aip-rs-item_name">{item.nameComponent}</div>
                                        </li> 
                                    </>
                                );
                            })}
                        </ul>
                    </div>
                </>
                :""}
            </div>
            
        </>
    );

};

export default AddItemPurchase;