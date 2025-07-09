import { useState, useEffect } from "react";
import "./lpsTableItemEdit.css";

const LpsTableItemEdit = ({
  index,
  quantity,
  vendorCodeComponent,
  nameComponent,
  purchaseItemPrice,
  bestComponentProvider,
  onQuantityChange,
  otherOffers

}) => {
  
  // измениемое и сохраняемое значение количества компоненов, для локального хранения
  const [localQuantity, setLocalQuantity] = useState(quantity);
 
  // измениемое и сохраняемое значение стоимости в зависимости от выбранного поставщика
  const [itemPrice, setItemPrice] = useState(purchaseItemPrice);


  useEffect(() => {
    setLocalQuantity(quantity);
  }, [quantity]);

  const handleQuantityChange = (newValue) => {
    setLocalQuantity(newValue);
    onQuantityChange(index, newValue);
  };

  return (
    <>
      <td>{vendorCodeComponent}</td>
      <td>{nameComponent}</td>
      <td className="lpc-item__quantity">
        <input
          type="number"
          value={localQuantity}
          className="lpc-item__quantity_input"
          onChange={(e) => handleQuantityChange(e.target.value)}
        />
      </td>
      <td className="lpc-item__price">
        {Intl.NumberFormat("ru").format(itemPrice)}
      </td>
      <td className="lpc-item__price">
        {Intl.NumberFormat("ru").format(Number(localQuantity) * Number(purchaseItemPrice))}
      </td>
      <td>
      <select
          className="lpc-item__provider_select"
          onChange={(e) => {
            const selectedProvider = e.target.value;
            const selected = otherOffers.find(i => i.bestComponentProvider === selectedProvider);
            if (selected) {
              setItemPrice(selected.purchaseItemPrice);
            } else {
              setItemPrice(purchaseItemPrice);
            }
          }}
        >
          <option value="">{bestComponentProvider}</option>
          {otherOffers.map((i, index) => (
            <option key={index} value={i.bestComponentProvider}>
              {i.bestComponentProvider}
            </option>
          ))}
        </select>
      </td>
    </>
  );
};

export default LpsTableItemEdit;
