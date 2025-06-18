// Панель администратора

import React, { useState } from "react";
import "./applicationPanel.css";
import NavigationBarMin from "../NavigationBar/NavigationBarMin.jsx";
import NavigationBarMax from "../NavigationBar/NavigationBarMax.jsx";
import HeaderApplicationPanel from "../ApplicationPanel/Header/HeaderApplicationPanel.jsx";
import InformationPanel from "./InformationPanel/InformationPanel.jsx";

const ApplicationPanelAdmin = (
    {role, title}
) => {
    const [isNavMaxVisible, setIsNavMaxVisible] = useState(false);

    const handleShowMax = () => setIsNavMaxVisible(true);
    const handleHideMax = () => setIsNavMaxVisible(false);

    return (

        <div className="main-application-panel">
            <NavigationBarMin
                onShowMax={handleShowMax}
                onHideMax={handleHideMax}
                isNavMaxVisible={isNavMaxVisible}
            />

            {isNavMaxVisible && <NavigationBarMax />}

            <HeaderApplicationPanel role={role} title={title} />
            {/* Панель с данными о компании пользователя и данными пользователя */}
            <InformationPanel role={role}  /> 
            {/* Панель для редактирования номенклатуры */}

        </div>

    );
};

export default ApplicationPanelAdmin;

