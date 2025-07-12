
import "./addItemPurchase.css"


// Блок с формой выбора номенклатуры для добавления ее в закупку
const AddItemPurchase = () => {


    return(
        <>
            <div className="add-item-purchase-block">
                <input className="form-control aip-block__input" type="text" placeholder="Добавить номенклатуру" aria-label="default input example" /> 
                <button type="button" className="btn btn-outline-secondary aip-block__button">Обновить цены</button> 
                  <button className="btn btn-outline-success aip-block__purchase-save">Сохранить изменения</button>
            </div>
        </>
    );

};

export default AddItemPurchase;