import { useEffect, useState } from "react";
import "./listPurchaseBlock.css";
import ApiUrl from "../js/ApiUrl";
import ListPurchaseComponent from "./ListPurchaseComponent.jsx";

const ListPurchaseBlock = (
    { components, createPurchase, setCreatePurchase, purchase, setPurchase}
) => {
    const [search, setSearch] = useState('');
    const [checkedPurchaseId, setCheckedPurchaseId] = useState(null);
    // Достаем guidIdCollaborator
    const guidIdCollaborator = localStorage.getItem("guidIdCollaborator");
    // Общая стоимость закупки
    const [purchasePrice, setPurchasePrice] = useState(
        Array.isArray(purchase) && purchase.length > 0 && purchase[0].purchasePrice
            ? purchase[0].purchasePrice
            : 0
        );

    const handleCheck = (purchaseId) => {
        setCheckedPurchaseId(prev =>
            prev === purchaseId ? null : purchaseId
        );
    };


    // Обновляем цену закупки в массиве при ее изменении
    useEffect(() => {
        if (purchase.length > 0) {
            purchase[0].purchasePrice = purchasePrice;
        }
    }, [purchasePrice, purchase]);


    // Запрос на схранение данных о составе номенклатуры в закупке в базе данных
    const requestAddItemPurchaseData = () => {
       const i = purchase[0]; // первый объект

        const requestData = {
            guidIdCollaborator: guidIdCollaborator,
            guidIdPurchase: i.guidIdPurchase,
            purchaseId: i.purchaseId,
            purchaseName: i.purchaseName,
            purchasePrice: i.purchasePrice,
            purchaseCostomer: i.purchaseCostomer,
            purchaseItem: i.purchaseItem.map(x => ({
                guidIdComponent: x.guidIdComponent,
                vendorCodeComponent: x.vendorCodeComponent,
                nameComponent: x.nameComponent,
                requiredQuantityItem: x.requiredQuantityItem,
                purchaseItemPrice: x.purchaseItemPrice,
                bestComponentProvider: x.bestComponentProvider,
                deliveryTimeComponent: x.deliveryTimeComponent
            }))
        };

        const jsonData = JSON.stringify(requestData)


        fetch(ApiUrl + "/api/SaveSupplyPurchase", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: jsonData
        })
        .then((response) => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            alert("Данные успешно записаны!");
            return response.json();
        })
        .catch((error) => {
            console.error("Ошибка при отправке данных:", error);
            alert("Ошибка при сохранении данных!");
        });
    };


    return (
        <>
            <div className="list-purchase-block__form-block">
                <input
                    className={createPurchase ? "form-control lp-form-block__input" : "form-control lp-form-block__input mr-10"}
                    type="text"
                    placeholder="Поиск закупки по идентификатору"
                    aria-label="purchaseId"
                    value={search}
                    onChange={(e) => {
                        setCreatePurchase(false);
                        setSearch(e.target.value);
                    }}
                />
                {!createPurchase && (
                    <button
                        type="button"
                        className="btn btn-outline-secondary lp-form-block__button"
                        onClick={() => setCreatePurchase(true)}
                    >
                        Создать закупку
                    </button>
                )}
            </div>

            <div className="list-purchase-block__list-block">
                <ul className="list-purchase">
                    {purchase.map((item) => (
                        <li key={item.purchaseId} className="list-purchase__item">
                            <div className="lp-item__context-block">
                                <div className="lp-item__check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={checkedPurchaseId === item.purchaseId}
                                        onChange={() => handleCheck(item.purchaseId)}
                                    />
                                </div>
                                <div className="lp-item__purchase-id">{item.purchaseId}</div>
                                <div className="lp-item__purchase-name">{item.purchaseName}</div>
                                <div className="lp-item__purchase-price">
                                    {purchasePrice? Intl.NumberFormat("ru").format(purchasePrice):"нет данных"} р.
                                </div>
                                <div className="lp-item__purchase-name-costomer">{item.purchaseCostomer}</div>
                                
                            </div>
                            <div className="lp-item__purchase__icon-groop">
                                <img className="lpip-icon-groop__edit" src="../images/edit-icon.svg" alt="Иконка редактировать" />
                                <img className="lpip-icon-groop__share" src="../images/share-icon.svg" alt="Иконка поделиться" />
                                <img 
                                    className="lpip-icon-groop__save" 
                                    src="../images/save-icon.svg" 
                                    alt="Иконка сохранить изменения" 
                                    onClick={()=> requestAddItemPurchaseData()}
                                />
                            </div>
                        </li>
                    ))}
                </ul>

                {/* Показываем компонент, если какая-то закупка выбрана */}
                {checkedPurchaseId !== null && (
                    <ListPurchaseComponent 
                        components={components}
                        purchase={purchase} 
                        setPurchase={setPurchase}
                        purchasePrice={purchasePrice}
                        setPurchasePrice={setPurchasePrice}
                        requestAddItemPurchaseData={requestAddItemPurchaseData}
                    />
                )}
            </div>
        </>
    );
};

export default ListPurchaseBlock;
