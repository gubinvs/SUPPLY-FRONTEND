import { useState, useEffect, useRef } from "react";
import "./lpsTableItemEdit.css";
import { useRoleId } from "../../js/Utilits/roleId.js";

const LpsTableItemEdit = ({
    index,
    quantity,
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


    // Локальное состояние количества, цены и поставщика
    const [localQuantity, setLocalQuantity] = useState(quantity);
    const [itemPrice, setItemPrice] = useState(purchaseItemPrice);
    const [itemDeliveryTime, setItemDeliveryTime] = useState(deliveryTimeComponent);
    

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
  }, [localQuantity, itemPrice]);

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
    console.log("selected", selected)
    if (selected) {
      setItemPrice(selected.purchaseItemPrice);
      setItemDeliveryTime(selected.deliveryTimeComponent);
      updatePurchaseItem(
        selected.guidIdComponent, 
        selected.purchaseItemPrice,
        selected.bestComponentProvider,
        selected.deliveryTimeComponent
      );
    } else {
      setItemPrice(purchaseItemPrice);
      setItemDeliveryTime(deliveryTimeComponent);
    }
  };


  console.log(purchase);

  const updatePurchaseItem = (
    guidIdComponent, 
    purchaseItemPrice, 
    bestComponentProvider, 
    deliveryTimeComponent
  ) => {
    const newPurchaseItem = {
        guidIdPurchase: purchase[0].guidIdPurchase,
        purchaseId: purchase[0].purchaseId,
        purchaseName: purchase[0].purchaseName,
        purchasePrice: purchase[0].purchasePrice,
        purchaseCostomer: purchase[0].purchaseCostomer,
        purchaseItem: purchase[0].purchaseItem.map((i) => ({
              guidIdPurchase: i.guidIdPurchase,
              guidIdComponent: i.guidIdComponent,
              vendorCodeComponent: i.vendorCodeComponent,
              nameComponent: i.nameComponent,
              requiredQuantityItem: i.requiredQuantityItem,
              purchaseItemPrice: guidIdComponent === i.guidIdComponent? purchaseItemPrice : i.purchaseItemPrice,
              bestComponentProvider: guidIdComponent === i.guidIdComponent? bestComponentProvider : i.bestComponentProvider,
              deliveryTimeComponent: guidIdComponent === i.guidIdComponent? deliveryTimeComponent : i.deliveryTimeComponent,
              otherOffers: i.otherOffers.map((x) => ({
                  guidIdComponent: x.guidIdComponent,
                  purchaseItemPrice: x.purchaseItemPrice,
                  bestComponentProvider: x.bestComponentProvider,
                  deliveryTimeComponent: x.deliveryTimeComponent
            }))
        }))
    };

    setPurchase(newPurchaseItem);

    console.log("newPurchaseItem",newPurchaseItem); // Optional: log or do something with it
  };


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
      <td>
        {!roleUser ? (
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
          ) : (
            <span className="lpc-item__provider_select_ban">по подписке</span>
          )}
      </td>
      <td></td>
    </>
  );
};

export default LpsTableItemEdit;
