import { useState, useEffect, useMemo } from "react";
import "./listPurchaseComponent.css";
import LpsTableItemEdit from "./PurchasePageElement/LpsTableItemEdit.jsx";
import { useRoleId } from "../js/Utilits/roleId.js";
import AddItemPurchase from "./PurchasePageElement/AddItemPurchase.jsx";
import { changeProcurementStatusFalse } from "../js/Utilits/changeProcurementStatus.js";

const ListPurchaseComponent = ({
    count,
    components,
    profitability,
    purchase,
    setPurchase,
    purchaseState,
    setPurchaseState,
    setPurchasePrice
}) => {

    const { roleUser } = useRoleId();

    // Изначально устанавливаем статус закупки как "без изменений"
    useEffect(() => {
        const updatedPurchaseState = [...purchaseState];
        updatedPurchaseState[count] = true;
        setPurchaseState(updatedPurchaseState);
    }, [purchaseState, count, setPurchaseState]);

    // Заглушка для запроса счёта
    const requestInvoice = () => {
        console.log("Запрос счета отправлен");
    };

    // Индексация номенклатуры закупки
    const indexedItems = useMemo(() => {
        const p = purchase[count];
        const items = [];

        if (Array.isArray(p?.purchaseItem)) {
            p.purchaseItem.forEach((item, itemIndex) => {
                items.push({
                    purchaseIndex: count,
                    itemIndex,
                    item,
                    purchaseId: p.purchaseId,
                });
            });
        }

        return items;
    }, [purchase, count]);

    const [checkedRows, setCheckedRows] = useState({});
    const [quantities, setQuantities] = useState({});

    // Инициализация количества при монтировании или изменении
    useEffect(() => {
        const newQuantities = Object.fromEntries(
            indexedItems.map((entry, i) => [i, entry.item.requiredQuantityItem])
        );

        const isEqual = Object.keys(newQuantities).every(
            (key) => newQuantities[key] === quantities[key]
        );

        if (!isEqual) {
            setQuantities(newQuantities);
        }
    }, [indexedItems, quantities]);

    // Пересчёт общей стоимости
    useEffect(() => {
        const currentPurchase = purchase[count];

        if (!currentPurchase || !Array.isArray(currentPurchase.purchaseItem)) {
            setPurchasePrice(0);
            return;
        }

        const summa = currentPurchase.purchaseItem.reduce((acc, i) => {
            const qty = Number(i.requiredQuantityItem);
            const price = Number(i.purchaseItemPrice);

            if (isNaN(qty) || isNaN(price)) {
                console.warn("Некорректное значение:", i);
                return acc;
            }

            return acc + qty * price;
        }, 0);

        setPurchasePrice(summa);
    }, [purchase, count, setPurchasePrice]);

    // Обработка чекбокса
    const handleCheckboxChange = (index) => {
        setCheckedRows((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    // Обработка изменения количества
    const handleQuantityChange = (index, newQuantity) => {
        setQuantities((prev) => ({
            ...prev,
            [index]: newQuantity,
        }));

        changeProcurementStatusFalse(count, purchaseState, setPurchaseState);
    };

    // Удаление номенклатуры
    const deletePurchaseItem = (purchaseGuid, componentGuid) => {
        setPurchase((prev) =>
            prev.map((p) => {
                if (p.guidIdPurchase !== purchaseGuid) return p;

                const itemToDelete = p.purchaseItem.find(i => i.guidIdComponent === componentGuid);
                const priceToSubtract = itemToDelete
                    ? Number(itemToDelete.requiredQuantityItem) * Number(itemToDelete.purchaseItemPrice)
                    : 0;

                setPurchasePrice(prevPrice => prevPrice - priceToSubtract);

                changeProcurementStatusFalse(count, purchaseState, setPurchaseState);

                return {
                    ...p,
                    purchaseItem: p.purchaseItem.filter(i => i.guidIdComponent !== componentGuid),
                };
            })
        );
    };

    return (
        <>
            <AddItemPurchase
                count={count}
                components={components}
                purchase={purchase}
                setPurchase={setPurchase}
            />

            <table className="table list-purchase-component__table">
                <thead className="table-borderless__theder">
                    <tr>
                        <th scope="col" className="th-table-left"></th>
                        <th scope="col" className="lpc-item__article">Артикул</th>
                        <th scope="col" className="lpc-item__name">Наименование</th>
                        <th scope="col" className="lpc-item__quantity">Кол-во</th>
                        <th scope="col" className="lpc-item__price">Цена</th>
                        <th scope="col" className="lpc-item__price">Стоимость</th>
                        <th scope="col" className="lpc-item__delivery">Доставка</th>
                        {!roleUser && (
                            <th scope="col" className="lpc-item__provider">Поставщик</th>
                        )}
                        <th scope="col" className="th-table-right"></th>
                    </tr>
                </thead>

                <tbody>
                    {indexedItems.map(({ item }, index) => {
                        const adjustedPrice = roleUser
                            ? item.purchaseItemPrice * profitability
                            : item.purchaseItemPrice;

                        const isChecked = checkedRows[index];
                        const quantity = quantities[index] ?? item.requiredQuantityItem;
                        const purchasePriceItem = quantity * adjustedPrice;

                        return (
                            <tr key={`${item.guidIdPurchase}-${item.guidIdComponent}`}>
                                <td>
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={!!isChecked}
                                        onChange={() => handleCheckboxChange(index)}
                                    />
                                </td>

                                {isChecked ? (
                                    <LpsTableItemEdit
                                        count={count}
                                        index={index}
                                        quantity={quantity}
                                        purchaseState={purchaseState}
                                        setPurchaseState={setPurchaseState}
                                        setPurchasePrice={setPurchasePrice}
                                        vendorCodeComponent={item.vendorCodeComponent}
                                        nameComponent={item.nameComponent}
                                        purchaseItemPrice={item.purchaseItemPrice}
                                        bestComponentProvider={item.bestComponentProvider}
                                        deliveryTimeComponent={item.deliveryTimeComponent}
                                        purchase={purchase}
                                        setPurchase={setPurchase}
                                        otherOffers={item.otherOffers}
                                        onQuantityChange={handleQuantityChange}
                                    />
                                ) : (
                                    <>
                                        <td>{item.vendorCodeComponent}</td>
                                        <td>{item.nameComponent}</td>
                                        <td className="lpc-item__quantity">{quantity}</td>
                                        <td className="lpc-item__price">
                                            {Intl.NumberFormat("ru").format(adjustedPrice)}
                                        </td>
                                        <td className="lpc-item__price">
                                            {Intl.NumberFormat("ru").format(Number(purchasePriceItem))}
                                        </td>
                                        <td className="lpc-item__price">
                                            {item.deliveryTimeComponent}
                                        </td>
                                        {!roleUser && (
                                            <td className="lpc-item__provider">{item.bestComponentProvider}</td>
                                        )}
                                        <td>
                                            <button
                                                className="lpc-item__button-delete"
                                                onClick={() =>
                                                    deletePurchaseItem(
                                                        item.guidIdPurchase,
                                                        item.guidIdComponent
                                                    )
                                                }
                                            >
                                                X
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div className="change-procurement-button-block">
                {purchaseState[count] && (
                    <button
                        type="button"
                        className="btn btn-primary change-procurement-button"
                        onClick={requestInvoice}
                    >
                        Запросить счет
                    </button>
                )}
            </div>
        </>
    );
};

export default ListPurchaseComponent;