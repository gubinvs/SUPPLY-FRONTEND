import "./ordersPage.css";
import { useState } from "react";
import Spinners from "../ElementApplication/Spinners.jsx";
import NavigationBarMin from "../NavigationBar/NavigationBarMin.jsx";
import NavigationBarMax from "../NavigationBar/NavigationBarMax.jsx";
import HeaderApplicationPanel from "../ApplicationPanel/Header/HeaderApplicationPanel.jsx";
import ListOrdersBlock from "./ListOrdersBlock.jsx";



const OrdersPage =(
    {role, title, loading}
)=> {
        // Переключатель состояния боковой навигационной панели
        const [isNavMaxVisible, setIsNavMaxVisible] = useState(false);
        const handleShowMax = () => setIsNavMaxVisible(true);
        const handleHideMax = () => setIsNavMaxVisible(false);

        const ordersList = [{
            guidIdSupplyOrder : "5ae4b8d3-5d4c-4cb0-a664-00ff0322ca1b",
            guidIdPurchase : "f6837ba1-4974-4880-bdf5-180d584458ae",
            purchaseId : "ВП25-002",
            purchaseName : "Шкаф ldfk ldfk g;alsfg lkfhg ;alhg  a;ldksgh skdg alksdglk",
            purchasePrice : 875180,
            purchaseCostomer : "ООО \"ААА\"",
            supplyOrderUserStatus : "новый"
        }];

        return (
            <>
                <div className="main-application-panel">
                    <NavigationBarMin
                        onShowMax={handleShowMax}
                        onHideMax={handleHideMax}
                        isNavMaxVisible={isNavMaxVisible}
                    />

                    {isNavMaxVisible && <NavigationBarMax />}
                    <HeaderApplicationPanel role={role} title={title} /> 
                </div>
                <div className="main-application-panel__container">
                    {!loading?        
                        <ListOrdersBlock 
                            ordersList={ordersList}
                        />
                        :
                        <div className="orders-page-section">
                            <Spinners/>
                        </div>
                    } 
                </div>
            </>

        );

};

export default OrdersPage;