import { useState } from "react";
import "./createPurchaseBlock.css";
import ApiUrl from "../js/ApiUrl";
import { v4 as uuidv4 } from 'uuid';

// Компонент вводит форму добавления наименования новой закупки
const CreatePurchaseBlock = (
    {setCreatePurchase}
) => {

    const [purchaseId, setPurchaseId] = useState("");
    const [purchaseName, setPurchaseName] = useState("");

    // Достаем guidIdCollaborator
    const guidIdColl = localStorage.getItem("guidIdCollaborator");

    // Создаем новую закупку
    const addPurchase = async () => {
        if (!purchaseId.trim() || !purchaseName.trim()) {
            alert("Пожалуйста, заполните все поля формы.");
            return;
        }

        const newNamePurchase = {
            guidIdCollaborator: guidIdColl,
            guidIdPurchase: uuidv4(),
            purchaseId: purchaseId.trim(),
            purchaseName: purchaseName.trim(),
            purchasePrice: 0,
            purchaseCostomer: "",
            purchaseItem: []
        };

        const json = JSON.stringify(newNamePurchase);

        try {
            const response = await fetch(ApiUrl + "/api/SaveSupplyPurchase", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: json
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message || "Данные успешно сохранены!");
                window.location.reload();
            } else {
                const errorText = await response.text();
                console.error("Ошибка от API:", errorText);
                alert("Ошибка при сохранении данных!");
            }
        } catch (error) {
            console.error("Ошибка получения данных:", error);
            alert("Ошибка при отправке запроса!");
        }

        setCreatePurchase(false);
    };



    return (
        <>
            <div className="purchase-page__create-purchase-bloc__container">
                <h6 className="create-purchase-block__title">Создайте новую спецификацию:</h6>
                <div className="purchase-page__create-purchase-block">
                    <input 
                        className="form-control create-purchase-block__create-form-purchaseId" 
                        type="text" 
                        name="guidId"
                        maxLength={20}
                        placeholder="Идентификатор новой спецификации" 
                        aria-label="purchaseId"
                        value={purchaseId}
                        onChange={(e)=>{
                            setPurchaseId(e.target.value);
                        }}
                    />
                    <input 
                        className="form-control create-purchase-block__create-form-name" 
                        type="text" 
                        placeholder="Наименование новой спецификации" 
                        name="purchaseName"
                        maxLength={60}
                        aria-label="purchaseId"
                        value={purchaseName}
                        onChange={(e)=>{
                            setPurchaseName(e.target.value);
                        }}
                    />
                    <button 
                        type="button" 
                        className="btn btn-outline-secondary cpb__create-form-button" 
                        onClick={()=>addPurchase()}
                    >
                        Записать
                    </button>
                </div>
            </div>
        </>
    );

};

export default CreatePurchaseBlock;