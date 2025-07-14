import { useState } from "react";
import "./listPurchaseBlock.css";
import ListPurchaseComponent from "./ListPurchaseComponent.jsx";

const ListPurchaseBlock = (
    { components, createPurchase, setCreatePurchase, purchase, setPurchase}
) => {
    const [search, setSearch] = useState('');
    const [checkedPurchaseId, setCheckedPurchaseId] = useState(null);
    // Общая стоимость закупки
    const [purchasePrice, setPurchasePrice] = useState(purchase[0].purchasePrice || 0);

    const handleCheck = (purchaseId) => {
        setCheckedPurchaseId(prev =>
            prev === purchaseId ? null : purchaseId
        );
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
                                    {Intl.NumberFormat("ru").format(purchasePrice)} р.
                                </div>
                                <div className="lp-item__purchase-name-costomer">{item.purchaseCostomer}</div>
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
                    />
                )}
            </div>
        </>
    );
};

export default ListPurchaseBlock;
