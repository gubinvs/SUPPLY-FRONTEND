import "./createPurchaseBlock.css";

// Компонент вводит форму добавления наименования новой закупки
const CreatePurchaseBlock = (
    {createPurchase, setCreatePurchase}
) => {

    // Создаем новую закупку
    const addPurchase = () => {
        // Убираем форму с экрана
        setCreatePurchase(false);

    };


    return (
        <>
            <div className="purchase-page__create-purchase-block">
                <h6 className="create-purchase-block__title">Создайте новую закупку:</h6>
                <input className="form-control create-purchase-block__create-form-purchaseId" type="text" placeholder="Идентификатор новой закупки" aria-label="purchaseId"/>
                <button type="button" className="btn btn-outline-secondary create-purchase-block__create-form-button" onClick={()=>addPurchase()}>Записать</button>
            </div>
        </>
    );

};

export default CreatePurchaseBlock;