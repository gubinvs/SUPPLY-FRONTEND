import { useState, useEffect, useRef } from "react";
import "./lpsTableItemEdit.css";
import { useRoleId } from "../../js/Utilits/roleId.js";
import { changeProcurementStatusFalse } from "../../js/Utilits/changeProcurementStatus.js";

const LpsTableItemEdit = ({
    count,
    index,
    quantity,
    purchaseState,
    setPurchaseState,
    setPurchasePrice,
    vendorCodeComponent,
    nameComponent,
    purchaseItemPrice,
    bestComponentProvider,
    deliveryTimeComponent,
    purchase,
    setPurchase,
    otherOffers,
    onQuantityChange
}) => {
    const { roleUser } = useRoleId();
    const countItem = count;

    // Локальные состояния
    const [localQuantity, setLocalQuantity] = useState(quantity);
    const [itemPrice, setItemPrice] = useState(purchaseItemPrice);
    const [itemDeliveryTime, setItemDeliveryTime] = useState(deliveryTimeComponent);
    const [itemBestComponentProvider, setItemBestComponentProvider] = useState(bestComponentProvider);

    const [sumPriceItem, setSumPriceItem] = useState(quantity * purchaseItemPrice);

    // Храним предыдущую сумму позиции
    const prevSumPriceItemRef = useRef(sumPriceItem);

    // Обновление общей суммы закупки при изменении количества или цены
    useEffect(() => {
        const newSum = localQuantity * itemPrice;

        const diff = newSum - prevSumPriceItemRef.current;
        setPurchasePrice(prev => prev + diff);

        setSumPriceItem(newSum);
        prevSumPriceItemRef.current = newSum;
    }, [localQuantity, itemPrice, setPurchasePrice]);

    // Обновление локального количества при внешнем изменении
    useEffect(() => {
        setLocalQuantity(quantity);
    }, [quantity]);

    // Обработчик изменения количества
    const handleQuantityChange = (newValue) => {
        const parsedValue = parseFloat(newValue) || 0;
        setLocalQuantity(parsedValue);
        onQuantityChange(index, parsedValue);
    };

    // Обработка выбора поставщика
    const handleProviderChange = (selectedProvider) => {
        const selected = otherOffers.find(i => i.bestComponentProvider === selectedProvider);

        if (selected) {
            setItemPrice(selected.purchaseItemPrice);
            setItemDeliveryTime(selected.deliveryTimeComponent);
            setItemBestComponentProvider(selected.bestComponentProvider);
        } else {
            setItemPrice(purchaseItemPrice);
            setItemDeliveryTime(deliveryTimeComponent);
            setItemBestComponentProvider(bestComponentProvider);
        }

        changeProcurementStatusFalse(count, purchaseState, setPurchaseState);
    };

    // Обновление состояния родительской закупки
    useEffect(() => {
        const updatedPurchase = purchase.map((p, idx) => {
            if (idx !== countItem) return p;

            return {
                ...p,
                purchaseItem: p.purchaseItem.map((i, itemIdx) => ({
                    ...i,
                    requiredQuantityItem: itemIdx === index ? localQuantity : i.requiredQuantityItem,
                    purchaseItemPrice: itemIdx === index ? itemPrice : i.purchaseItemPrice,
                    bestComponentProvider: itemIdx === index ? itemBestComponentProvider : i.bestComponentProvider,
                    deliveryTimeComponent: itemIdx === index ? itemDeliveryTime : i.deliveryTimeComponent,
                    otherOffers: [...(i.otherOffers ?? [])],
                })),
            };
        });

        setPurchase(updatedPurchase);
    }, [
        localQuantity,
        itemPrice,
        itemBestComponentProvider,
        itemDeliveryTime,
        countItem,
        index,
        purchase,
        setPurchase,
    ]);

    return (
        <>
            <td>{vendorCodeComponent}</td>
            <td>{nameComponent}</td>
            <td className="lpc-item__quantity">
                <input
                    type="number"
                    min={0}
                    value={localQuantity}
                    className="lpc-item__quantity_input"
                    onChange={(e) => handleQuantityChange(e.target.value)}
                />
            </td>
            <td className="lpc-item__price">
                {Intl.NumberFormat("ru").format(itemPrice)}
            </td>
            <td className="lpc-item__price">
                {Intl.NumberFormat("ru").format(sumPriceItem)}
            </td>
            <td className="lpc-item__price">{itemDeliveryTime}</td>

            {!roleUser && (
                <td>
                    <select
                        className="lpc-item__provider_select"
                        onChange={(e) => handleProviderChange(e.target.value)}
                    >
                        <option value={bestComponentProvider}>{bestComponentProvider}</option>
                        {(otherOffers || [])
                            .filter(i => i.bestComponentProvider !== bestComponentProvider)
                            .map(i => (
                                <option
                                    key={`${i.bestComponentProvider}-${i.guidIdComponent ?? Math.random()}`}
                                    value={i.bestComponentProvider}
                                >
                                    {i.bestComponentProvider}
                                </option>
                            ))}
                    </select>
                </td>
            )}
            <td></td>
        </>
    );
};

export default LpsTableItemEdit;
