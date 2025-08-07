import { useEffect, useState, useCallback } from "react";
import "./purchasePage.css";
import ApiUrl from "../js/ApiUrl.js";
import NavigationBarMax from "../NavigationBar/NavigationBarMax";
import NavigationBarMin from "../NavigationBar/NavigationBarMin";
import HeaderApplicationPanel from "../ApplicationPanel/Header/HeaderApplicationPanel";
import CreatePurchaseBlock from "./CreatePurchaseBlock.jsx";
import ListPurchaseBlock from "./ListPurchaseBlock.jsx";
import Spinners from "../ElementApplication/Spinners.jsx";

const PurchasePage = (
    { role, title, components, profitability, loading }
) => {
    const [isNavMaxVisible, setIsNavMaxVisible] = useState(false);
    const handleShowMax = () => setIsNavMaxVisible(true);
    const handleHideMax = () => setIsNavMaxVisible(false);

    const guidIdCollaborator = localStorage.getItem("guidIdCollaborator");
    const [purchase, setPurchase] = useState([]);

    const downloadListPurchase = useCallback(() => {
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
    }, [guidIdCollaborator]);

    useEffect(() => {
        downloadListPurchase();
    }, [downloadListPurchase]);

    return (
        <div className="main-application-panel">
            <NavigationBarMin
                onShowMax={handleShowMax}
                onHideMax={handleHideMax}
                isNavMaxVisible={isNavMaxVisible}
            />
            {isNavMaxVisible && <NavigationBarMax />}
            <HeaderApplicationPanel role={role} title={title} />
            <div className="main-application-panel__container">
                <div className="purchase-page__container">
                    <CreatePurchaseBlock />
                    {!loading?
                        <ListPurchaseBlock 
                            components={components}
                            purchase={purchase}
                            setPurchase={setPurchase}
                            profitability={profitability}
                        />
                        :<Spinners/>
                    }
                </div>
            </div>
        </div>
    );
};

export default PurchasePage;
