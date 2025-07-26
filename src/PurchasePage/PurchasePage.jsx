import { useEffect, useState } from "react";
import "./purchasePage.css";
import ApiUrl from "../js/ApiUrl.js";
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
    // Достаем guidIdCollaborator
    const guidIdCollaborator = localStorage.getItem("guidIdCollaborator");

    //  Закупки с раскладкой по номенклатуре
    const [purchase, setPurchase] = useState([]);

    // Загрузить данные о закупках 
    useEffect(()=>{
        downloadListPurchase();
    },[])

    const downloadListPurchase =()=> {
        const responsePurchase = [];

        
        fetch(ApiUrl + "/api/ReturnListPurchase/" + guidIdCollaborator, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
     
            return response.json();
        })
        .then((data) => {
           setPurchase(data);
        })

        .catch((error) => {
            console.error("Ошибка получения данных:", error);
        });
        
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
                            components={components}
                            createPurchase={createPurchase} 
                            setCreatePurchase={setCreatePurchase}
                            purchase = {purchase}
                            setPurchase={setPurchase}
                        />
                    </div>
                    {createPurchase?
                        <div className="purchase-page-right-block">
                            <CreatePurchaseBlock
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