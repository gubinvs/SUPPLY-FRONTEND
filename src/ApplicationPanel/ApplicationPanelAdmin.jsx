// Панель администратора

import React, { useState } from "react";
import "./applicationPanel.css";
import NavigationBarMin from "../NavigationBar/NavigationBarMin.jsx";
import NavigationBarMax from "../NavigationBar/NavigationBarMax.jsx";
import EditPriceComponent from "../EditPriceComponent/EditPriceComponent.jsx";

const ApplicationPanelAdmin = () => {
    const [isNavMaxVisible, setIsNavMaxVisible] = useState(false);

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
                    <h1 className="application-panel__title">Панель Администратора</h1>
                    <EditPriceComponent />
                </div>
            </div>
        </div>
    );
};

export default ApplicationPanelAdmin;

