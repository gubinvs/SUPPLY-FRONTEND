


// Изменение состояния кнопки запросить счет, при измменении данных закупки до момента ее сохранения
export const changeProcurementStatusFalse = (index, purchaseState, setPurchaseState) => {
    const updatedPurchaseState = [...purchaseState];
    updatedPurchaseState[index] = false;
    setPurchaseState(updatedPurchaseState); 
};

export const changeProcurementStatusTrue = (index, purchaseState, setPurchaseState) => {
    const updatedPurchaseState = [...purchaseState];
    updatedPurchaseState[index] = true;
    setPurchaseState(updatedPurchaseState); 
};

