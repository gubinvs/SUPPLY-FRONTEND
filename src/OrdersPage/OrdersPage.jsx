import "./ordersPage.css";
import ApiUrl from "../js/ApiUrl.js";
import { useEffect, useState } from "react";
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
    const [ordersList, setOrdersList] = useState('');
    

    const orderList = [{
        guidIdSupplyOrder : "5ae4b8d3-5d4c-4cb0-a664-00ff0322ca1b",
        guidIdPurchase : "f6837ba1-4974-4880-bdf5-180d584458ae",
        purchaseId : "ВП25-002",
        purchaseName : "Шкаф ",
        purchasePrice : 875180,
        purchaseCostomer : "ООО \"ААА\"",
        supplyOrderUserStatus : "новый",
        orderComponent : [
            {
                vendorCodeComponent : "C40F31M320",
                nameComponent : "Выключатель автоматический в литом корпусе NSX400F 36kA 3П3Т 320A MLOGIC 1.3M",
                quantityComponent : 4,
                priceComponent : 54225,
                deliveryTimeComponent : "21-12-2025"
            },
            {
                vendorCodeComponent : "R500 AI 08 131-000-AAA",
                nameComponent : "Модуль аналогового ввода, ТПС/ТЭП, 8 каналов, поканальная гальваническая изоляция, погрешность 0,1%",
                quantityComponent : 4,
                priceComponent : 372900,
                deliveryTimeComponent : "21-12-2025"
            }
        ]
    },{
        guidIdSupplyOrder : "5ae4b8d3-5d4c-4cb0-a664-00ff0322ca1b",
        guidIdPurchase : "f6837ba1-4974-4880-bdf5-180d584458ae",
        purchaseId : "ВП25-002",
        purchaseName : "Шкаф",
        purchasePrice : 875180,
        purchaseCostomer : "ООО \"ААА\"",
        supplyOrderUserStatus : "новый",
        orderComponent : [
            {
                vendorCodeComponent : "C40F31M320",
                nameComponent : "Выключатель автоматический в литом корпусе NSX400F 36kA 3П3Т 320A MLOGIC 1.3M",
                quantityComponent : 4,
                priceComponent : 54225,
                deliveryTimeComponent : "21-12-2025"
            },
            {
                vendorCodeComponent : "R500 AI 08 131-000-AAA",
                nameComponent : "Модуль аналогового ввода, ТПС/ТЭП, 8 каналов, поканальная гальваническая изоляция, погрешность 0,1%",
                quantityComponent : 4,
                priceComponent : 372900,
                deliveryTimeComponent : "21-12-2025"
            }
        ]
    }];

    useEffect(()=>{
        // Запрос api для получения списка доступных заказов на основании 
            
                const guidIdCollaborator = localStorage.getItem("guidIdCollaborator");

                fetch(ApiUrl + "/api/ReturnOrderList/" + guidIdCollaborator, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                })
                    .then((response) => {
                        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                        return response.json();
                    })
                    .then((data) => {
                        setOrdersList(data);
                    })
                    .catch((error) => {
                        console.error("Ошибка получения данных:", error);
                    });
            
    },[]);


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