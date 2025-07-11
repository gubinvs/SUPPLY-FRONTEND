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
  
  // состояни роли пользователя в системе
  const { roleUser} = useRoleId();
  
  // измениемое и сохраняемое значение количества компоненов, для локального хранения
  const [localQuantity, setLocalQuantity] = useState(quantity);
 
  // измениемое и сохраняемое значение стоимости в зависимости от выбранного поставщика
  const [itemPrice, setItemPrice] = useState(purchaseItemPrice);

  // Сохраненят предыдущее значение количества, для контроля в какую сторону произошло изменение в большую или меньшую
  const prevQuantityRef = useRef();

  useEffect(()=>{

    if (prevQuantityRef.current !== undefined) {
      if (localQuantity > prevQuantityRef.current) {
        setPurchasePrice(purchasePrice+itemPrice);
        // console.log('localQuantity увеличилось');
      } else if (localQuantity < prevQuantityRef.current) {
        setPurchasePrice(purchasePrice-itemPrice);
        // console.log('localQuantity уменьшилось');
      }
    }

    prevQuantityRef.current = localQuantity;

  },[localQuantity]);


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
          {Intl.NumberFormat("ru").format(Number(localQuantity) * Number(purchaseItemPrice))}
      </td>

      <td>{!roleUser?
          <>
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
          </>
          :<span className="lpc-item__provider_select_ban">Скрыто от пользователя</span>}
      </td>
    </>
  );
};

export default LpsTableItemEdit;
