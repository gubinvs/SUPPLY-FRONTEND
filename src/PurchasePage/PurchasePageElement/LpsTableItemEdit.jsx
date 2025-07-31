import { useState, useEffect, useRef } from "react";
import "./lpsTableItemEdit.css";
import { useRoleId } from "../../js/Utilits/roleId.js";
import {changeProcurementStatusFalse} from "../../js/Utilits/changeProcurementStatus.js";

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

    // Получаем роль пользователя
    const { roleUser } = useRoleId();
    const countItem = count;


    // Локальное состояние количества, цены и поставщика
    const [localQuantity, setLocalQuantity] = useState(quantity);
    const [itemPrice, setItemPrice] = useState(purchaseItemPrice);
    const [itemDeliveryTime, setItemDeliveryTime] = useState(deliveryTimeComponent);
    const [itemBestComponentProvider, setItemBestComponentProvider] = useState(bestComponentProvider);
    

    // Сумма по данной строке
    const [sumPriceItem, setSumPriceItem] = useState(quantity * purchaseItemPrice);

    // Сохраняем предыдущую сумму строки, чтобы сравнивать и менять purchasePrice
    const prevSumPriceItemRef = useRef(quantity * purchaseItemPrice);

    // Обновляем сумму и общую закупочную стоимость при изменении количества или цены
  useEffect(() => {
    const newSum = localQuantity * itemPrice;

    if (prevSumPriceItemRef.current !== undefined) {
      const diff = newSum - prevSumPriceItemRef.current;
      setPurchasePrice(prev => prev + diff);
    }

    setSumPriceItem(newSum);
    prevSumPriceItemRef.current = newSum;
  }, [localQuantity, itemPrice, setPurchasePrice]);


    // Обновляем локальное количество при внешнем изменении
    useEffect(() => {
      setLocalQuantity(quantity);
    }, [quantity]);

    // Обработчик изменения количества
    const handleQuantityChange = (newValue) => {
      const parsedValue = parseFloat(newValue) || 0;
      setLocalQuantity(parsedValue);
      onQuantityChange(index, parsedValue);
    };

    // Обработчик изменения поставщика
    const handleProviderChange = (selectedProvider) => {
      const selected = otherOffers.find(i => i.bestComponentProvider === selectedProvider);

      if (selected) {
        setItemPrice(selected.purchaseItemPrice);
        setItemDeliveryTime(selected.deliveryTimeComponent);
        setItemBestComponentProvider(selected.bestComponentProvider);
        changeProcurementStatusFalse(count, purchaseState, setPurchaseState);
      } else {
        setItemPrice(purchaseItemPrice);
        setItemDeliveryTime(deliveryTimeComponent);
        setItemBestComponentProvider(bestComponentProvider);
      }
    };


  // Перезаписываем данные закупки при изменении данных
  useEffect(() => {
      const updatedPurchase = purchase.map((p, idx) => {
          if (idx !== countItem) return p;

          return {
              ...p,
              purchaseItem: p.purchaseItem.map((i, count) => ({
                  ...i,
                  requiredQuantityItem: count === index ? localQuantity : i.requiredQuantityItem,
                  purchaseItemPrice: count === index ? itemPrice : i.purchaseItemPrice,
                  bestComponentProvider: count === index ? itemBestComponentProvider : i.bestComponentProvider,
                  deliveryTimeComponent: count === index ? itemDeliveryTime : i.deliveryTimeComponent,
                  otherOffers: i.otherOffers.map(x => ({ ...x }))
              }))
          };
      });

      setPurchase(updatedPurchase);
  }, [
      purchase,
      countItem,
      index,
      localQuantity,
      itemPrice,
      itemBestComponentProvider,
      itemDeliveryTime,
      setPurchase
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
      <td className="lpc-item__price">
          {itemDeliveryTime}
      </td>
      
        {!roleUser ? (
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
          ) : ""}
      <td></td>
    </>
  );
};

export default LpsTableItemEdit;
