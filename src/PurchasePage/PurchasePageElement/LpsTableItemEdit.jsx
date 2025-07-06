import { useState, useEffect } from "react";
import "./lpsTableItemEdit.css";

const LpsTableItemEdit = ({
  index,
  quantity,
  vendorCodeComponent,
  nameComponent,
  purchaseItemPrice,
  bestComponentProvider,
  onQuantityChange
}) => {
  const [localQuantity, setLocalQuantity] = useState(quantity);

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
        {Intl.NumberFormat("ru").format(purchaseItemPrice)}
      </td>
      <td className="lpc-item__price">
        {Intl.NumberFormat("ru").format(Number(localQuantity) * Number(purchaseItemPrice))}
      </td>
      <td>
        <select className="lpc-item__provider_select">
          <option value="">{bestComponentProvider}</option>
        </select>
      </td>
    </>
  );
};

export default LpsTableItemEdit;
