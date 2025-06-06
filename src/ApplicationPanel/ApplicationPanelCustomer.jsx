import React, { useState, useEffect } from "react";
import "./applicationPanel.css";
import NavigationBarMin from "../NavigationBar/NavigationBarMin.jsx";
import NavigationBarMax from "../NavigationBar/NavigationBarMax.jsx";
import EditPriceComponent from "../EditPriceComponent/EditPriceComponent.jsx";
import HeaderApplicationPanel from "./Header/HeaderApplicationPanel.jsx";

const ApplicationPanelCustomer = () => {
    const [isNavMaxVisible, setIsNavMaxVisible] = useState(false);
    const [role, setRole] = useState("");

    useEffect(() => {
        const roleId = localStorage.getItem("roleId");

        if (roleId === "b5aff5b0-c3ac-4f1e-9467-fe13a14f6de3") {
            setRole("Администратор");
        } else if (roleId === "a5219e2b-12f3-490e-99f5-1be54c55cc6d") {
            setRole("Поставщик");
        } else if (roleId === "52910536-2b8a-47e7-9d5a-8cca0a0b865a") {
            setRole("Заказчик");
        } else {
            setRole("Неизвестная роль");
        }
    }, []);

    const handleShowMax = () => setIsNavMaxVisible(true);
    const handleHideMax = () => setIsNavMaxVisible(false);

    return (
        <div className="application-panel-section">
            <NavigationBarMin
                onShowMax={handleShowMax}
                onHideMax={handleHideMax}
                isNavMaxVisible={isNavMaxVisible}
            />

            {isNavMaxVisible && <NavigationBarMax />}

            <div className="application-panel__body">
                <div className="application-panel__container">
                    <HeaderApplicationPanel role={role} />
                    <EditPriceComponent />
                </div>
            </div>
        </div>
    );
};

export default ApplicationPanelCustomer;
