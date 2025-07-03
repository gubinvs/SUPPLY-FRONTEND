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
                            <div className="lp-item__purchase-id">DG12-002 шэу-сэу-01щ</div>
                            <div className="lp-item__purchase-name">Наименование закупки mmmmmmmmmm mmmmmmmm mmmmmmmmm .lfgllvlr</div>
                            <div className="lp-item__purchase-price">92 500 444 р.</div>
                            <div className="lp-item__purchase-name-costomer">Компания заказчик</div>
                        </div>
                        <button className="btn btn-outline-warning lp-item__purchase-save">Сохранить изменения</button>
                    </li>
                </ul>
            </div>
            <ListPurchaseComponent />
        </> 
    );
};

export default ListPurchaseBlock;