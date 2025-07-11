import { useState } from "react";
import "./purchasePage.css";
import NavigationBarMax from "../NavigationBar/NavigationBarMax";
import NavigationBarMin from "../NavigationBar/NavigationBarMin";
import HeaderApplicationPanel from "../ApplicationPanel/Header/HeaderApplicationPanel";
import CreatePurchaseBlock from "./CreatePurchaseBlock.jsx";
import ListPurchaseBlock from "./ListPurchaseBlock.jsx";


// Страница с данными о закупках
const PurchasePage =(
    {role, title, components}
)=> {

    const [isNavMaxVisible, setIsNavMaxVisible] = useState(false);
    const handleShowMax = () => setIsNavMaxVisible(true);
    const handleHideMax = () => setIsNavMaxVisible(false);
    const [createPurchase, setCreatePurchase] = useState(false);
    //  Закупки с раскладкой по номенклатуре
    const [purchase, setPurchase] = useState(
        // Временные массива данных для отладки в нем собрана информация о самой закупке, в которой находятся элементы
        [{
        guidIdPurchase : "f0e61c84-7c57-46d0-897b-b0843af0ce80",
        purchaseId : "ВП25-008",
        purchaseName: "Шкаф управления (ШУ) балластными насосами",
        purchasePrice: 92500444,
        purchaseCostomer: "ООО \"Кронштадт\"", //Заказчик
        // Содержимое закупки
        purchaseItem: [
            {
                guidIdPurchase : "f0e61c84-7c57-46d0-897b-b0843af0ce80",
                guidIdComponent: "87127a71-a08f-44f4-9fcb-6b72fd7539fa",
                vendorCodeComponent:"LC1D32BD",
                nameComponent:"Пускатель магнитный 32А катушка управления 24В DС 1НО+1НЗ LC1D (LC1D32BD)",
                requiredQuantityItem: 2, // Требуемое количество
                purchaseItemPrice: 23000,
                bestComponentProvider: "ООО '\"Паритет\"",
                // Другие предложения
                otherOffers: [{
                        guidIdComponent: "e2d1c40d-b744-4188-a5b5-ec324880c7e5",
                        purchaseItemPrice: 100000,
                        bestComponentProvider: "ООО '\"ПТЦ\""
                    },
                    {
                        guidIdComponent: "e2d1c40d-b744-4188-a5b5-ec324880c7e5",
                        purchaseItemPrice: 4000,
                        bestComponentProvider: "ООО '\"ЭЛЕКТРО-ПРОФИ\""
                    }]
            },
            {
                guidIdPurchase : "f0e61c84-7c57-46d0-897b-b0843af0ce80",
                guidIdComponent: "e2d1c40d-b744-4188-a5b5-ec324880c7e5",
                vendorCodeComponent:"A9V41263",
                nameComponent:"Блок дифференциальной защиты Vigi iC60 2П 63A 30mA  AC",
                requiredQuantityItem: 4, // Требуемое количество
                purchaseItemPrice: 26000,
                bestComponentProvider: "ООО '\"ПТЦ\"",
                // Другие предложения
                otherOffers: [{
                        guidIdComponent: "e2d1c40d-b744-4188-a5b5-ec324880c7e5",
                        purchaseItemPrice: 1000,
                        bestComponentProvider: "ООО '\"ПТЦ\""
                    },
                    {
                        guidIdComponent: "e2d1c40d-b744-4188-a5b5-ec324880c7e5",
                        purchaseItemPrice: 2000,
                        bestComponentProvider: "ООО '\"ЭЛЕКТРО-ПРОФИ\""
                    }]
            }
        ],

    }]);


    // Загрузить данные о закупках
    const downloadListPurchase =()=> {
        
    };

    // Метод удаление закупки
    const deletePurchase = (guidId) => {
        setPurchase(prev => prev.filter(p => p.guidIdPurchase !== guidId));
    };

    return(
        <>
            <div className="main-application-panel">
                <NavigationBarMin
                    onShowMax={handleShowMax}
                    onHideMax={handleHideMax}
                    isNavMaxVisible={isNavMaxVisible}
                />
                {isNavMaxVisible && <NavigationBarMax />}
                <HeaderApplicationPanel role={role} title={title} />
                <div className="main-application-panel__container">
                    <div className="purchase-page-left-block">
                        <ListPurchaseBlock 
                            createPurchase={createPurchase} 
                            setCreatePurchase={setCreatePurchase}
                            purchase = {purchase}
                            setPurchase={setPurchase}
                        />
                    </div>
                    {createPurchase?
                        <div className="purchase-page-right-block">
                            <CreatePurchaseBlock
                                createPurchase={createPurchase} 
                                setCreatePurchase={setCreatePurchase}
                            />
                        </div>
                    :""}
                </div>
            </div>
        </>
    );

};

export default PurchasePage;