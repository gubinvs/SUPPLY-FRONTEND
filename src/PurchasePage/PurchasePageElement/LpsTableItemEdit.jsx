import { useState, useEffect, useRef } from "react";
import "./lpsTableItemEdit.css";
import { useRoleId } from "../../js/Utilits/roleId.js";

const LpsTableItemEdit = ({
  index,
  quantity,
  purchasePrice,
  setPurchasePrice,
  vendorCodeComponent,
  nameComponent,
  purchaseItemPrice,
  bestComponentProvider,
  onQuantityChange,
  otherOffers
}) => {

  // Получаем роль пользователя
  const { roleUser } = useRoleId();

  // Локальное состояние количества и цены
  const [localQuantity, setLocalQuantity] = useState(quantity);
  const [itemPrice, setItemPrice] = useState(purchaseItemPrice);

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
    if (selected) {
      setItemPrice(selected.purchaseItemPrice);
    } else {
      setItemPrice(purchaseItemPrice);
    }
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
      <td>
        {!roleUser ? (
          <select
            className="lpc-item__provider_select"
            onChange={(e) => handleProviderChange(e.target.value)}
          >
            <option value={bestComponentProvider}>{bestComponentProvider}</option>
            {otherOffers.map((i, idx) => (
              i.bestComponentProvider !== bestComponentProvider && (
                <option key={idx} value={i.bestComponentProvider}>
                  {i.bestComponentProvider}
                </option>
              )
            ))}
          </select>
        ) : (
          <span className="lpc-item__provider_select_ban">Скрыто от пользователя</span>
        )}
      </td>
    </>
  );
};

export default LpsTableItemEdit;
