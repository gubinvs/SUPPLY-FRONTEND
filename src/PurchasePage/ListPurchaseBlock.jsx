import { useState } from "react";
import "./listPurchaseBlock.css";



const ListPurchaseBlock = (
    {createPurchase, setCreatePurchase}
) => {
    const [search, setSearch]= useState('');

    return (
        <>
            <div className="list-purchase-block__form-block">
                <input 
                    className="form-control lp-form-block__input" 
                    type="text" 
                    placeholder="Поиск закупки по идентификатору" 
                    aria-label="purchaseId"
                    value={search}
                    onChange={(e)=>{
                        setCreatePurchase(false);
                        setSearch(e.target.value);
                    }}
                />  
                {!createPurchase?<button type="button" className="btn btn-outline-secondary lp-form-block__button" onClick={()=>{setCreatePurchase(true)}}>Создать закупку</button>:""}
            </div>
            </>
    );
};

export default ListPurchaseBlock;