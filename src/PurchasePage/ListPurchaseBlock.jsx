import { useState } from "react";
import "./listPurchaseBlock.css";
import ListPurchaseComponent from "./ListPurchaseComponent.jsx";



const ListPurchaseBlock = (
    {createPurchase, setCreatePurchase}
) => {
    const [search, setSearch] = useState('');
    const [cheked, setCheced] = useState(false);

    return (
        <>
            <div className="list-purchase-block__form-block">
                <input 
                
                    className={createPurchase?"form-control lp-form-block__input" :"form-control lp-form-block__input mr-10"}
                    type="text" 
                    placeholder="Поиск закупки по идентификатору" 
                    aria-label="purchaseId"
                    value={search}
                    onChange={(e)=>{
                        setCreatePurchase(false);
                        setSearch(e.target.value);
                    }}
                />  
                {!createPurchase?
                    <button 
                        type="button" 
                        className="btn btn-outline-secondary lp-form-block__button" 
                        onClick={()=>{setCreatePurchase(true)}}
                    >
                        Создать закупку
                    </button>
                :""}
            </div>
            <div className="list-purchase-block__list-block">
                <ul className="list-purchase">
                    <li className="list-purchase__item">
                        <div className="lp-item__context-block">
                            <div className="lp-item__check">
                            <input 
                                type="checkbox" 
                                className="form-check-input"
                            />
                            </div>
                            <div className="lp-item__purchaseId">Идентификатор</div>
                            <div className="lp-item__purchaseName">Наименование закупки</div>
                            <div className="lp-item__purchasePrice">92 500 444 р.</div>
                            <div className="lp-item__purchaseName">Заказчик</div>
                        </div>
                        <button className=" btn btn-outline-warning lp-item__purchaseSave">Сохранить изменения</button>
                    </li>
                </ul>
            </div>
            <ListPurchaseComponent />
        </> 
    );
};

export default ListPurchaseBlock;