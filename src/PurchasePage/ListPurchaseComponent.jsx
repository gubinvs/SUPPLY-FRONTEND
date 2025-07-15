import { useState, useEffect } from "react";
import "./listPurchaseComponent.css";
import LpsTableItemEdit from "./PurchasePageElement/LpsTableItemEdit.jsx";
import { useRoleId } from "../js/Utilits/roleId.js";
import AddItemPurchase from "./PurchasePageElement/AddItemPurchase.jsx";

const ListPurchaseComponent = (
    { components, purchase, setPurchase, purchasePrice, setPurchasePrice }
) => {
    // состояни роли пользователя в системе
    const { roleUser} = useRoleId();

    // Индексация закупок и номенклатуры
    const indexedItems = [];
    (purchase ?? []).forEach((p, purchaseIndex) => {
        (p?.purchaseItem ?? []).forEach((item, itemIndex) => {
            indexedItems.push({
                purchaseIndex,
                itemIndex,
                item,
                purchaseId: p.purchaseId,
            });
        });
    });

    // Состояния checkbox'ов и количеств
    const [checkedRows, setCheckedRows] = useState({});
    const [quantities, setQuantities] = useState(
        Object.fromEntries(
            indexedItems.map((entry, i) => [i, entry.item.requiredQuantityItem])
        )
    );

    // Обработка переключения чекбокса
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
    };

    // Обновление количеств при изменении `purchase`
    useEffect(() => {
        setQuantities(
            Object.fromEntries(
                indexedItems.map((entry, i) => [i, entry.item.requiredQuantityItem])
            )
        );
    }, [purchase]);

    // Удаление номенклатуры из закупки
    const deletePurchaseItem = (purchaseGuid, componentGuid, purchasePriceItem) => {
        setPurchase(prev =>
            prev.map(p =>
                p.guidIdPurchase === purchaseGuid
                ? {
                    ...p,
                    purchaseItem: p.purchaseItem.filter(item => item.guidIdComponent !== componentGuid)
                }
                : p
            )
        );
        // Вычитаем общую стоимость удаленной номенклатуры
        setPurchasePrice(purchasePrice-purchasePriceItem);
    };

console.log(purchase);
    return (
        <>
            <AddItemPurchase
                components={components}
                purchase={purchase}
                setPurchase={setPurchase}
            />
            <table className="table">
                <thead className="table-borderless__theder">
                    <tr>
                        <th scope="col"></th>
                        <th scope="col">Артикул</th>
                        <th scope="col">Наименование</th>
                        <th scope="col" className="lpc-item__quantity">Кол-во</th>
                        <th scope="col" className="lpc-item__price">Цена</th>
                        <th scope="col" className="lpc-item__price">Стоимость</th>
                        <th scope="col">Доставка</th>
                        <th scope="col">Поставщик</th>
                    </tr>
                </thead>
                <tbody>
                    {indexedItems.map(({ item }, index) => {
                        const isChecked = checkedRows[index];
                        const quantity = quantities[index];
                        // Общая стоимость с учетом количества элементов
                        const purchasePriceItem = quantity*item.purchaseItemPrice;
                    
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
                                        index={index}
                                        quantity={quantity}
                                        setPurchasePrice={setPurchasePrice}
                                        vendorCodeComponent={item.vendorCodeComponent}
                                        nameComponent={item.nameComponent}
                                        purchaseItemPrice={item.purchaseItemPrice}
                                        bestComponentProvider={item.bestComponentProvider}
                                        deliveryTimeComponent={item.deliveryTimeComponent}
                                        otherOffers={item.otherOffers}
                                        onQuantityChange={handleQuantityChange}
                                    />
                                ) : (
                                    <>
                                        <td>{item.vendorCodeComponent}</td>
                                        <td>{item.nameComponent}</td>
                                        <td className="lpc-item__quantity">{quantity}</td>
                                        <td className="lpc-item__price">
                                            {Intl.NumberFormat("ru").format(item.purchaseItemPrice)}
                                        </td>
                                        <td className="lpc-item__price">
                                            {Intl.NumberFormat("ru").format(Number(purchasePriceItem))}
                                        </td>
                                        <td className="lpc-item__price">
                                            {item.deliveryTimeComponent}
                                        </td>
                                        {!roleUser?
                                            <>
                                                <td className="lpc-item__provider">
                                                    {item.bestComponentProvider}
                                                    <button 
                                                        className="lpc-item__button-delete" 
                                                        onClick={()=>deletePurchaseItem(item.guidIdPurchase, item.guidIdComponent, purchasePriceItem)}
                                                    >X</button>
                                                </td>
                                            </>:
                                            <>
                                            <td className="lpc-item__provider">
                                                    <span className="lpc-item__provider_select_ban">по подписке</span>
                                                    <button 
                                                        className="lpc-item__button-delete"
                                                        onClick={()=>deletePurchaseItem(item.guidIdPurchase, item.guidIdComponent, purchasePriceItem)}
                                                    >X</button>
                                                </td>
                                            </>}
                                    </>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    );
};

export default ListPurchaseComponent;
